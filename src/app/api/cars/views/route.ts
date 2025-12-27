import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) {
      return NextResponse.json({ error: "Missing car id" }, { status: 400 });
    }

    // Read current views_count then increment — simple approach
    const { data: current, error: selErr } = await supabaseAdmin
      .from("cars")
      .select("views_count")
      .eq("id", id)
      .single();

    if (selErr) {
      console.error("views select error", selErr);
      // still attempt increment via update to initialize
    }

    const currentCount = (current && (current.views_count as number)) || 0;

    const { error: updErr } = await supabaseAdmin
      .from("cars")
      .update({ views_count: currentCount + 1 })
      .eq("id", id);

    if (updErr) {
      console.error("views update error", updErr);
      return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
    }

    return NextResponse.json({ id, views: currentCount + 1 });
  } catch (err) {
    console.error("views route error", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
