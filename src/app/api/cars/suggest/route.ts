import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

const { wrapCache } = await import("@/lib/cache");

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const q = (url.searchParams.get("q") || "").trim();
    if (!q) {
      return NextResponse.json(
        { error: "q parameter is required" },
        { status: 400 }
      );
    }

    const type = (url.searchParams.get("type") || "all").toLowerCase();
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10))
    );

    const cacheKey = `suggest:${type}:${q}:${limit}`;

    // Use cache wrapper with short TTL (10s)
    const result = await wrapCache(cacheKey, 10, async () => {
      // compute suggestions below and return them
      const supabase = getSupabaseServer();

      const suggestions: Array<{ id: string; label: string; type: string }> =
        [];

      // Helper for fetching and mapping rows
      const fetchFrom = async (table: string, col: string, t: string) => {
        const { data, error } = await supabase
          .from(table)
          .select(`${col} as label, id`)
          .ilike(col, `%${q}%`)
          .limit(limit);

        if (error) {
          console.error(`Suggest fetch error (${table}):`, error);
          return [] as Array<{ id: string; label: string; type: string }>;
        }

        return (data || []).map((r: any) => ({
          id: String(r.id),
          label: String(r.label),
          type: t,
        }));
      };

      if (type === "make") {
        suggestions.push(...(await fetchFrom("makes", "name", "make")));
      } else if (type === "model") {
        suggestions.push(...(await fetchFrom("models", "name", "model")));
      } else if (type === "dealer" || type === "dealers") {
        suggestions.push(...(await fetchFrom("dealers", "name", "dealer")));
      } else {
        // all: query makes, models and dealers, interleave
        const [makes, models, dealers] = await Promise.all([
          fetchFrom("makes", "name", "make"),
          fetchFrom("models", "name", "model"),
          fetchFrom("dealers", "name", "dealer"),
        ]);
        suggestions.push(...makes.slice(0, limit));
        if (suggestions.length < limit)
          suggestions.push(...models.slice(0, limit - suggestions.length));
        if (suggestions.length < limit)
          suggestions.push(...dealers.slice(0, limit - suggestions.length));
      }

      // Deduplicate by label
      const deduped: Record<string, any> = {};
      for (const s of suggestions) {
        if (!deduped[s.label.toLowerCase()]) deduped[s.label.toLowerCase()] = s;
      }
      const final = Object.values(deduped).slice(0, limit) as Array<{
        id: string;
        label: string;
        type: string;
      }>;
      return final;
    });

    return NextResponse.json({ success: true, data: result, cached: false });
  } catch (err: unknown) {
    console.error("Suggest GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
