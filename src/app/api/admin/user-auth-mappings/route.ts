import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  return supabase;
}

export async function GET() {
  const supabase = await getSupabase();

  // Ensure caller is an admin
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", authUser.email ?? "")
    .maybeSingle();

  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ data: mappings }, { data: users }] = await Promise.all([
    supabase.from("user_auth_accounts").select("auth_id, user_id, created_at"),
    supabase.from("users").select("id, full_name, email"),
  ]);

  return NextResponse.json({ mappings, users });
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

  // Ensure caller is an admin
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", authUser.email ?? "")
    .maybeSingle();

  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { auth_id, user_id } = body as { auth_id?: string; user_id?: string };

  if (!auth_id || !user_id) {
    return NextResponse.json(
      { error: "auth_id and user_id are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("user_auth_accounts")
      .upsert({ auth_id, user_id }, { onConflict: "auth_id" })
      .select("auth_id, user_id, created_at")
      .maybeSingle();

    if (error) {
      console.error("admin mapping creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ mapping: data ?? null });
  } catch (err: unknown) {
    console.error("admin mapping exception:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
