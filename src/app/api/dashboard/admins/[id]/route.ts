import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

async function resolveId(
  params: { id: string } | Promise<{ id: string }> | undefined
) {
  if (!params) return undefined;
  if (params instanceof Promise) {
    try {
      const p = await params;
      return p?.id;
    } catch {
      return undefined;
    }
  }
  if (typeof params === "object" && "id" in params) {
    return params.id;
  }
  return undefined;
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const id = await resolveId(params);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const { user, is_admin, supabase } = await getAdminUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!is_admin)
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );

    // Check count to avoid lockout if there are no fallback ADMIN_EMAILS
    const { count } = await supabase
      .from("admins")
      .select("id", { count: "exact", head: true });
    const fallback = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if ((count ?? 0) <= 1 && fallback.length === 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete the last admin. Add another admin first or set ADMIN_EMAILS env var.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("admins")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Admins DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
