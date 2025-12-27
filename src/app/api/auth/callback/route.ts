// app/api/auth/callback/route.ts
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStorage = {
      getItem: async (key: string) => {
        const c = await cookies();
        const value = c.get(key)?.value ?? null;
        return value;
      },
      setItem: async (key: string, value: string) => {
        const c = await cookies();
        c.set({ name: key, value, path: "/" });
      },
      removeItem: async (key: string) => {
        const c = await cookies();
        c.delete(key);
      },
    };

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storage: cookieStorage,
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin + "/admin");
}
