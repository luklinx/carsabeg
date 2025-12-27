import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

interface Car {
  make?: string;
  city?: string;
  views_count?: number;
}

interface CreatedCar {
  id: string;
  created_at: string;
  approved_at?: string;
}

interface Approval {
  approved_at: string | null;
}

export async function GET() {
  try {
    const { user, is_admin, supabase } = await getAdminUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!is_admin)
      return NextResponse.json(
        { error: "Forbidden: admin only" },
        { status: 403 }
      );

    // Basic counts
    const totalRes = await supabase
      .from("cars")
      .select("id", { count: "exact", head: true });
    const pendingRes = await supabase
      .from("cars")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    const approvedRes = await supabase
      .from("cars")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved");

    const total = totalRes.count ?? 0;
    const pending = pendingRes.count ?? 0;
    const approved = approvedRes.count ?? 0;

    // Simple top makes & cities (JS aggregation; limited to first 10k rows to avoid huge scans)
    const { data: carsSlice } = await supabase
      .from("cars")
      .select("make, city, views_count")
      .limit(10000);

    const makeCounts: Record<string, number> = {};
    const cityViews: Record<string, number> = {};

    (carsSlice || []).forEach((c: Car) => {
      if (c.make) makeCounts[c.make] = (makeCounts[c.make] || 0) + 1;
      if (c.city)
        cityViews[c.city] = (cityViews[c.city] || 0) + (c.views_count || 0);
    });

    const topMakes = Object.entries(makeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([make, count]) => ({ make, count }));

    const topCities = Object.entries(cityViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, views]) => ({ city, views }));

    // Approvals timeseries and conversion for a configurable range (default 30 days)
    const rangeDays = 30; // could be made configurable via query param later
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (rangeDays - 1));

    const { data: approvals } = await supabase
      .from("cars")
      .select("approved_at")
      .gte("approved_at", startDate.toISOString())
      .order("approved_at", { ascending: true });

    const days: string[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const approvalsSeries = days.map((d) => ({ date: d, count: 0 }));
    (approvals || []).forEach((a: Approval) => {
      if (!a.approved_at) return;
      const day = a.approved_at.split("T")[0];
      const idx = approvalsSeries.findIndex((x) => x.date === day);
      if (idx >= 0) approvalsSeries[idx].count += 1;
    });

    // Conversion: new listings created in range vs approvals in range
    const { data: created } = await supabase
      .from("cars")
      .select("id, created_at, approved_at")
      .gte("created_at", startDate.toISOString())
      .limit(20000);

    const createdCount = (created || []).length;
    const approvedInRange = (created || []).filter(
      (c: CreatedCar) => c.approved_at && new Date(c.approved_at) >= startDate
    ).length;
    const conversionRate =
      createdCount > 0
        ? Number(((approvedInRange / createdCount) * 100).toFixed(2))
        : 0;

    // Expand topCities to include more cities for charting
    const topCitiesFull = Object.entries(cityViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([city, views]) => ({ city, views }));

    return NextResponse.json(
      {
        data: {
          total,
          pending,
          approved,
          topMakes,
          topCities: topCitiesFull,
          approvalsSeries,
          createdCount,
          approvedInRange,
          conversionRate,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Stats route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
