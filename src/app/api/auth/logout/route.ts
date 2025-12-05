// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/authCookies";

export async function POST() {
  try {
    clearUserCookie();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
