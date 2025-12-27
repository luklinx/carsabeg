// src/app/api/auth/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Prefer checking an `admins` DB table (if present). Fall back to environment allowlist.
    let is_admin = false;
    try {
      const { data: adminRow, error: adminErr } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email)
        .maybeSingle();

      if (!adminErr && adminRow) {
        is_admin = true;
      }
    } catch (e) {
      // ignore — table may not exist
    }

    if (!is_admin) {
      const adminList = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      is_admin =
        adminList.length > 0
          ? adminList.includes((user.email || "").toLowerCase())
          : false;
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user_id: user.id,
      email: user.email,
      is_admin,
    });
  } catch (err: unknown) {
    console.error("Auth check error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
