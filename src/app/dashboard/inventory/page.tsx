
import { getServerAuth } from "@/lib/serverAuth";
import Link from "next/link";
import InventoryClient from "./InventoryClient";

export default async function DashboardInventoryPage() {
  // const supabase = getSupabaseServer();
 const { user, supabase } = await getServerAuth();
   if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black mb-4">Sign in to view your inventory</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to manage your listings.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signin" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold">Sign in</Link>
            <Link href="/sell" className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold">Create Listing (Preview)</Link>
          </div>
        </div>
      </main>
    );
  }
  // Try common owner fields; if none match, result will be empty and user can create listings
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .or(`user_id.eq.${user.id},owner_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const myCars = (cars || []) as never[];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-black">My Inventory</h1>
          <p className="text-gray-600 mt-2">Manage your listed cars and drafts.</p>
        </header>

        {myCars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-lg font-bold">You have no listings yet.</p>
            <p className="text-sm text-gray-600 mt-2">Create your first car listing to get started.</p>
            <div className="mt-6">
              <Link href="/sell" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold">
                Create Listing
              </Link>
            </div>
          </div>
        ) : (
          <InventoryClient initialCars={myCars} />
        )}
      </div>
    </main>
  );
}
