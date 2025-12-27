import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import type {
  PostgrestQueryBuilder,
  PostgrestResponse,
} from "@supabase/postgrest-js";

export async function GET(req: NextRequest) {
  const start = Date.now();

  try {
    const url = req.nextUrl;
    const params = url.searchParams;

    const page = Math.max(1, parseInt(params.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(params.get("page_size") || "12", 10))
    );

    // Basic filters
    const make = params.get("make");
    const model = params.get("model");
    const city = params.get("city");
    const dealer_name = params.get("dealer_name") || params.get("dealer");
    const keyword = params.get("keyword");

    const priceMin = params.get("price_min");
    const priceMax = params.get("price_max");
    const yearMin = params.get("year_min");
    const yearMax = params.get("year_max");

    // Regional/spec filters
    const seller_type = params.get("seller_type");
    const body_type = params.get("body_type");
    const exterior_color = params.get("exterior_color");
    const interior_color = params.get("interior_color");
    const market = params.get("market");

    const cacheModule = await import("@/lib/cache");
    const supabase = getSupabaseServer();

    // create a normalized cache key from params
    const cacheKeyObj = {
      make,
      model,
      city,
      dealer_name,
      keyword,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
      page,
      pageSize,
    };
    const cacheKey = `search:${JSON.stringify(cacheKeyObj)}`;

    const resp = await cacheModule.wrapCache(cacheKey, 5, async () => {
      // Helper to apply all filters consistently to a supabase query
      const applyFiltersToQuery = (q: PostgrestQueryBuilder<any, any, any>) => {
        // many postgrest typing helpers infer methods as `any` so cast locally when calling
        if (make) q = (q as any).ilike("make", `%${make}%`);
        if (model) q = (q as any).ilike("model", `%${model}%`);
        if (city) q = (q as any).ilike("city", `%${city}%`);
        if (dealer_name)
          q = (q as any).ilike("dealer_name", `%${dealer_name}%`);
        if (keyword) {
          q = (q as any).or(
            `make.ilike.%${keyword}%,model.ilike.%${keyword}%,dealer_name.ilike.%${keyword}%,description.ilike.%${keyword}%`
          );
        }

        if (priceMin) q = (q as any).gte("price", Number(priceMin));
        if (priceMax) q = (q as any).lte("price", Number(priceMax));

        if (yearMin) q = (q as any).gte("year", Number(yearMin));
        if (yearMax) q = (q as any).lte("year", Number(yearMax));

        // regional specs
        if (seller_type) q = (q as any).eq("seller_type", seller_type);
        if (body_type) q = (q as any).eq("body_type", body_type);
        if (exterior_color)
          q = (q as any).ilike("exterior_color", `%${exterior_color}%`);
        if (interior_color)
          q = (q as any).ilike("interior_color", `%${interior_color}%`);
        if (market) q = (q as any).eq("market", market);

        return q as PostgrestQueryBuilder<any, any, any>;
      };

      // Build base query
      const query = applyFiltersToQuery(
        supabase
          .from("cars")
          .select(
            `id, make, model, price, year, mileage, transmission, fuel, dealer_name, dealer_phone, images, featured, status, views_count, city, state, created_at`,
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
      ) as any; // treat as any to access runtime helper methods like .range()

      // Offset pagination (simple & robust)
      const offset = (page - 1) * pageSize;
      const to = offset + pageSize - 1;

      const rangeResp = await (query.range(offset, to) as Promise<
        PostgrestResponse<Record<string, unknown>>
      >);
      const { data, error, count } = rangeResp;

      if (error) {
        console.error("Search error:", error);
        throw new Error(error.message);
      }

      const total = typeof count === "number" ? count : null;
      const totalPages = total ? Math.ceil(total / pageSize) : null;

      // Facet aggregation (naive approach: fetch up to N rows per facet and aggregate in server)
      // Note: For large datasets prefer materialized views or GROUP BY queries in SQL for accurate counts.
      const facetCols = [
        "seller_type",
        "body_type",
        "exterior_color",
        "interior_color",
        "market",
      ];

      const facets: Record<string, Record<string, number>> = {};

      await Promise.all(
        facetCols.map(async (col) => {
          const qBuilder = applyFiltersToQuery(supabase.from("cars"));
          const facetResp = (await (qBuilder
            .select(`${col}`)
            .limit(5000) as any)) as PostgrestResponse<Record<string, unknown>>;
          const rows = facetResp.data ?? [];
          const counts: Record<string, number> = {};
          (rows ?? []).forEach((r) => {
            const val = (r as Record<string, unknown>)[col] ?? "";
            if (!val) return;
            counts[String(val)] = (counts[String(val)] ?? 0) + 1;
          });
          facets[col] = counts;
        })
      );

      const ms = Date.now() - start;

      const result = {
        success: true,
        data: data ?? [],
        meta: {
          page,
          page_size: pageSize,
          total,
          total_pages: totalPages,
        },
        facets,
        timings: { ms },
      } as const;

      // Ensure the cached payload is JSON-serializable and compatible with our cache type
      return JSON.parse(JSON.stringify(result));
    });

    return NextResponse.json(resp);
  } catch (err: unknown) {
    console.error("Search GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
