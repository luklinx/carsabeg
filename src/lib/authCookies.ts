import { cookies } from "next/headers";

// Centralized helpers for setting/clearing the auth cookie.
// Uses `cookies()` from Next.js server runtime.
export function setUserCookie(userId: string) {
  const cookieStore = cookies();
  // Use explicit options to ensure secure defaults.
  cookieStore.set({
    name: "user_id",
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax",
  });
}

export function clearUserCookie() {
  const cookieStore = cookies();
  cookieStore.delete("user_id", { path: "/" });
}
