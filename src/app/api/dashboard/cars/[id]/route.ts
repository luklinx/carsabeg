import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const id = await (async (p: any) => {
    if (!p) return undefined;
    if (typeof p.id === "string") return p.id;
    if (typeof p.then === "function") return (await p)?.id;
    return undefined;
  })(params);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Only allow owners to delete their own listing
    const { data: existing } = await supabase
      .from("cars")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();
    if (!existing || (existing as any).user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("cars")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Invalidate caches
    try {
      const cache = await import("@/lib/cache");
      await cache.delByPrefix("search:");
      await cache.delByPrefix("suggest:");
    } catch (e) {
      console.error("Failed to invalidate cache after delete:", e);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Owner delete error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServer();
    // Basic validation of id to avoid passing the literal string "undefined"
    const id = await (async (p: any) => {
      if (!p) return undefined;
      if (typeof p.id === "string") return p.id;
      if (typeof p.then === "function") return (await p)?.id;
      return undefined;
    })(params);
    if (!id || id === "undefined") {
      console.error("Invalid car id in request:", params);
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let data: any = null;
    try {
      const res = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (res.error) {
        console.error("Supabase select error:", res.error);
        return NextResponse.json({ error: res.error.message }, { status: 500 });
      }
      data = res.data ?? null;
    } catch (e: any) {
      console.error("Unexpected error selecting car:", e);
      return NextResponse.json(
        { error: String(e?.message || e) },
        { status: 500 }
      );
    }

    // Resolve approver email for convenience in the UI. Guard against bad
    // values like the literal string "undefined" which can cause DB errors
    // when compared to a UUID column.
    let approver_email: string | null = null;
    try {
      const approvedBy = data?.approved_by;
      if (
        approvedBy &&
        approvedBy !== "undefined" &&
        typeof approvedBy === "string"
      ) {
        const { data: u } = await supabase
          .from("users")
          .select("email")
          .eq("id", approvedBy)
          .maybeSingle();
        approver_email = u?.email ?? null;
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json(
      { data: { ...data, approver_email } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Get car error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json().catch(() => ({}));

    const id = await (async (p: any) => {
      if (!p) return undefined;
      if (typeof p.id === "string") return p.id;
      if (typeof p.then === "function") return (await p)?.id;
      return undefined;
    })(params);
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // Only allow owners to update their own listing (non-admin flow)
    const { data: existing } = await supabase
      .from("cars")
      .select("user_id")
      .eq("id", id)
      .maybeSingle();
    if (!existing || (existing as any).user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("cars")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Invalidate cache after successful update
    try {
      const cache = await import("@/lib/cache");
      await cache.delByPrefix("search:");
      await cache.delByPrefix("suggest:");
    } catch (e) {
      console.error("Failed to invalidate cache after update:", e);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Patch car error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
