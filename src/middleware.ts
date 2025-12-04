// middleware.ts (ROOT OF PROJECT)
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;

  // Protect all /admin routes
  if (url.pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If logged in and trying to access /admin/login → redirect to dashboard
  if (url.pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/admin/login"],
};
