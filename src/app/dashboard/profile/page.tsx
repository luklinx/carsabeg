// src/app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProfileForm from "@/components/ProfileForm";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "My Profile | CARS ABEG",
  description: "Update your profile information and photo",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();

  // CREATE SUPABASE CLIENT WITH COOKIES
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

  // GET CURRENT SESSION
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // NOT LOGGED IN? REDIRECT
  if (!authUser) {
    redirect("/auth/signin");
  }

  // FETCH USER PROFILE FROM `users` TABLE
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone, photo_url")
    .eq("id", authUser.id)
    .single();

  // NO PROFILE? CREATE ONE AUTOMATICALLY
  if (!userProfile) {
    const { data: newProfile, error: createError } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || "",
        phone: authUser.user_metadata?.phone || "",
      })
      .select()
      .single();

    if (createError) {
      console.error("Failed to create profile:", createError);
      redirect("/auth/signin");
    }

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-green-600 font-bold transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
              <h1 className="text-4xl md:text-5xl font-black">My Profile</h1>
              <p className="text-xl opacity-90 mt-2">
                Welcome! Let&apos;s set up your profile
              </p>
            </div>
            <div className="p-8 md:p-12">
              <ProfileForm user={newProfile} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // PROFILE EXISTS — SHOW FORM
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-green-600 font-bold transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-black">My Profile</h1>
            <p className="text-xl opacity-90 mt-2">
              Manage your account details
            </p>
          </div>

          <div className="p-8 md:p-12">
            <ProfileForm user={userProfile} />
          </div>
        </div>
      </div>
    </main>
  );
}
