# Filters — Cache & Infra (Redis)

Status: Draft / Implemented (basic)

This document describes the caching strategy for search/suggest/facets and the Redis integration implemented in `src/lib/cache.ts`.

## Goals

- Reduce repeated DB work for identical filter/suggest requests.
- Provide flexible TTL and fallback to in-memory cache when Redis is not configured (development).
- Support easy invalidation on content changes (car CRUD, dealer/make updates).

## Implementation

- `src/lib/cache.ts` provides typed helpers:

  - `getCache<T>(key)` -> Promise<T | null>
  - `setCache<T>(key, value, ttlSeconds?)` -> Promise<void>
  - `delCache(key)` -> Promise<void>
  - `delByPrefix(prefix)` -> Promise<void> (new, helper to invalidate key prefixes)
  - `wrapCache<T>(key, ttlSeconds, loader)` -> Promise<T>

- The module uses the `redis` package (v4) when `REDIS_URL` env var is set; otherwise it uses a simple in-memory Map fallback.
- The implementation dynamically imports `redis` at runtime, so your development build will not fail if `redis` is not installed.
- Connections are lazily established and reused via `global.__redisClient` to avoid reconnect overhead.

## Usage

- `GET /api/cars/search` uses `wrapCache(searchKey, 5, loader)` to cache result objects for 5 seconds.
- `GET /api/cars/suggest` uses `wrapCache(suggestKey, 10, loader)` to cache suggestion lists for 10 seconds.

## Invalidation

- When a car changes (create/update/delete) the service should call `delCache()` for affected keys or a key-space pattern if using Redis.
- Practical approach: when a car changes, invalidate related simple keys:
  - `search:*` (if dataset small, or track per-entity keys for targeted invalidation)
  - `suggest:*` for updated dealer/make/model names

## Next steps

- Add an invalidation helper that accepts entity info and invalidates related keys efficiently (e.g., using Redis key prefixes and `SCAN`/`UNLINK`).
- Add instrumentation & metrics for cache hit/miss rate.

Document author: GitHub Copilot
Date: 2025-12-26
