import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    json: (payload: unknown, opts?: { status?: number }) => ({
      payload,
      status: opts?.status ?? 200,
    }),
  },
}));

const mockDistinct = [
  {
    seller_type: "Private",
    body_type: "Sedan",
    exterior_color: "White",
    interior_color: "Black",
  },
  {
    seller_type: "Dealer",
    body_type: "SUV",
    exterior_color: "Silver",
    interior_color: "Grey",
  },
];

const mockSupabase = {
  from: (_: string) => ({
    select: (_cols: string) => ({
      limit: (_n: number) =>
        Promise.resolve({ data: mockDistinct, error: null }),
    }),
  }),
};

vi.mock("@/lib/supabaseServer", () => ({
  getSupabaseServer: () => mockSupabase,
}));

import { GET } from "@/app/api/cars/metadata/route";

describe("GET /api/cars/metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns canonical lists with data from DB", async () => {
    const res = await GET();
    const body = (res as any).payload;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.seller_types)).toBe(true);
    expect(body.data.seller_types).toContain("Private");
    expect(body.data.body_types).toContain("Sedan");
    expect(body.data.exterior_colors).toContain("White");
  });
});
