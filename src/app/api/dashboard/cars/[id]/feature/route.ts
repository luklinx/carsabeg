import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

export async function POST(
  req: Request,
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
    // Parse body early to make the route resilient and improve logging
    let body: any = {};
    try {
      body = await req.json().catch(() => ({}));
    } catch (e) {
      body = {};
    }

    // Accept id either as part of params (resolved above) or as a fallback in the request body
    let targetId =
      id ?? (body?.id && typeof body.id === "string" ? body.id : undefined);

    if (!targetId || targetId === "undefined") {
      console.error("Invalid id for feature: params=", params, "body=", body);
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

    console.log(
      "Admin feature called - using id:",
      targetId,
      "params:",
      params,
      "body.id:",
      body?.id
    );

    const days =
      typeof body.days === "number" && body.days > 0 ? body.days : 30;
    const today = new Date();
    const expiry = new Date(today.setDate(today.getDate() + days))
      .toISOString()
      .split("T")[0];

    // Include moderation audit fields and status when marking premium
    const updatedObj: any = {
      featured_paid: true,
      featured_until: expiry,
      approved: true,
      status: "approved",
      moderation_notes: null,
    };

    // Only set `approved_by` if that user exists in `users` table to avoid FK errors
    try {
      const { data: approverRow } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      if (approverRow) {
        updatedObj.approved_by = user.id;
      } else {
        updatedObj.approved_by = null;
      }
    } catch (e) {
      updatedObj.approved_by = null;
    }

    updatedObj.approved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("cars")
      .update(updatedObj)
      .eq("id", targetId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      // Update did not affect any row
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Feature route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
