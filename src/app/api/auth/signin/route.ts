// src/app/api/auth/signin/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { setUserCookie } from "@/lib/authCookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set session cookie
    setUserCookie(user.id);

    return NextResponse.json({
      success: true,
      message: "Signed in successfully",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
