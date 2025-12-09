// src/app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
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
  const userId = cookieStore.get("user_id")?.value;

  // Not logged in? Go to signin
  if (!userId) {
    redirect("/auth/signin");
  }

  const supabase = getSupabaseServer();

  const { data: user, error } = await supabase
    .from("users")
    .select("id, full_name, email, phone, photo_url")
    .eq("id", userId)
    .single();

  // User not found in DB? Send to signin
  if (error || !user) {
    console.error("Profile fetch error:", error);
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-green-600 font-bold transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow- shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-black">My Profile</h1>
            <p className="text-xl opacity-90 mt-2">
              Manage your account details
            </p>
          </div>

          <div className="p-8 md:p-12">
            {/* PASS USER TO PROFILE FORM — 100% TYPE-SAFE */}
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
