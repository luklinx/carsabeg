// src/components/AdminPanel.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AdminPanel() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );

  // Check auth on server
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch data on server
  const { data: allCars } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: featured } = await supabase
    .from("cars")
    .select("*")
    .eq("approved", true)
    .eq("featured_paid", true);

  const cars = allCars || [];
  const paidCars = featured || [];

  const approveCar = async (id: string) => {
    const { error } = await supabase
      .from("cars")
      .update({ approved: true })
      .eq("id", id);
    if (error) console.error(error);
  };

  const makePremium = async (id: string) => {
    const today = new Date();
    const expiry = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0];
    const { error } = await supabase
      .from("cars")
      .update({ featured_paid: true, featured_until: expiry, approved: true })
      .eq("id", id);
    if (error) console.error(error);
  };

  const deleteCar = async (id: string) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) console.error(error);
  };

  const totalRevenue = paidCars.length * 50000;

  const pendingCars = cars.filter((c) => !c.approved);
  const approvedCars = cars.filter((c) => c.approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 text-white">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white/10 p-6 rounded-2xl shadow text-center">
            <p className="text-gray-300">Total Cars</p>
            <p className="text-2xl font-black mt-2">{cars.length}</p>
          </div>
          <div className="bg-orange-500/20 p-6 rounded-2xl shadow text-center">
            <p className="text-orange-300">Pending</p>
            <p className="text-2xl font-black mt-2">{pendingCars.length}</p>
          </div>
          <div className="bg-green-500/20 p-6 rounded-2xl shadow text-center">
            <p className="text-green-300">Live</p>
            <p className="text-2xl font-black mt-2">{approvedCars.length}</p>
          </div>
          <div className="bg-yellow-500/20 p-6 rounded-2xl shadow text-center">
            <p className="text-yellow-300">Premium</p>
            <p className="text-2xl font-black mt-2">{paidCars.length}</p>
          </div>
          <div className="bg-purple-500/20 p-6 rounded-2xl shadow text-center">
            <p className="text-purple-300">Revenue</p>
            <p className="text-2xl font-black mt-2">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* PENDING */}
        {pendingCars.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-6 text-orange-400">
              Pending Approval ({pendingCars.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white/10 rounded-2xl shadow-lg overflow-hidden"
                >
                  <Image
                    src={car.images[0] || "/placeholder.jpg"}
                    alt=""
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-black text-xl">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-2xl font-bold text-green-400">
                      ₦{(car.price / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => approveCar(car.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-black"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => makePremium(car.id)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black py-3 rounded-xl font-black"
                      >
                        PREMIUM
                      </button>
                    </div>
                    <button
                      onClick={() => deleteCar(car.id)}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-black"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LIVE */}
        <section>
          <h2 className="text-3xl font-black mb-6 text-green-400">
            Live Listings ({approvedCars.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedCars.map((car) => (
              <div key={car.id} className="bg-white/10 rounded-xl shadow p-4">
                <Image
                  src={car.images[0]}
                  alt=""
                  width={400}
                  height={300}
                  className="w-full rounded-lg object-cover h-48"
                />
                <p className="font-black mt-3 text-lg">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="text-green-400 font-bold">
                  ₦{(car.price / 1000000).toFixed(1)}M
                </p>
                {car.featured_paid && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold">
                    PREMIUM
                  </span>
                )}
                <button
                  onClick={() => deleteCar(car.id)}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
