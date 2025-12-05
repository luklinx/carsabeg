// src/app/api/cars/mark-unavailable/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { car_id, reason } = body;

    if (!car_id) {
      return NextResponse.json({ error: "car_id required" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // Log the unavailable report
    const { error } = await supabase
      .from("car_reports")
      .insert([
        {
          car_id,
          report_type: "unavailable",
          reason: reason || "Marked as unavailable by user",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Car marked as unavailable. Thank you for the update!",
    });
  } catch (err: unknown) {
    console.error("Mark unavailable error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
