import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

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
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const action = body.action || "approve"; // approve, reject, needs_changes, flagged
    const notes = body.notes ?? null;

    if (ids.length === 0)
      return NextResponse.json({ error: "No ids provided" }, { status: 400 });

    const updateObj: any = {};
    if (action === "approve") {
      updateObj.approved = true;
      updateObj.status = "approved";
      updateObj.approved_by = user.id;
      updateObj.approved_at = new Date().toISOString();
      updateObj.moderation_notes = notes;
    } else {
      // other moderation states
      updateObj.approved = false;
      updateObj.status = action;
      updateObj.moderation_notes = notes;
      // when rejecting/flagging we clear approved audit
      updateObj.approved_by = null;
      updateObj.approved_at = null;
    }

    const { data, error } = await supabase
      .from("cars")
      .update(updateObj)
      .in("id", ids)
      .select();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Bulk action error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
