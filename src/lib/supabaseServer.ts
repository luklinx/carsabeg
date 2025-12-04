// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Lazy initialize to avoid calling cookies() during static build
let cachedClient: ReturnType<typeof createServerClient> | null = null;

export function getSupabaseServer() {
  // Only instantiate when called (in a request context)
  if (!cachedClient) {
    cachedClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookieStore = await cookies(); // await the cookie store
            return cookieStore.get(name)?.value;
          },
          async set(
            name: string,
            value: string,
            options: Record<string, unknown>
          ) {
            try {
              (await cookies()).set(name, value, options);
            } catch {
              // Safe ignore in Server Components
            }
          },
          async remove(name: string) {
            try {
              (await cookies()).delete(name);
            } catch {
              // Safe ignore in Server Components
            }
          },
        },
      }
    );
  }

  return cachedClient;
}
