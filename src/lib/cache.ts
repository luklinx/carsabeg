// Dynamically import `redis` at runtime only when REDIS_URL is set so
// builds won't fail when `redis` is not installed during development.
// If you want Redis in production: install `redis` (v4+) and set REDIS_URL.

type RedisClientType = {
  get: (k: string) => Promise<string | null>;
  set: (k: string, v: string, opts?: { EX?: number }) => Promise<void>;
  del: (...keys: string[]) => Promise<number>;
  scan: (
    cursor: number,
    opts?: { MATCH?: string; COUNT?: number }
  ) => Promise<[string, string[]]>;
  connect: () => Promise<void>;
  on: (event: string, cb: (err: unknown) => void) => void;
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// In-memory fallback cache
const memCache = new Map<string, { expires: number; value: Json }>();

declare global {
  // attach client to global to avoid reconnect storms
  var __redisClient: RedisClientType | undefined;
}

async function getRedisClient(): Promise<RedisClientType | null> {
  // Lazily initialize a single Redis client stored on globalThis to avoid reconnect storms
  const globalAny = global as unknown as { __redisClient?: RedisClientType };
  if (!process.env.REDIS_URL) return null;
  if (globalAny.__redisClient) return globalAny.__redisClient;

  try {
    // Use a non-statically-analyzed dynamic import so TypeScript doesn't require
    // the `redis` package to be present at build-time when it's optional.
    const dynamicImport = new Function("path", "return import(path)") as (
      path: string
    ) => Promise<unknown>;
    const mod = (await dynamicImport("redis")) as unknown as {
      createClient: (opts: { url?: string }) => RedisClientType;
    };

    const { createClient } = mod;
    const client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err: unknown) =>
      console.error("Redis client error:", err)
    );
    await client.connect();
    globalAny.__redisClient = client;
    return client as RedisClientType;
  } catch (err) {
    // If redis isn't available at build/runtime, keep running with the in-memory fallback
    console.warn(
      "Redis package not available or failed to import; continuing with in-memory cache. Install 'redis' and set REDIS_URL to enable Redis.",
      err
    );
    return null;
  }
}

export async function getCache<T extends Json = Json>(
  key: string
): Promise<T | null> {
  try {
    const client = await getRedisClient();
    if (client) {
      const str = await client.get(key);
      if (!str) return null;
      return JSON.parse(str) as T;
    }
  } catch (err) {
    console.error("Redis get error, falling back to memory cache:", err);
  }

  const item = memCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    memCache.delete(key);
    return null;
  }
  return item.value as T;
}

export async function setCache<T extends Json = Json>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<void> {
  try {
    const client = await getRedisClient();
    const str = JSON.stringify(value);
    if (client) {
      if (ttlSeconds) await client.set(key, str, { EX: ttlSeconds });
      else await client.set(key, str);
      return;
    }
  } catch (err) {
    console.error("Redis set error, falling back to memory cache:", err);
  }

  memCache.set(key, {
    expires: Date.now() + (ttlSeconds ? ttlSeconds * 1000 : 60_000),
    value: value as Json,
  });
}

export async function delCache(key: string): Promise<void> {
  try {
    const client = await getRedisClient();
    if (client) {
      await client.del(key);
      return;
    }
  } catch (err) {
    console.error("Redis del error, falling back to memory cache:", err);
  }

  memCache.delete(key);
}

export async function delByPrefix(prefix: string): Promise<void> {
  try {
    const client = await getRedisClient();
    if (client) {
      // Use SCAN to find keys matching the prefix and delete them in batches
      const pattern = `${prefix}*`;
      let cursor = 0;
      do {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reply: any = await client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = Number(reply[0]);
        const keys: string[] = reply[1] || [];
        if (keys.length) await client.del(...keys);
      } while (cursor !== 0);
      return;
    }
  } catch (err) {
    console.error(
      "Redis delByPrefix error, falling back to memory cache:",
      err
    );
  }

  for (const key of Array.from(memCache.keys())) {
    if (key.startsWith(prefix)) memCache.delete(key);
  }
}

export async function wrapCache<T extends Json = Json>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) return cached;
  const v = await loader();
  await setCache<T>(key, v, ttlSeconds);
  return v;
}
