import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

interface CarInsertObject {
  make: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  mileage: number | null;
  condition: string | null;
  transmission: string | null;
  fuel: string | null;
  location: string | null;
  state?: string | null;
  city?: string | null;
  images: string[];
  video_urls?: string[];
  description: string | null;
  dealer_name: string | null;
  dealer_phone: string | null;
  // regional/spec fields
  seller_type?: string | null;
  body_type?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  market?: string | null;
  specs?: any | null;
  featured: boolean;
  featured_paid: boolean;
  featured_until: string | null;
  approved: boolean;
  user_id?: string | null;
}

function isNonEmptyString(v: unknown): v is string {
  return (
    typeof v === "string" &&
    v.trim().length > 0 &&
    v.trim().toLowerCase() !== "null"
  );
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const id = body?.id;
    const draft = body?.draft;

    const now = new Date().toISOString();

    // Helper: validate full listing according to schema
    const validateFull = (obj: unknown): string[] => {
      const errors: string[] = [];

      if (typeof obj !== "object" || obj === null) {
        return ["Invalid object"];
      }

      const typedObj = obj as Record<string, unknown>;

      // required fields
      // Note: dealer_name/phone are optional because we'll default to profile values on the server
      const required = ["make", "model", "year", "price", "images"];
      for (const f of required) {
        if (f === "images") {
          if (!Array.isArray(typedObj.images) || typedObj.images.length === 0)
            errors.push("images: at least one image required");
          continue;
        }

        const val = typedObj[f];
        if (val === undefined || val === null) {
          errors.push(`${f} is required`);
          continue;
        }

        if (typeof val === "string" && !isNonEmptyString(val)) {
          errors.push(`${f} is required`);
        }
      }

      // year range (coerce when present)
      const rawYear = typedObj.year;
      const year =
        rawYear !== undefined && rawYear !== null && rawYear !== ""
          ? Number(rawYear)
          : NaN;
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1)
        errors.push("year out of range");

      // price
      if (
        typedObj.price === undefined ||
        typedObj.price === null ||
        Number.isNaN(Number(typedObj.price)) ||
        Number(typedObj.price) < 0
      ) {
        errors.push("price must be >= 0");
      }

      // mileage
      if (
        typedObj.mileage !== undefined &&
        typedObj.mileage !== null &&
        typedObj.mileage !== ""
      ) {
        const mileage = Number(typedObj.mileage);
        if (Number.isNaN(mileage) || mileage < 0)
          errors.push("mileage must be >= 0");
      }

      // images length
      if (Array.isArray(typedObj.images) && typedObj.images.length > 12)
        errors.push("max 12 images allowed");

      return errors;
    };

    // If id provided: update existing listing (attempt to validate full data)
    if (id) {
      const { data: existing, error: existErr } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (existErr || !existing) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }

      const errors = validateFull(existing);
      if (errors.length > 0) {
        console.error(
          "Submit validation (existing) failed:",
          errors,
          "existing:",
          existing
        );
        return NextResponse.json(
          { error: "Validation failed", details: errors.join("; ") },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from("cars")
        .update({ updated_at: now })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Submit update error:", error);
        const details =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : JSON.stringify(error);
        return NextResponse.json(
          { error: "Failed to submit listing", details },
          { status: 500 }
        );
      }

      // Invalidate cache for search/suggest prefetch
      try {
        const cache = await import("@/lib/cache");
        await cache.delByPrefix("search:");
        await cache.delByPrefix("suggest:");
      } catch (e) {
        console.error("Failed to invalidate cache after update:", e);
      }

      return NextResponse.json({ success: true, data });
    }

    // Otherwise, try to insert provided draft as a full listing
    if (draft) {
      console.debug("Submit draft received:", draft);
      // validate strictly
      const errors = validateFull(draft);
      if (errors.length > 0) {
        console.error("Submit validation failed:", errors, "draft:", draft);
        return NextResponse.json(
          { error: "Validation failed", details: errors.join("; ") },
          { status: 400 }
        );
      }

      // Attempt to normalize state/city from provided fields or freeform `location`
      const parseStateCity = (
        loc: unknown
      ): { state: string | null; city: string | null } => {
        if (typeof loc !== "string") return { state: null, city: null };
        const raw = loc.trim();
        if (!raw) return { state: null, city: null };
        // common formats: "City, State" or "State, City" or "City - State"
        if (raw.includes(",")) {
          const parts = raw
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          if (parts.length >= 2) {
            // Heuristic: assume "City, State"
            return { city: parts[0], state: parts.slice(1).join(", ") };
          }
        }
        if (raw.includes("-")) {
          const parts = raw
            .split("-")
            .map((p) => p.trim())
            .filter(Boolean);
          if (parts.length >= 2) {
            return { city: parts[0], state: parts.slice(1).join(" - ") };
          }
        }
        // Fallback: treat entire string as city
        return { state: null, city: raw };
      };

      // Resolve the canonical `users.id` that should be used for FK references
      // and also fetch profile data for defaults (dealer name/phone).
      let profile: {
        id?: string;
        full_name?: string | null;
        phone?: string | null;
      } | null = null;
      let targetUserId: string | null = user.id;
      try {
        // 1) If a mapping table exists (user_auth_accounts), prefer mapped user_id
        try {
          const { data: mapping } = await supabase
            .from("user_auth_accounts")
            .select("user_id")
            .eq("auth_id", user.id)
            .maybeSingle();
          if (mapping && mapping.user_id) {
            targetUserId = mapping.user_id;
            const { data: p } = await supabase
              .from("users")
              .select("id, full_name, phone, seller_type")
              .eq("id", targetUserId)
              .maybeSingle();
            profile = p as {
              id?: string;
              full_name?: string | null;
              phone?: string | null;
              seller_type?: string | null;
            } | null;
          }
        } catch (e) {
          // ignore mapping errors and continue
          console.error("Failed to read user_auth_accounts mapping:", e);
        }

        // 2) If no mapping, check for a direct users row with the auth id
        if (!profile) {
          try {
            const { data: direct } = await supabase
              .from("users")
              .select("id, full_name, phone, seller_type")
              .eq("id", user.id)
              .maybeSingle();
            if (direct && direct.id) {
              profile = direct as any;
              targetUserId = direct.id;
            }
          } catch (e) {
            // ignore
          }
        }

        // 3) If still no profile, try to find a users row by email and create a mapping
        if (!profile && user.email) {
          try {
            const { data: byEmail } = await supabase
              .from("users")
              .select("id, full_name, phone")
              .eq("email", user.email)
              .maybeSingle();
            if (byEmail && (byEmail as any).id) {
              profile = byEmail as any;
              targetUserId = (byEmail as any).id;

              // create a safe mapping for future requests
              try {
                await supabase
                  .from("user_auth_accounts")
                  .upsert(
                    { auth_id: user.id, user_id: targetUserId },
                    { onConflict: "auth_id", returning: "minimal" }
                  );
              } catch (e) {
                console.error("Failed to create auth->user mapping:", e);
              }
            }
          } catch (e) {
            // ignore
          }
        }

        // 4) If no existing profile exists at all, create one using auth id as the users.id
        if (!profile) {
          try {
            const fallbackName =
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "User";
            const { data: upserted, error: upsertErr } = await supabase
              .from("users")
              .upsert(
                {
                  id: user.id,
                  email: user.email || "",
                  full_name: fallbackName,
                  phone: user.user_metadata?.phone || "",
                },
                { onConflict: "id", returning: "representation" }
              );
            if (!upsertErr && upserted) {
              const got = Array.isArray(upserted)
                ? upserted[0]
                : (upserted as any);
              profile = got;
              targetUserId = got?.id ?? user.id;
            }
          } catch (e) {
            console.error("Failed to ensure user profile exists:", e);
          }
        }
      } catch (e) {
        console.error("Error resolving target user id:", e);
      }

      // Verify the resolved user actually exists; if not, null it so FK won't block insert
      try {
        const { data: finalUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", targetUserId)
          .maybeSingle();
        if (!finalUser || !finalUser.id) {
          console.warn(
            "Resolved target user id not found in users table, clearing user_id to avoid FK error:",
            targetUserId
          );
          // allow null to avoid violating FK. Clients can re-link later.
          targetUserId = null as unknown as string;
        }
      } catch (e) {
        console.error("Failed to verify final user existence:", e);
      }

      // Build insert object matching provided schema (avoid unknown columns)
      const insertObj: CarInsertObject = {
        make: isNonEmptyString(draft.make) ? String(draft.make).trim() : null,
        model: isNonEmptyString(draft.model)
          ? String(draft.model).trim()
          : null,
        year:
          draft.year !== undefined && draft.year !== null && draft.year !== ""
            ? Number(draft.year)
            : null,
        price:
          draft.price !== undefined &&
          draft.price !== null &&
          draft.price !== ""
            ? Number(draft.price)
            : null,
        mileage:
          draft.mileage !== undefined &&
          draft.mileage !== null &&
          draft.mileage !== ""
            ? Number(draft.mileage)
            : null,
        condition: isNonEmptyString(draft.condition)
          ? String(draft.condition).trim()
          : null,
        transmission: isNonEmptyString(draft.transmission)
          ? String(draft.transmission).trim()
          : null,
        fuel: isNonEmptyString(draft.fuel) ? String(draft.fuel).trim() : null,
        location: isNonEmptyString(draft.location)
          ? String(draft.location).trim()
          : null,
        // normalized fields: prefer explicit state/city if present, otherwise parse from `location`
        state: isNonEmptyString(draft.state)
          ? String(draft.state).trim()
          : parseStateCity(draft.location).state,
        city: isNonEmptyString(draft.city)
          ? String(draft.city).trim()
          : parseStateCity(draft.location).city,
        images: Array.isArray(draft.images) ? draft.images : [],
        video_urls: Array.isArray(draft.video_urls) ? draft.video_urls : [],
        description: isNonEmptyString(draft.description)
          ? String(draft.description).trim()
          : null,
        dealer_name: isNonEmptyString(draft.dealer_name)
          ? String(draft.dealer_name).trim()
          : profile?.full_name ?? null,
        dealer_phone: isNonEmptyString(draft.dealer_phone)
          ? String(draft.dealer_phone).trim()
          : profile?.phone ?? null,
        // regional/spec fields
        seller_type: isNonEmptyString(draft.seller_type)
          ? String(draft.seller_type).trim()
          : (profile as { seller_type?: string })?.seller_type ?? null,
        body_type: isNonEmptyString(draft.body_type)
          ? String(draft.body_type).trim()
          : null,
        exterior_color: isNonEmptyString(draft.exterior_color)
          ? String(draft.exterior_color).trim()
          : null,
        interior_color: isNonEmptyString(draft.interior_color)
          ? String(draft.interior_color).trim()
          : null,
        market: isNonEmptyString(draft.market)
          ? String(draft.market).trim()
          : null,
        specs:
          draft.specs && typeof draft.specs === "object" ? draft.specs : null,
        user_id: targetUserId,
        featured: draft.featured === true,
        featured_paid: draft.featured_paid === true,
        featured_until: draft.featured_until || null,
        approved: false,
      };

      const { data, error } = await supabase
        .from("cars")
        .insert(insertObj)
        .select()
        .maybeSingle();
      if (error) {
        console.error("Submit insert error:", error, "insertObj:", insertObj);
        const details =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : JSON.stringify(error);

        // If it's a foreign-key constraint failure on user_id, retry without user_id
        if (/fk_cars_user_id|foreign key constraint/i.test(String(details))) {
          console.warn(
            "FK constraint on cars.user_id prevented insert; retrying insert with user_id=null"
          );
          try {
            const { data: data2, error: error2 } = await supabase
              .from("cars")
              .insert({ ...insertObj, user_id: null })
              .select()
              .maybeSingle();
            if (!error2) {
              // Log the substitution event
              try {
                await supabase.from("car_events").insert([
                  {
                    car_id:
                      (data2 as CarInsertObject & { id: string })?.id || null,
                    event_type: "create_without_user",
                    user_id: targetUserId,
                    payload: JSON.stringify({
                      attemptedUserId: targetUserId,
                      insertObj,
                    }),
                    created_at: new Date().toISOString(),
                  },
                ]);
              } catch (e) {
                // ignore
              }

              // Invalidate caches after retry insert as well
              try {
                const cache = await import("@/lib/cache");
                await cache.delByPrefix("search:");
                await cache.delByPrefix("suggest:");
              } catch (e) {
                console.error(
                  "Failed to invalidate cache after retry insert:",
                  e
                );
              }

              return NextResponse.json({ success: true, data: data2 });
            }
          } catch (e) {
            console.error("Retry insert without user_id failed:", e);
          }
        }

        return NextResponse.json(
          { error: "Failed to create listing", details },
          { status: 500 }
        );
      }

      // Server-side logging: best-effort insert into `car_events` if table exists
      try {
        await supabase.from("car_events").insert([
          {
            car_id: (data as CarInsertObject & { id: string })?.id || null,
            event_type: "create",
            user_id: targetUserId,
            payload: JSON.stringify({ insertObj }),
            created_at: new Date().toISOString(),
          },
        ]);
      } catch {
        // ignore logging failures
      }

      // Invalidate search/suggest caches so new listing appears in results
      try {
        const cache = await import("@/lib/cache");
        await cache.delByPrefix("search:");
        await cache.delByPrefix("suggest:");
      } catch (e) {
        console.error("Failed to invalidate cache after insert:", e);
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { error: "No draft or id provided" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Submit route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
