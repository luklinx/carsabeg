import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    // Parse body up-front (safe to fail) so we can log it for debug/fallback
    let body: any = {};
    try {
      body = await _req.json().catch(() => ({} as any));
    } catch (e) {
      body = {};
    }

    // Accept id either as part of params or as a fallback in the request body to be resilient
    const resolvedParamId = await (async (p: any) => {
      if (!p) return undefined;
      if (typeof p.id === "string") return p.id;
      if (typeof p.then === "function") return (await p)?.id;
      return undefined;
    })(params);
    let targetId =
      resolvedParamId ??
      (body?.id && typeof body.id === "string" ? body.id : undefined);
    if (!targetId || targetId === "undefined") {
      console.error("Invalid id for delete: params=", params, "body=", body);
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
      "Admin delete called - using id:",
      targetId,
      "params:",
      params,
      "body.id:",
      body?.id
    );
    const { data, error } = await supabase
      .from("cars")
      .delete()
      .eq("id", targetId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      // Nothing was deleted
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Delete route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
