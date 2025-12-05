// src/app/api/cars/feedback/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dealer_id, rating, comment, user_email } = body;

    if (!dealer_id || !rating || !user_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Insert feedback into database
    const { data, error } = await supabase
      .from("seller_feedback")
      .insert([
        {
          dealer_id,
          rating,
          comment: comment || "",
          user_email,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("Feedback POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const dealer_id = req.nextUrl.searchParams.get("dealer_id");

    if (!dealer_id) {
      return NextResponse.json(
        { error: "dealer_id required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { data: feedbacks, error } = await supabase
      .from("seller_feedback")
      .select("*")
      .eq("dealer_id", dealer_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate average rating
    const avgRating =
      feedbacks.length > 0
        ? (
            feedbacks.reduce(
              (sum: number, f: { rating: number }) => sum + f.rating,
              0
            ) / feedbacks.length
          ).toFixed(1)
        : 0;

    return NextResponse.json({
      feedbacks,
      average_rating: avgRating,
      total_reviews: feedbacks.length,
    });
  } catch (err: unknown) {
    console.error("Feedback GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
