import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    const { user, is_admin, supabase } = await getAdminUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!is_admin)
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") || "20", 10)
    );
    const offset = (page - 1) * limit;

    // Fetch paginated pending cars. If the `status` column doesn't exist
    // (older DB state), fall back to using the `approved` boolean.
    let data: any[] | null = null;
    let count: number | null = null;

    try {
      const q = await supabase
        .from("cars")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (q.error) throw q.error;
      data = q.data || [];

      const cnt = await supabase
        .from("cars")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (cnt.error) throw cnt.error;
      count = (cnt.count as number) ?? 0;
    } catch (e: any) {
      const msg = (e && e.message) || String(e || "");
      // If missing `status` column, fall back to approved=false
      if (/column .*status does not exist/i.test(msg)) {
        const q = await supabase
          .from("cars")
          .select("*")
          .eq("approved", false)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);
        if (q.error)
          return NextResponse.json({ error: q.error.message }, { status: 500 });
        data = q.data || [];

        const cnt = await supabase
          .from("cars")
          .select("id", { count: "exact", head: true })
          .eq("approved", false);
        if (cnt.error)
          return NextResponse.json(
            { error: cnt.error.message },
            { status: 500 }
          );
        count = (cnt.count as number) ?? 0;
      } else {
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }

    return NextResponse.json(
      { data: data || [], meta: { page, limit, total: count ?? 0 } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Pending list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
