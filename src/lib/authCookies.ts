import { cookies } from "next/headers";

// Centralized helpers for setting/clearing the auth cookie.
// Uses `cookies()` from Next.js server runtime (async).
export async function setUserCookie(userId: string) {
  const cookieStore = await cookies();
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

export async function clearUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
}
