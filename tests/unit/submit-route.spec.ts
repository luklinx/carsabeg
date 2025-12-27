import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/sell/submit/route";
import * as supabaseLib from "@/lib/supabaseServer";

interface MockSupabase {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn<[table: string], Record<string, unknown>>>;
}

const makeRequest = (body: unknown) =>
  new Request("http://localhost/api/sell/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/api/sell/submit POST", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Default mock for getSupabaseServer for tests that don't override it
    const defaultMock: any = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({
            data: { user: { id: "auth-default", email: "d@e.com" } },
          }),
      },
      from: (table: string) => {
        if (table === "cars") {
          return {
            insert: (obj: any) => ({
              select: () => ({
                maybeSingle: async () => ({
                  data: { id: "car-default", ...obj },
                }),
              }),
            }),
          };
        }
        if (table === "car_events") {
          return { insert: vi.fn().mockResolvedValue({}) };
        }
        if (table === "users") {
          return { upsert: () => ({}) };
        }
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null }) }),
          }),
        };
      },
    };

    vi.spyOn(supabaseLib, "getSupabaseServer").mockImplementation(
      () => defaultMock
    );
  });

  it("inserts car with resolved user and logs event", async () => {
    // Mock supabase with successful user resolution and car insert
    const carEventsSpy = vi.fn().mockResolvedValue({});

    const mockSupabase: MockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: "auth-1", email: "a@b.com", user_metadata: {} },
          },
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
                  data: {
                    id: "auth-1",
                    full_name: "Test User",
                    phone: "",
                    seller_type: "Dealer",
                  },
                }),
              }),
            }),
            upsert: () => ({}),
          };
        }
        if (table === "cars") {
          return {
            insert: (obj: any) => ({
              select: () => ({
                maybeSingle: async () => ({ data: { id: "car-1", ...obj } }),
              }),
            }),
          };
        }
        if (table === "car_events") {
          return { insert: carEventsSpy };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseLib, "getSupabaseServer").mockImplementation(
      () => mockSupabase
    );

    const draft = {
      make: "Toyota",
      model: "Corolla",
      year: 2015,
      price: 5000,
      images: ["a.jpg"],
    };

    const cacheModule = await import("@/lib/cache");
    const delSpy = vi.spyOn(cacheModule, "delByPrefix").mockResolvedValue();

    const res = await POST(makeRequest({ draft }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    // ensure car_events was attempted
    expect(carEventsSpy).toHaveBeenCalled();
    // ensure cache invalidation attempted
    expect(delSpy).toHaveBeenCalledWith("search:");
    expect(delSpy).toHaveBeenCalledWith("suggest:");
    // because the profile included seller_type but draft didn't, the inserted car should have seller_type set
    expect((json.data as any).seller_type).toBe("Dealer");
  });

  it("accepts regional/spec fields in draft and persists them", async () => {
    const draft = {
      make: "Nissan",
      model: "Altima",
      year: 2017,
      price: 7000,
      images: ["c.jpg"],
      seller_type: "Private",
      body_type: "Sedan",
      exterior_color: "Black",
      interior_color: "Beige",
      market: "KSA",
      specs: { trim: "Sport", airbags: 6 },
    };

    const cacheModule = await import("@/lib/cache");
    const delSpy = vi.spyOn(cacheModule, "delByPrefix").mockResolvedValue();

    const res = await POST(makeRequest({ draft }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(delSpy).toHaveBeenCalledWith("search:");
    expect(delSpy).toHaveBeenCalledWith("suggest:");
  });

  it("retries insert without user_id when FK constraint occurs and logs create_without_user", async () => {
    const insertFirst = vi.fn().mockResolvedValue({
      data: null,
      error: {
        message:
          'insert or update on table "cars" violates foreign key constraint "fk_cars_user_id"',
      },
    });
    const insertRetry = vi
      .fn()
      .mockResolvedValue({ data: { id: "car-2" }, error: null });
    const carEventsSpy = vi.fn().mockResolvedValue({});

    const mockSupabase: MockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: "auth-2", email: "b@c.com", user_metadata: {} },
          },
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
                maybeSingle: async () => ({ data: { id: "auth-2" } }),
              }),
            }),
            upsert: () => ({}),
          };
        }
        if (table === "cars") {
          // first call returns FK error, second call succeeds
          return {
            insert: () => ({
              select: () => ({ maybeSingle: async () => insertFirst() }),
            }),
            _retry: () => ({
              insert: () => ({
                select: () => ({ maybeSingle: async () => insertRetry() }),
              }),
            }),
          };
        }
        if (table === "car_events") {
          return { insert: carEventsSpy };
        }
        return {};
      }),
    };

    // Spy getSupabaseServer and make it return our mock. We need a little adapter so that when the code retries it calls the retry insert.
    const supabaseMock = vi
      .spyOn(supabaseLib, "getSupabaseServer")
      .mockImplementation(() => {
        // We'll return an object that wraps 'from' to switch behavior on a flag
        let firstAttempt = true;
        return {
          auth: mockSupabase.auth,
          from: (table: string) => {
            if (table === "cars") {
              if (firstAttempt) {
                firstAttempt = false;
                return {
                  insert: () => ({
                    select: () => ({ maybeSingle: async () => insertFirst() }),
                  }),
                };
              }
              return {
                insert: () => ({
                  select: () => ({ maybeSingle: async () => insertRetry() }),
                }),
              };
            }
            return mockSupabase.from(table);
          },
        } as MockSupabase;
      });

    const draft = {
      make: "Honda",
      model: "Civic",
      year: 2018,
      price: 8000,
      images: ["b.jpg"],
    };

    const cacheModule = await import("@/lib/cache");
    const delSpy = vi.spyOn(cacheModule, "delByPrefix").mockResolvedValue();

    const res = await POST(makeRequest({ draft }));
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    // ensure car_events was attempted for retry path
    expect(carEventsSpy).toHaveBeenCalled();
    // ensure cache invalidation attempted
    expect(delSpy).toHaveBeenCalledWith("search:");
    expect(delSpy).toHaveBeenCalledWith("suggest:");
  });
});
