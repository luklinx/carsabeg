import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { status } = body as { status?: string };
    if (!status)
      return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const id = await (async (p: any) => {
      if (!p) return undefined;
      if (typeof p.id === "string") return p.id;
      if (typeof p.then === "function") return (await p)?.id;
      return undefined;
    })(params);
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("inspections")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Failed to update inspection status:", error);
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, inspection: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
