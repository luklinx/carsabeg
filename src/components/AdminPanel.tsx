// components/AdminPanel.tsx
"use client"; // ← Keep this for buttons/actions

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { Car } from "@/types";

export default function AdminPanel() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: allCars } = await supabaseBrowser
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: featured } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("approved", true)
          .eq("featured_paid", true);

        setCars(allCars || []);
        setPaidCars(featured || []);
      } catch (err) {
        console.error("Failed to load admin data:", err);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const approveCar = async (id: string) => {
    if (
      processing ||
      !confirm("Approve this car? It will go live immediately.")
    )
      return;
    setProcessing(id);
    const { error } = await supabaseBrowser
      .from("cars")
      .update({ approved: true })
      .eq("id", id);
    if (!error) {
      setCars(cars.map((c) => (c.id === id ? { ...c, approved: true } : c)));
      alert("Car approved & live!");
    }
    setProcessing(null);
  };

  const makePremium = async (id: string) => {
    if (processing || !confirm("Mark as PREMIUM (₦50,000 paid)?")) return;
    setProcessing(id);
    const today = new Date();
    const expiry = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0];
    const { error } = await supabaseBrowser
      .from("cars")
      .update({ featured_paid: true, featured_until: expiry, approved: true })
      .eq("id", id);
    if (!error) {
      alert("Now PREMIUM for 30 days!");
    }
    setProcessing(null);
  };

  const deleteCar = async (id: string) => {
    if (processing || !confirm("DELETE this car permanently? Cannot undo."))
      return;
    setProcessing(id);
    const { error } = await supabaseBrowser.from("cars").delete().eq("id", id);
    if (!error) {
      setCars(cars.filter((c) => c.id !== id));
      alert("Car deleted forever.");
    }
    setProcessing(null);
  };

  const totalRevenue = paidCars.length * 50000;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center">
        <div className="text-5xl font-black text-white animate-pulse">
          Loading Admin...
        </div>
      </div>
    );
  }

  const pendingCars = cars.filter((c) => !c.approved);
  const approvedCars = cars.filter((c) => c.approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-black text-white mb-4">
            CARS ABEG ADMIN
          </h1>
          <p className="text-xl text-gray-300 mt-4">
            You control Nigeria&apos;s #1 car marketplace
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20">
          <p className="text-gray-300 text-lg">Total Revenue Earned</p>
          <p className="text-6xl font-black text-yellow-400 mt-4">
            ₦{totalRevenue.toLocaleString()}
          </p>
          <p className="text-2xl text-gray-400 mt-2">
            {paidCars.length} × ₦50,000 PREMIUM
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white/10 p-6 rounded-2xl shadow text-center border border-white/10">
            <p className="text-gray-300">Total Cars</p>
            <p className="text-4xl font-black mt-3">{cars.length}</p>
          </div>
          <div className="bg-orange-500/20 p-6 rounded-2xl shadow text-center border border-orange-500/30">
            <p className="text-orange-300">Pending</p>
            <p className="text-4xl font-black mt-3">{pendingCars.length}</p>
          </div>
          <div className="bg-green-500/20 p-6 rounded-2xl shadow text-center border border-green-500/30">
            <p className="text-green-300">Live</p>
            <p className="text-4xl font-black mt-3">{approvedCars.length}</p>
          </div>
          <div className="bg-yellow-500/20 p-6 rounded-2xl shadow text-center border border-yellow-500/30">
            <p className="text-yellow-300">Premium</p>
            <p className="text-4xl font-black mt-3">{paidCars.length}</p>
          </div>
          <div className="bg-purple-500/20 p-6 rounded-2xl shadow text-center border border-purple-500/30">
            <p className="text-purple-300">Revenue</p>
            <p className="text-4xl font-black mt-3">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending Cars */}
        {pendingCars.length > 0 && (
          <section>
            <h2 className="text-4xl font-black text-orange-400 mb-8">
              Pending Approval ({pendingCars.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all"
                >
                  <Image
                    src={car.images?.[0] || "/placeholder.jpg"}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-3xl font-bold text-green-400 mt-2">
                        ₦{(car.price / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-gray-300">
                        {car.location} • {car.dealer_name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => approveCar(car.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black text-lg"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => makePremium(car.id)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black py-4 rounded-xl font-black text-lg"
                      >
                        PREMIUM
                      </button>
                    </div>
                    <button
                      onClick={() => deleteCar(car.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-lg"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Cars */}
        <section>
          <h2 className="text-4xl font-black text-green-400 mb-8">
            Live Listings ({approvedCars.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10"
              >
                <Image
                  src={car.images?.[0] || "/placeholder.jpg"}
                  alt=""
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="font-black text-lg mt-4">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="text-green-400 font-bold text-2xl">
                  ₦{(car.price / 1000000).toFixed(1)}M
                </p>
                {car.featured_paid && (
                  <span className="inline-block mt-3 px-4 py-2 bg-yellow-400 text-black rounded-full font-bold">
                    PREMIUM
                  </span>
                )}
                <button
                  onClick={() => deleteCar(car.id)}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center py-16">
          <p className="text-2xl font-black text-gray-400">
            CARS ABEG © 2025 • Built by THE KING
          </p>
        </div>
      </div>
    </div>
  );
}
