import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { car_id, message, name, phone, user_id } = body || {};
    if (!car_id || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      car_id,
      message,
      name: name || null,
      phone: phone || null,
      user_id: user_id || null,
    };

    const { data, error } = await supabaseAdmin
      .from("seller_messages")
      .insert(payload)
      .select("id")
      .limit(1);
    if (error) {
      const errMsg =
        (error as { message?: string; hint?: string })?.message ??
        JSON.stringify(error);
      // If the error indicates the table is missing, return an actionable message
      const missingTablePattern =
        /relation\s+"?seller_messages"?\s+does not exist/i;
      let human = errMsg;
      if (missingTablePattern.test(errMsg) || /no such table/i.test(errMsg)) {
        human =
          "Missing table seller_messages — run DB migration: db/migrations/010_create_seller_messages_table.sql";
      }
      return NextResponse.json({ error: human }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.[0]?.id || null });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
