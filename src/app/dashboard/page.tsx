// src/app/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Check whether the user's profile exists. If not, send them to profile setup.
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, email, phone, profile_photo_url")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/dashboard/profile");
  }

  // Render a simple dashboard landing. We'll expand this with components.
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {profile.full_name || user.email}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-2">Profile</h2>
            <p className="text-sm text-gray-600">Manage your profile and contact details.</p>
            <div className="mt-4">
              <Link href="/dashboard/profile" className="text-green-600 font-bold">
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-lg mb-2">Inventory</h2>
            <p className="text-sm text-gray-600">View and manage your listed cars (coming soon).</p>
            <div className="mt-4">
              <Link href="/dashboard/inventory" className="text-green-600 font-bold">
                Manage Inventory
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
