import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock NextResponse.json to return a plain object for testability
vi.mock("next/server", () => ({
  NextResponse: {
    json: (payload: unknown, opts?: { status?: number }) => ({
      payload,
      status: opts?.status ?? 200,
    }),
  },
}));

const mockCars = [
  {
    id: "1",
    make: "Toyota",
    model: "Corolla",
    price: 15000,
    year: 2018,
    mileage: 50000,
    seller_type: "Private",
    body_type: "Sedan",
    exterior_color: "White",
    interior_color: "Black",
    market: "UAE",
  },
  {
    id: "2",
    make: "Toyota",
    model: "Camry",
    price: 22000,
    year: 2020,
    mileage: 20000,
    seller_type: "Dealer",
    body_type: "Sedan",
    exterior_color: "Silver",
    interior_color: "Grey",
    market: "UAE",
  },
];

const mockSupabase = {
  from: (table: string) => {
    const chain: any = {
      ilike: (_col: string, _val: string) => chain,
      eq: (_col: string, _val: any) => chain,
      gte: (_col: string, _val: number) => chain,
      lte: (_col: string, _val: number) => chain,
      or: (_expr: string) => chain,
      order: (_col: string, _opts?: object) => chain,
      range: (_from: number, _to: number) =>
        Promise.resolve({ data: mockCars, error: null, count: 2 }),
      limit: (_n: number) => Promise.resolve({ data: mockCars, error: null }),
    } as any;

    // select should be callable and return the same chain
    chain.select = (_cols: string, _opts?: object) => chain;

    return chain;
  },
};

vi.mock("@/lib/supabaseServer", () => ({
  getSupabaseServer: () => mockSupabase,
}));

// Mock cache module to avoid Redis during tests
vi.mock("@/lib/cache", () => ({
  wrapCache: async (key: string, ttl: number, loader: Function) => {
    return loader();
  },
}));

import { GET } from "@/app/api/cars/search/route";

describe("GET /api/cars/search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cars and meta with default paging", async () => {
    const req = { nextUrl: new URL("http://localhost/api/cars/search") } as any;

    const res = await GET(req);
    const body = (res as any).payload;

    expect(body).toBeDefined();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta.page).toBe(1);
    expect(body.meta.page_size).toBe(12);
  });

  it("accepts filters and paging params", async () => {
    const req = {
      nextUrl: new URL(
        "http://localhost/api/cars/search?page=2&page_size=1&make=Toyota"
      ),
    } as any;

    const res = await GET(req);
    const body = (res as any).payload;

    expect(body.meta.page).toBe(2);
    expect(body.meta.page_size).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it("applies regional filters and returns facets", async () => {
    const req = {
      nextUrl: new URL(
        "http://localhost/api/cars/search?seller_type=Private&market=UAE"
      ),
    } as any;

    const res = await GET(req);
    const body = (res as any).payload;

    expect(body.success).toBe(true);
    expect(body.facets).toBeDefined();
    expect(body.facets.seller_type).toBeDefined();
    // We expect the Private seller_type to have at least 1 count
    expect(body.facets.seller_type["Private"]).toBeGreaterThanOrEqual(1);
    expect(body.facets.market["UAE"]).toBeGreaterThanOrEqual(1);
  });
});
