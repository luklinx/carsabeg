import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  return supabase;
}

export async function GET(req: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", authUser.email ?? "")
    .maybeSingle();

  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const slotId = searchParams.get("slotId");
  if (!slotId)
    return NextResponse.json({ error: "slotId required" }, { status: 400 });

  const { data: bookings, error } = await supabase
    .from("inspections")
    .select(
      "id, car_id, name, phone, email, preferred_time, scheduled_time, status, message, created_at"
    )
    .eq("slot_id", slotId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", authUser.email ?? "")
    .maybeSingle();

  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { bookingId, _method } = body as {
    bookingId?: string;
    _method?: string;
  };

  // Support form-based _method=cancel
  if (_method === "cancel" && body.id) {
    const bId = body.id as string;
    const { data, error } = await supabase
      .from("inspections")
      .update({ status: "cancelled" })
      .eq("id", bId)
      .select()
      .single();

    if (error) {
      console.error("failed to cancel booking:", error);
      return NextResponse.json(
        { error: "Failed to cancel booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, booking: data });
  }

  if (!bookingId)
    return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  try {
    const { data, error } = await supabase
      .from("inspections")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("failed to cancel booking:", error);
      return NextResponse.json(
        { error: "Failed to cancel booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, booking: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
