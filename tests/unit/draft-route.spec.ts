import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/sell/draft/route";
import * as supabaseLib from "@/lib/supabaseServer";

const makeRequest = (body: unknown) =>
  new Request("http://localhost/api/sell/draft", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/api/sell/draft POST", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults seller_type from profile when draft omits it", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "auth-3", email: "c@d.com" } },
        }),
      },
      from: vi.fn((table: string) => {
        if (table === "user_auth_accounts") {
          return {
            select: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null }) }),
            }),
          };
        }
        if (table === "users") {
          return {
            select: () => ({
              eq: (_k: string, _v: string) => ({
                maybeSingle: async () => ({
                  data: { id: "auth-3", seller_type: "Dealer" },
                }),
              }),
            }),
            upsert: () => ({}),
          };
        }
        if (table === "cars") {
          return {
            select: () => ({
              eq: (_k: string, _v: any) => ({
                eq: (_k2: string, _v2: any) => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            }),
            insert: (obj: any) => ({
              select: () => ({
                maybeSingle: async () => ({ data: { id: "draft-1", ...obj } }),
              }),
            }),
          };
        }
        if (table === "car_events") {
          return { insert: vi.fn().mockResolvedValue({}) };
        }
        return {};
      }),
    } as any;

    vi.spyOn(supabaseLib, "getSupabaseServer").mockImplementation(
      () => mockSupabase as any
    );

    const draft = {
      make: "Mazda",
      model: "3",
      year: 2016,
      price: 6000,
      images: ["x.jpg"],
    };

    const res = await POST(makeRequest({ draft }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect((json.data as any).seller_type).toBe("Dealer");
  });
});
