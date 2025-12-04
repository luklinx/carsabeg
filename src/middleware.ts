import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseCookieHeader(header: string) {
  if (!header) return [] as { name: string; value: string }[];
  return header
    .split(";")
    .map((c) => c.split("=").map((s) => s.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] !== "")
    .map(([name, ...vals]) => ({
      name,
      value: decodeURIComponent(vals.join("=")),
    }));
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request header
        getAll: async () => {
          const header = req.headers.get("cookie") ?? "";
          return parseCookieHeader(header);
        },
        // Apply Set-Cookie headers to the outgoing response
        setAll: async (cookies) => {
          try {
            for (const c of cookies) {
              // NextResponse.cookies.set accepts (name, value, options)
              // c.options comes from @supabase/ssr and is compatible enough for casting
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              res.cookies.set(c.name, c.value, c.options || {});
            }
          } catch {
            // Ignore in middleware if setting cookies fails
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return res;
}

export const config = { matcher: ["/admin/:path*"] };
