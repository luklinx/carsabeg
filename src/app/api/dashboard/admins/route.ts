import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    const { user, is_admin, supabase } = await getAdminUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!is_admin)
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );

    const { data, error } = await supabase
      .from("admins")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (err) {
    console.error("Admins GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user, is_admin, supabase } = await getAdminUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!is_admin)
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );

    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    if (!isValidEmail(email))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    // prevent duplicates
    const { data: existing } = await supabase
      .from("admins")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
    if (existing)
      return NextResponse.json({ error: "Already an admin" }, { status: 409 });

    const { data, error } = await supabase
      .from("admins")
      .insert({ email })
      .select()
      .maybeSingle();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Admins POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
