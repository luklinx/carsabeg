// src/app/api/cars/report-abuse/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { car_id, dealer_id, reason, details, user_email } = body;

    if (!car_id || !reason) {
      return NextResponse.json(
        { error: "car_id and reason required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Log the abuse report
    const { error } = await supabase
      .from("car_reports")
      .insert([
        {
          car_id,
          dealer_id,
          report_type: "abuse",
          reason,
          details: details || "",
          user_email: user_email || "anonymous",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message:
        "Report submitted successfully. Our team will review it shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
