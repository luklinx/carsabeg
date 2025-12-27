import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { car_id, reason, reporter } = body || {};
    if (!car_id || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      car_id,
      reason,
      reporter: reporter || null,
    };

    const { error } = await supabaseAdmin.from("ad_reports").insert(payload);
    if (error) {
      const errMsg =
        (error as { message?: string; hint?: string })?.message ??
        JSON.stringify(error);
      const missingTablePattern = /relation\s+"?ad_reports"?\s+does not exist/i;
      let human = errMsg;
      if (missingTablePattern.test(errMsg) || /no such table/i.test(errMsg)) {
        human =
          "Missing table ad_reports — run DB migration: db/migrations/011_create_ad_reports_table.sql";
      }
      return NextResponse.json({ error: human }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
