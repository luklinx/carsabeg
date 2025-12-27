// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST() {
  try {
    const supabase = getSupabaseServer();

    // Sign out via the server Supabase client so server-side session cookies are cleared
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
