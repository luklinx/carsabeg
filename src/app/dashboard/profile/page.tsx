// src/app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/signin");
  }

  // Fetch profile. Prefer mapping table (auth_id -> user_id) when present.
  const { data: authMapping } = await supabase
    .from("user_auth_accounts")
    .select("user_id")
    .eq("auth_id", authUser.id)
    .maybeSingle();

  let profile = null;
  if (authMapping?.user_id) {
    const { data } = await supabase
      .from("users")
      .select("id, full_name, email, phone, profile_photo_url")
      .eq("id", authMapping.user_id)
      .maybeSingle();
    profile = data;
  } else {
    const { data } = await supabase
      .from("users")
      .select("id, full_name, email, phone, profile_photo_url")
      .eq("id", authUser.id)
      .maybeSingle();
    profile = data;
  }

  // If profile exists → show it
  if (profile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
        <div className="max-w-xl md:max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
          >
            <ArrowLeft /> Back
          </Link>
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <h1 className="text-2xl md:text-4xl font-black mb-6">My Profile</h1>
            <ProfileForm user={profile} />
          </div>
        </div>
      </main>
    );
  }

  // CREATE PROFILE — WITH SAFE DEFAULTS
  const fallbackName = authUser.email?.split("@")[0] || "User";
  // Use upsert to avoid duplicate-key race conditions if the user record already exists
  let insertRes: any = null;
  let insertError: Error | null = null;
  try {
    insertRes = await (supabase.from("users").upsert(
      {
        id: authUser.id,
        email: (authUser.email || "").toLowerCase(),
        full_name: authUser.user_metadata?.full_name || fallbackName,
        phone: authUser.user_metadata?.phone || "", // ← ALLOW EMPTY (we'll let user fill later)
      },
      { onConflict: "id", returning: "representation" } as any
    ) as any);
    insertError = insertRes?.error ?? null;
  } catch (err: any) {
    // If the client throws (network/config), capture it here
    console.error("UPSERT threw an exception:", err);
    insertError = err instanceof Error ? err : new Error(String(err));
  }

  // Defensive: if response is falsy or empty, log the full object for debugging
  if (!insertRes || insertError) {
    console.error("UPSERT FAILED (raw):", insertRes);
    console.error("UPSERT FAILED:", insertError);
    try {
      console.error(
        "UPSERT FAILED (json):",
        JSON.stringify(
          insertError ?? insertRes,
          Object.getOwnPropertyNames(insertError ?? insertRes),
          2
        )
      );
    } catch (e) {
      console.error("Failed to stringify insert error/raw response:", e);
    }

    // If the upsert failed due to a duplicate email (common case when a user
    // signs up with an email that's already used by another profile), try to
    // find the existing profile by email (case-insensitive) and create a
    // mapping so the auth id points to the existing user.
    try {
      const isDuplicateEmail =
        (insertError && (insertError as any)?.code === "23505") ||
        /users_email_key/i.test(String(insertError ?? ""));

      if (isDuplicateEmail && authUser.email) {
        try {
          const { data: existingByEmail } = await supabase
            .from("users")
            .select("id, full_name, email, phone, profile_photo_url")
            .ilike("email", authUser.email)
            .maybeSingle();

          if (existingByEmail) {
            // Do NOT auto-map or merge accounts. Instead, inform the user and
            // redirect them to sign in to the existing account to avoid
            // accidental merges. This is a clearer, safer UX for duplicate emails.
            // Redirect to sign-in with a 'duplicate' flag so the signin page
            // can show a contextual message and prefill the email. Do not
            // automatically merge or map accounts.
            return redirect(
              `/auth/signin?email=${encodeURIComponent(
                existingByEmail.email || ""
              )}&duplicate=1`
            );
          }
        } catch (ex) {
          console.error("Error while locating existing user by email:", ex);
        }
      }
    } catch (e) {
      console.error(
        "Error while attempting to recover from upsert failure:",
        e
      );
    }

    // Try to recover by fetching any existing profile for this user id.
    try {
      const { data: existingById } = await supabase
        .from("users")
        .select("id, full_name, email, phone, profile_photo_url")
        .eq("id", authUser.id)
        .maybeSingle();

      if (existingById) {
        return (
          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
            <div className="max-w-xl md:max-w-4xl mx-auto">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
              >
                <ArrowLeft /> Back
              </Link>
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                <h1 className="text-2xl md:text-4xl font-black mb-4">
                  My Profile
                </h1>
                <div className="mb-4 text-sm text-yellow-700">
                  Note: an existing profile was found for your account — if
                  information looks incorrect, please contact support.
                </div>
                <ProfileForm user={existingById} />
              </div>
            </div>
          </main>
        );
      }

      // If not found by id, check by email (possible duplicate email on another account)
      if (authUser.email) {
        // Use case-insensitive search to avoid issues with email case normalization
        const { data: existingByEmail } = await supabase
          .from("users")
          .select("id, full_name, email, phone, profile_photo_url")
          .ilike("email", authUser.email)
          .maybeSingle();

        if (existingByEmail) {
          // Safe, non-destructive merge: create a mapping from the auth id to the
          // existing profile's user id. This avoids reassigning primary keys and
          // keeps FK relationships intact.
          try {
            const { data: mappingRes, error: mapErr } = await (supabase
              .from("user_auth_accounts")
              .upsert({ auth_id: authUser.id, user_id: existingByEmail.id }, {
                onConflict: "auth_id",
                returning: "representation",
              } as any) as any);

            if (mapErr) {
              console.error("Failed to create auth->user mapping:", mapErr);
              // Fall back to showing the existing profile (non-destructive).
              return (
                <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
                  <div className="max-w-xl md:max-w-4xl mx-auto">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
                    >
                      <ArrowLeft /> Back
                    </Link>
                    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                      <h1 className="text-2xl md:text-4xl font-black mb-4">
                        My Profile
                      </h1>
                      <div className="mb-4 text-sm text-yellow-700">
                        Note: another account already uses your email address.
                        We attempted to automatically associate accounts but the
                        operation failed. We've loaded the existing profile — if
                        this is unexpected please contact support.
                      </div>
                      <ProfileForm user={existingByEmail} />
                    </div>
                  </div>
                </main>
              );
            }

            // Mapping created (or updated). Load and show the target profile.
            const mappedUser = existingByEmail;
            return (
              <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
                <div className="max-w-xl md:max-w-4xl mx-auto">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
                  >
                    <ArrowLeft /> Back
                  </Link>
                  <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                    <h1 className="text-2xl md:text-4xl font-black mb-4">
                      My Profile
                    </h1>
                    <div className="mb-4 text-sm text-green-700">
                      We've associated your sign-in with an existing profile. If
                      this is unexpected, please contact support.
                    </div>
                    <ProfileForm user={mappedUser} />
                  </div>
                </div>
              </main>
            );
          } catch (mappingErr) {
            console.error(
              "Error while creating auth->user mapping:",
              mappingErr
            );
            return (
              <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
                <div className="max-w-xl md:max-w-4xl mx-auto">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
                  >
                    <ArrowLeft /> Back
                  </Link>
                  <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
                    <h1 className="text-2xl md:text-4xl font-black mb-4">
                      My Profile
                    </h1>
                    <div className="mb-4 text-sm text-yellow-700">
                      Note: another account already uses your email address. We
                      attempted to automatically associate accounts but an error
                      occurred. We've loaded the existing profile — if this is
                      unexpected please contact support.
                    </div>
                    <ProfileForm user={existingByEmail} />
                  </div>
                </div>
              </main>
            );
          }
        }
      }
    } catch (fetchErr) {
      console.error(
        "Error while attempting to recover from upsert failure:",
        fetchErr
      );
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-black text-red-600 mb-4">
            Profile Setup Failed
          </h1>
          <p className="text-xl text-gray-700">
            Error: {insertError?.message || "Unknown (check server logs)"}
          </p>
          <p className="text-lg text-gray-600 mt-4">
            Contact: support@carsabeg.ng
          </p>
        </div>
      </main>
    );
  }

  // Re-fetch fresh profile
  const { data: newProfile } = await supabase
    .from("users")
    .select("id, full_name, email, phone, profile_photo_url")
    .eq("id", authUser.id)
    .single();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 md:p-8">
      <div className="max-w-xl md:max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-green-600 font-bold"
        >
          <ArrowLeft /> Back
        </Link>
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl md:text-4xl font-black mb-6">Welcome!</h1>
          <ProfileForm user={newProfile!} />
        </div>
      </div>
    </main>
  );
}
