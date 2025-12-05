// src/app/dashboard/profile/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import ProfileForm from "@/components/ProfileForm";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile | CarsAbeg",
  description: "Update your profile information and photo",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth/signin");
  }

  const supabase = getSupabaseServer();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              My Profile
            </h1>
            <p className="text-slate-600">
              Update your profile information and photo
            </p>
          </div>

          <ProfileForm user={user} />
        </div>
      </div>
    </main>
  );
}
