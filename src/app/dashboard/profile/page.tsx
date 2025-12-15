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

  // Fetch profile
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, email, phone, photo_url")
    .eq("id", authUser.id)
    .maybeSingle();

  // If profile exists → show it
  if (profile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mb-8 text-green-600 font-bold"
          >
            <ArrowLeft /> Back
          </Link>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h1 className="text-4xl font-black mb-8">My Profile</h1>
            <ProfileForm user={profile} />
          </div>
        </div>
      </main>
    );
  }

  // CREATE PROFILE — WITH SAFE DEFAULTS
  const fallbackName = authUser.email?.split("@")[0] || "User";
  // Use upsert to avoid duplicate-key race conditions if the user record already exists
  const insertRes = await supabase.from("users").upsert(
    {
      id: authUser.id,
      email: authUser.email || "",
      full_name: authUser.user_metadata?.full_name || fallbackName,
      phone: authUser.user_metadata?.phone || "", // ← ALLOW EMPTY (we'll let user fill later)
    },
    { onConflict: "id" }
  );

  const insertError = (insertRes as { error: Error | null }).error;

  if (insertError) {
    console.error("UPSERT FAILED (raw):", insertRes);
    console.error("UPSERT FAILED:", insertError);
    try {
      console.error(
        "UPSERT FAILED (json):",
        JSON.stringify(insertError, Object.getOwnPropertyNames(insertError), 2)
      );
    } catch (e) {
      console.error("Failed to stringify insertError:", e);
    }
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-2xl">
          <h1 className="text-4xl font-black text-red-600 mb-4">
            Profile Setup Failed
          </h1>
          <p className="text-xl text-gray-700">
            Error: {insertError.message || "Unknown"}
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
    .select("id, full_name, email, phone, photo_url")
    .eq("id", authUser.id)
    .single();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-8 text-green-600 font-bold"
        >
          <ArrowLeft /> Back
        </Link>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-black mb-8">Welcome!</h1>
          <ProfileForm user={newProfile!} />
        </div>
      </div>
    </main>
  );
}
