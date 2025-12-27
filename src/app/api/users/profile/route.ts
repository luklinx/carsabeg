// src/app/api/users/profile/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("id, full_name, email, phone, profile_photo_url, seller_type")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      // Return more details in dev to help debugging (safe to remove in production)
      return NextResponse.json(
        { error: "Failed to fetch profile", details: error.message || error },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: profile });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = getSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, phone, profile_photo_url, seller_type } = body;

    if (!full_name || !phone) {
      return NextResponse.json(
        { error: "Full name and phone are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        full_name,
        phone,
        profile_photo_url: profile_photo_url || null,
        seller_type: seller_type ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: data,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
