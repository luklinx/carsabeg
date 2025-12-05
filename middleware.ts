import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect /dashboard routes — redirect unauthenticated users to /auth/signin
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on /dashboard and its subpaths
  if (pathname.startsWith("/dashboard")) {
    const userId = req.cookies.get("user_id");

    if (!userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
