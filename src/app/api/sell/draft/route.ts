import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Single POST handler: update existing user draft if present, otherwise insert a new draft.
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
    const draft = body?.draft || {};

    const parseStateCity = (
      loc: unknown
    ): { state: string | null; city: string | null } => {
      if (typeof loc !== "string") return { state: null, city: null };
      const raw = loc.trim();
      if (!raw) return { state: null, city: null };
      if (raw.includes(",")) {
        const parts = raw
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length >= 2) {
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
      return { state: null, city: raw };
    };

    // Ensure normalized state/city exist on draft when possible
    const parsed = parseStateCity(draft.location);
    const normalizedDraft = {
      ...draft,
      state:
        draft?.state &&
        typeof draft.state === "string" &&
        draft.state.trim() !== ""
          ? draft.state.trim()
          : parsed.state,
      city:
        draft?.city &&
        typeof draft.city === "string" &&
        draft.city.trim() !== ""
          ? draft.city.trim()
          : parsed.city,
      // preserve video_urls when present (expecting array of public URLs)
      video_urls: Array.isArray(draft?.video_urls) ? draft.video_urls : null,
      // allow drafts to include seller_type
      seller_type:
        typeof draft?.seller_type === "string" ? draft.seller_type : null,
    };

    // Resolve canonical users.id to use for FK references (handle mappings)
    let targetUserId: string | null = user.id;
    let existing: any = null;
    try {
      try {
        const { data: mapping } = await supabase
          .from("user_auth_accounts")
          .select("user_id")
          .eq("auth_id", user.id)
          .maybeSingle();
        if (mapping && mapping.user_id) {
          targetUserId = mapping.user_id;
        }
      } catch (e) {
        // ignore mapping read errors
      }

      // If no mapping, ensure a users row exists for auth id (as a safe fallback)
      try {
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("id", targetUserId)
          .maybeSingle();
        if (!userRow) {
          const fallbackName =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User";
          try {
            await supabase.from("users").upsert(
              {
                id: targetUserId,
                email: user.email || "",
                full_name: fallbackName,
                phone: user.user_metadata?.phone || "",
              },
              { onConflict: "id", returning: "minimal" }
            );
          } catch (e) {
            console.error("Failed to upsert user for draft:", e);
          }
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error("Error resolving target user id for draft:", e);
    }

    // Verify the resolved user exists; if we couldn't ensure a users row exists then
    // clear the target user id to avoid FK violations when inserting a draft.
    try {
      const { data: finalUser } = await supabase
        .from("users")
        .select("id, seller_type")
        .eq("id", targetUserId)
        .maybeSingle();
      let profileSellerType: string | null = null;
      if (!finalUser || !finalUser.id) {
        console.warn(
          "Resolved target user id not found for draft, clearing user_id to avoid FK error:",
          targetUserId
        );
        targetUserId = null;
      } else {
        profileSellerType = (finalUser as any)?.seller_type ?? null;
      }

      // If the normalized draft did not include seller_type, default it from profile
      const normalizedDraftWithSeller = {
        ...normalizedDraft,
        seller_type:
          typeof normalizedDraft?.seller_type === "string" &&
          normalizedDraft.seller_type
            ? normalizedDraft.seller_type
            : profileSellerType ?? null,
      };

      // Try to find an existing draft for this user
      const existingRes = await supabase
        .from("cars")
        .select("id")
        .eq("user_id", targetUserId)
        .eq("status", "draft")
        .maybeSingle();
      existing = existingRes?.data ?? null;

      if (existing && (existing as any).id) {
        const { data, error } = await supabase
          .from("cars")
          .update({
            ...normalizedDraftWithSeller,
            updated_at: new Date().toISOString(),
          })
          .eq("id", (existing as any).id)
          .select()
          .maybeSingle();

        if (error) {
          console.error("Draft update error:", error);
          return NextResponse.json(
            { error: "Failed to update draft", details: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, data });
      }

      // Insert a new draft
      const insertObj = {
        ...normalizedDraftWithSeller,
        user_id: targetUserId,
        status: "draft",
        approved: false,
        featured_paid: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("cars")
        .insert(insertObj)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Draft insert error:", error);

        const details =
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : JSON.stringify(error);
        if (/fk_cars_user_id|foreign key constraint/i.test(String(details))) {
          console.warn(
            "FK constraint on cars.user_id prevented draft insert; retrying with user_id=null"
          );
          try {
            const { data: data2, error: error2 } = await supabase
              .from("cars")
              .insert({ ...insertObj, user_id: null })
              .select()
              .maybeSingle();
            if (!error2) {
              try {
                await supabase.from("car_events").insert([
                  {
                    car_id: (data2 as any)?.id || null,
                    event_type: "draft_create_without_user",
                    user_id: targetUserId,
                    payload: JSON.stringify({
                      normalizedDraft: normalizedDraftWithSeller,
                    }),
                    created_at: new Date().toISOString(),
                  },
                ]);
              } catch (e) {
                // ignore
              }
              return NextResponse.json({ success: true, data: data2 });
            }
          } catch (e) {
            console.error("Retry draft insert without user_id failed:", e);
          }
        }

        return NextResponse.json(
          { error: "Failed to create draft", details },
          { status: 500 }
        );
      }

      // Best-effort server-side logging for drafts
      try {
        await supabase.from("car_events").insert([
          {
            car_id: (data as any)?.id || null,
            event_type: "draft_create",
            user_id: targetUserId,
            payload: JSON.stringify({
              normalizedDraft: normalizedDraftWithSeller,
            }),
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        // ignore logging failures
      }

      return NextResponse.json({ success: true, data });
    } catch (e) {
      console.error("Failed to verify final user existence for draft:", e);
    }

    if (existing && (existing as any).id) {
      const { data, error } = await supabase
        .from("cars")
        .update({ ...normalizedDraft, updated_at: new Date().toISOString() })
        .eq("id", (existing as any).id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Draft update error:", error);
        return NextResponse.json(
          { error: "Failed to update draft", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    // Insert a new draft
    const insertObj = {
      ...normalizedDraft,
      user_id: targetUserId,
      status: "draft",
      approved: false,
      featured_paid: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cars")
      .insert(insertObj)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Draft insert error:", error);

      const details =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : JSON.stringify(error);
      if (/fk_cars_user_id|foreign key constraint/i.test(String(details))) {
        console.warn(
          "FK constraint on cars.user_id prevented draft insert; retrying with user_id=null"
        );
        try {
          const { data: data2, error: error2 } = await supabase
            .from("cars")
            .insert({ ...insertObj, user_id: null })
            .select()
            .maybeSingle();
          if (!error2) {
            try {
              await supabase.from("car_events").insert([
                {
                  car_id: (data2 as any)?.id || null,
                  event_type: "draft_create_without_user",
                  user_id: targetUserId,
                  payload: JSON.stringify({ normalizedDraft }),
                  created_at: new Date().toISOString(),
                },
              ]);
            } catch (e) {
              // ignore
            }
            return NextResponse.json({ success: true, data: data2 });
          }
        } catch (e) {
          console.error("Retry draft insert without user_id failed:", e);
        }
      }

      return NextResponse.json(
        { error: "Failed to create draft", details },
        { status: 500 }
      );
    }

    // Best-effort server-side logging for drafts
    try {
      await supabase.from("car_events").insert([
        {
          car_id: (data as any)?.id || null,
          event_type: "draft_create",
          user_id: targetUserId,
          payload: JSON.stringify({ normalizedDraft }),
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      // ignore logging failures
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Draft route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
