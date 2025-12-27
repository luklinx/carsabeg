import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Returns canonical metadata (seller types, body types, colors) for listing form selects
export async function GET() {
  const supabase = await getSupabaseServer();

  // Ideally, a canonical source would be a maintained table, but as an interim
  // we'll gather distinct values from existing cars and return a small curated
  // default list to ensure UX consistency.

  const { data: distincts, error } = await supabase
    .from("cars")
    .select(`seller_type, body_type, exterior_color, interior_color`)
    .limit(1000);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  const sellerTypes = new Set<string>();
  const bodyTypes = new Set<string>();
  const exteriorColors = new Set<string>();
  const interiorColors = new Set<string>();

  (distincts ?? []).forEach((r: Record<string, unknown>) => {
    const st = r.seller_type as string | undefined;
    const bt = r.body_type as string | undefined;
    const ec = r.exterior_color as string | undefined;
    const ic = r.interior_color as string | undefined;
    if (st) sellerTypes.add(st);
    if (bt) bodyTypes.add(bt);
    if (ec) exteriorColors.add(ec);
    if (ic) interiorColors.add(ic);
  });

  // Add small curated defaults to avoid empty lists on fresh DBs
  const canonicalSellerTypes = ["Private", "Dealer", "Fleet"];
  const canonicalBodyTypes = [
    "Sedan",
    "Hatchback",
    "SUV",
    "Coupe",
    "Convertible",
  ];
  const canonicalColors = ["White", "Black", "Silver", "Grey", "Blue", "Red"];

  return NextResponse.json({
    success: true,
    data: {
      seller_types: Array.from(
        new Set([...canonicalSellerTypes, ...Array.from(sellerTypes)])
      ),
      body_types: Array.from(
        new Set([...canonicalBodyTypes, ...Array.from(bodyTypes)])
      ),
      exterior_colors: Array.from(
        new Set([...canonicalColors, ...Array.from(exteriorColors)])
      ),
      interior_colors: Array.from(
        new Set([...canonicalColors, ...Array.from(interiorColors)])
      ),
    },
  });
}
