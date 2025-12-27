// lib/supabaseServer.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr"; // ← THIS IMPORT FIXES EVERYTHING

// Lazy initialize to avoid calling cookies() during static build
let cachedClient: ReturnType<typeof createServerClient> | null = null;

export function getSupabaseServer() {
  if (!cachedClient) {
    cachedClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          },
          async set(name: string, value: string, options: CookieOptions) {
            // ← FIXED: CookieOptions
            try {
              (await cookies()).set(name, value, options);
            } catch {
              // Safe ignore in Server Components
            }
          },
          async remove(name: string, options: CookieOptions) {
            // ← FIXED: CookieOptions
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
