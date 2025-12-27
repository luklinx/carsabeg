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

  // Ensure caller is an admin
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
  const carId = searchParams.get("carId");

  let q = supabase
    .from("inspection_slots")
    .select("*")
    .order("start_at", { ascending: true });
  if (carId) q = q.eq("car_id", carId);

  const { data: slots, error } = await q;
  if (error) {
    console.error("failed to fetch slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }

  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabase();

  // Ensure caller is an admin
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

  // Parse body defensively (support JSON and urlencoded forms)
  let body: Record<string, unknown> = {};
  try {
    body = await req.json().catch(() => ({}));
  } catch {
    const t = await req.text();
    const params = new URLSearchParams(t);
    params.forEach((v, k) => (body[k] = v));
  }

  // Support form-based deletion via hidden _method=delete
  if (body._method === "delete" && body.id) {
    const { error } = await supabase
      .from("inspection_slots")
      .delete()
      .eq("id", body.id);
    if (error) {
      console.error("failed to delete slot:", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // Support canceling all bookings for a slot via _method=cancel_bookings (admin-only)
  if (body._method === "cancel_bookings" && body.id) {
    try {
      const { data: updated, error: updErr } = await supabase
        .from("inspections")
        .update({ status: "cancelled" })
        .neq("status", "cancelled")
        .eq("slot_id", body.id)
        .select();

      if (updErr) {
        console.error("failed to cancel bookings for slot:", updErr);
        return NextResponse.json(
          { error: "Failed to cancel bookings" },
          { status: 500 }
        );
      }

      const cancelledCount = Array.isArray(updated) ? updated.length : 0;
      return NextResponse.json({ ok: true, cancelled: cancelledCount });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  const { car_id, start_at, end_at, capacity } = body as {
    car_id?: string | null;
    start_at?: string;
    end_at?: string;
    capacity?: number;
  };

  if (!start_at || !end_at) {
    return NextResponse.json(
      { error: "start_at and end_at are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("inspection_slots")
      .insert({
        car_id: car_id || null,
        start_at,
        end_at,
        capacity: capacity || 1,
      })
      .select()
      .single();

    if (error) {
      console.error("failed to create slot:", error);
      return NextResponse.json(
        { error: "Failed to create slot" },
        { status: 500 }
      );
    }

    return NextResponse.json({ slot: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await getSupabase();

  // Ensure caller is an admin
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
  const id = searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase
    .from("inspection_slots")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("failed to delete slot:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
