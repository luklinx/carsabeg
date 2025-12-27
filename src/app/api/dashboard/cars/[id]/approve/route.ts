import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

export async function POST(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Parse body and accept id from params or body as fallback
    let body: any = {};
    try {
      body = await req.json().catch(() => ({}));
    } catch (e) {
      body = {};
    }

    const resolvedParamId = await (async (p: any) => {
      if (!p) return undefined;
      if (typeof p.id === "string") return p.id;
      if (typeof p.then === "function") return (await p)?.id;
      return undefined;
    })(params);

    let targetId = resolvedParamId;
    if (!targetId || targetId === "undefined") {
      if (typeof body.id === "string" && body.id) targetId = body.id;
    }

    if (!targetId || targetId === "undefined") {
      console.error("Invalid id for approve: params=", params, "body=", body);
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { user, is_admin, supabase } = await getAdminUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!is_admin) {
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );
    }

    const notes = body.notes ?? null;
    const requestedStatus =
      (body.status as string | undefined) ??
      (body.approved !== undefined
        ? body.approved
          ? "approved"
          : "pending"
        : undefined);

    // Determine status and approved boolean
    const status =
      requestedStatus ??
      (body.approved
        ? "approved"
        : body.approved === false
        ? "pending"
        : undefined);
    const approved = status ? status === "approved" : !!body.approved;

    // Build update object with auditing info
    const updatedObj: any = { moderation_notes: notes };
    if (status) updatedObj.status = status;
    updatedObj.approved = approved;

    // Only set `approved_by` if that user exists in `users` table to avoid FK errors
    if (approved) {
      let approverExists = false;
      try {
        const { data: approverRow } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();
        approverExists = !!approverRow;
      } catch (e) {
        approverExists = false;
      }

      if (approverExists) {
        updatedObj.approved_by = user.id;
      } else {
        // We still mark approved, but cannot set approved_by due to FK — leave null
        updatedObj.approved_by = null;
      }

      updatedObj.approved_at = new Date().toISOString();
    } else {
      // clearing audit info when setting non-approved statuses
      updatedObj.approved_by = null;
      updatedObj.approved_at = null;
    }

    const { data, error } = await supabase
      .from("cars")
      .update(updatedObj)
      .eq("id", targetId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Resolve approver email for convenience in UI
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
      } else if (!approvedBy && user?.email) {
        // If we couldn't set approved_by (no users row), return the admin email as approver for UI clarity
        approver_email = user.email ?? null;
      }
    } catch (e) {
      // ignore
    }

    // Invalidate search/suggest caches so approval status change is reflected
    try {
      const cache = await import("@/lib/cache");
      await cache.delByPrefix("search:");
      await cache.delByPrefix("suggest:");
    } catch (e) {
      console.error("Failed to invalidate cache after approve:", e);
    }

    return NextResponse.json(
      { data: { ...data, approver_email } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Approve route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
