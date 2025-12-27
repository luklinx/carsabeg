import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

type Body = {
  carId?: string | number;
  name?: string;
  phone?: string;
  when?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({}));

    if (!body || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If carId provided, ensure the car exists
    if (body.carId) {
      const { data: carRecord, error: carErr } = await supabaseAdmin
        .from("cars")
        .select("id")
        .eq("id", body.carId)
        .maybeSingle();

      if (carErr || !carRecord) {
        console.error("car not found for inspection booking", carErr);
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }
    }

    // Slot handling / conflict checks
    let slotId = (body as any).slotId as string | undefined;

    if (slotId) {
      // Validate slot exists
      const { data: slot, error: slotErr } = await supabaseAdmin
        .from("inspection_slots")
        .select("id, start_at, end_at, capacity")
        .eq("id", slotId)
        .maybeSingle();

      if (slotErr || !slot) {
        console.error("slot not found:", slotErr);
        return NextResponse.json({ error: "Slot not found" }, { status: 404 });
      }

      // Count existing bookings for this slot (excluding cancelled)
      const { count } = await supabaseAdmin
        .from("inspections")
        .select("id", { count: "exact", head: true })
        .eq("slot_id", slotId)
        .neq("status", "cancelled");

      const booked = Number(count || 0);
      if (booked >= (slot.capacity || 1)) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 409 }
        );
      }

      // We'll use the slot start as the scheduled_time
      (body as any).when = slot.start_at;
    } else if (body.when && body.carId) {
      // If booking by arbitrary time, prevent same-car exact-time double-booking
      // Parse and normalize the scheduled_time
      const parsed = new Date(body.when);
      if (!isNaN(parsed.getTime())) {
        const iso = parsed.toISOString();
        const { data: existing, error: existingErr } = await supabaseAdmin
          .from("inspections")
          .select("id")
          .eq("car_id", body.carId)
          .eq("scheduled_time", iso)
          .maybeSingle();

        if (existingErr) console.error("booked lookup failed:", existingErr);
        if (existing) {
          return NextResponse.json(
            { error: "This car is already booked for that time" },
            { status: 409 }
          );
        }
      }
    }

    // Insert a booking record
    const payload = {
      car_id: body.carId || null,
      name: body.name || null,
      phone: body.phone || null,
      preferred_time: body.when || null,
      scheduled_time: body.when ? new Date(body.when).toISOString() : null,
      slot_id: slotId || null,
      message: body.message || null,
      status: "pending",
    };

    const { data, error } = await supabaseAdmin
      .from("inspections")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("inspections insert error:", error);
      const msg =
        (error && (error.message || error.details || JSON.stringify(error))) ||
        "";
      if (
        String(msg).toLowerCase().includes("already full") ||
        (String(msg).toLowerCase().includes("slot") &&
          String(msg).toLowerCase().includes("full"))
      ) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to save booking" },
        { status: 500 }
      );
    }

    // send notifications (email to admin, optional email to user, sms to dealer) — best effort
    try {
      const { sendInspectionNotifications } = await import(
        "@/lib/notifications"
      );
      // fetch car to include dealer contact info (if provided)
      let carRecord = null;
      if (payload.car_id) {
        const { data: c } = await supabaseAdmin
          .from("cars")
          .select("*")
          .eq("id", payload.car_id)
          .maybeSingle();
        carRecord = c || null;
      }

      const notifyRes = await sendInspectionNotifications({
        booking: data,
        car: carRecord,
      });
      // Return the booking and notification results
      return NextResponse.json({ ok: true, booking: data, notify: notifyRes });
    } catch (err) {
      console.error("notification error:", err);
      return NextResponse.json({
        ok: true,
        booking: data,
        notify: { ok: false, error: String(err) },
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
