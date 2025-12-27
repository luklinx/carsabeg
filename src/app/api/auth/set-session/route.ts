import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const access_token = body?.access_token;
    const refresh_token = body?.refresh_token;

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

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

    // Persist session into cookies so server-side code can read it
    await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("set-session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
