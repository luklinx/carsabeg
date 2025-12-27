import { describe, it, expect, vi, beforeEach } from "vitest";

const mockMakes = [
  { id: 1, name: "Toyota" },
  { id: 2, name: "Ford" },
];
const mockModels = [
  { id: 10, name: "Corolla" },
  { id: 11, name: "Camry" },
];
const mockDealers = [{ id: 100, name: "Super Motors" }];

// Mock supabase server
const mockSupabase = {
  from: (table: string) => ({
    select: (_cols: string) => ({
      ilike: (_col: string, _val: string) => ({
        limit: (_n: number) =>
          Promise.resolve({
            data:
              table === "makes"
                ? mockMakes
                : table === "models"
                ? mockModels
                : mockDealers,
            error: null,
          }),
      }),
    }),
  }),
};

vi.mock("@/lib/supabaseServer", () => ({
  getSupabaseServer: () => mockSupabase,
}));
vi.mock("next/server", () => ({
  NextResponse: {
    json: (payload: unknown, opts?: { status?: number }) => ({
      payload,
      status: opts?.status ?? 200,
    }),
  },
}));

// Mock cache module to avoid Redis during tests
vi.mock("@/lib/cache", () => ({
  wrapCache: async (key: string, ttl: number, loader: Function) => {
    return loader();
  },
}));

import { GET } from "@/app/api/cars/suggest/route";

describe("GET /api/cars/suggest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when q missing", async () => {
    const req = {
      nextUrl: new URL("http://localhost/api/cars/suggest"),
    } as any;
    const res = await GET(req);
    expect(res.status).toBe(400);
    expect((res as any).payload.error).toBeDefined();
  });

  it("returns suggestions across types when type=all", async () => {
    const req = {
      nextUrl: new URL("http://localhost/api/cars/suggest?q=to"),
    } as any;

    const res = await GET(req);
    expect((res as any).payload.success).toBe(true);
    expect(Array.isArray((res as any).payload.data)).toBe(true);
    expect((res as any).payload.data.length).toBeGreaterThan(0);
  });

  it("returns make suggestions when type=make", async () => {
    const req = {
      nextUrl: new URL("http://localhost/api/cars/suggest?q=to&type=make"),
    } as any;
    const res = await GET(req);
    expect((res as any).payload.success).toBe(true);
    expect((res as any).payload.data[0].type).toBe("make");
  });
});
