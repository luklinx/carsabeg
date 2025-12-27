import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const carId = url.searchParams.get("carId");

    // Fetch slots for car + global (car_id IS NULL)
    let q = supabaseAdmin.from("inspection_slots").select("*");
    if (carId) {
      // return slots where car_id is null (global) or matches carId
      q = q.or(`car_id.is.null,car_id.eq.${carId}`);
    }

    const { data: slots, error: slotsErr } = await q.order("start_at", {
      ascending: true,
    });

    if (slotsErr) {
      console.error("error fetching slots:", slotsErr);
      return NextResponse.json(
        { error: "Failed to fetch slots" },
        { status: 500 }
      );
    }

    const slotIds = (slots || []).map((s: any) => s.id).filter(Boolean);

    let counts: Record<string, number> = {};
    if (slotIds.length) {
      const { data: agg, error: aggErr } = await supabaseAdmin.rpc(
        "count_bookings_by_slot",
        { slot_ids: slotIds }
      );
      if (aggErr) {
        console.error("aggregation rpc error:", aggErr);
      } else {
        (agg || []).forEach((r: any) => {
          counts[r.slot_id] = Number(r.count);
        });
      }
    }

    // Map slots with availability
    const annotated = (slots || []).map((s: any) => {
      const booked = counts[s.id] || 0;
      return {
        ...s,
        booked,
        available: (s.capacity || 1) - booked > 0,
      };
    });

    return NextResponse.json({ slots: annotated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
