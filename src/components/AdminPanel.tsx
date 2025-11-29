// src/components/AdminPanel.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/cars";
import type { Car } from "@/types";

export default function AdminPanel() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        // Get ALL cars (approved + pending)
        const { data: allCars } = await supabase
          .from("cars")
          .select("*")
          .order("created_at", { ascending: false });

        // Get only approved + featured paid (for revenue)
        const { data: featured } = await supabase
          .from("cars")
          .select("*")
          .eq("approved", true)
          .eq("featured_paid", true);

        setCars((allCars as Car[]) || []);
        setPaidCars((featured as Car[]) || []);
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
    if (!confirm("Approve this car? It will go live immediately.")) return;

    const { error } = await supabase
      .from("cars")
      .update({ approved: true })
      .eq("id", id);

    if (!error) {
      setCars(cars.map((c) => (c.id === id ? { ...c, approved: true } : c)));
      alert("Car approved & live!");
    }
  };

  const makePremium = async (id: string) => {
    if (!confirm("Mark as PREMIUM (₦50,000 paid)?")) return;

    const today = new Date();
    const expiry = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0];

    const { error } = await supabase
      .from("cars")
      .update({
        featured_paid: true,
        featured_until: expiry,
        approved: true,
      })
      .eq("id", id);

    if (!error) {
      setCars(
        cars.map((c) =>
          c.id === id
            ? {
                ...c,
                featured_paid: true,
                featured_until: expiry,
                approved: true,
              }
            : c
        )
      );
      setPaidCars([...paidCars, cars.find((c) => c.id === id)!]);
      alert("Now PREMIUM for 30 days!");
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm("DELETE this car permanently? Cannot undo.")) return;

    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (!error) {
      setCars(cars.filter((c) => c.id !== id));
      setPaidCars(paidCars.filter((c) => c.id !== id));
      alert("Car deleted forever.");
    }
  };

  const totalRevenue = paidCars.length * 50000;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center">
        <div className="text-5xl font-black text-green-600 animate-pulse">
          LOADING ADMIN DASHBOARD...
        </div>
      </div>
    );
  }

  const pendingCars = cars.filter((c) => !c.approved);
  const approvedCars = cars.filter((c) => c.approved);
  const premiumCars = paidCars;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-green-600">
              CARS ABEG ADMIN
            </h1>
            <p className="text-gray-600 mt-1">
              You control Nigeria&apos;s #1 car marketplace
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Revenue Earned</p>
            <p className="text-5xl font-black text-green-600">
              ₦{totalRevenue.toLocaleString()}
            </p>
            <p className="text-lg text-gray-500">
              {premiumCars.length} × ₦50,000
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-600">Total Cars</p>
            <p className="text-4xl font-black text-gray-900 mt-2">
              {cars.length}
            </p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl shadow text-center border border-orange-200">
            <p className="text-orange-700">Pending</p>
            <p className="text-4xl font-black text-orange-600 mt-2">
              {pendingCars.length}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow text-center border border-green-200">
            <p className="text-green-700">Live</p>
            <p className="text-4xl font-black text-green-600 mt-2">
              {approvedCars.length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow text-center border border-yellow-300">
            <p className="text-yellow-700">Premium</p>
            <p className="text-4xl font-black text-yellow-600 mt-2">
              {premiumCars.length}
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow text-center border border-purple-200">
            <p className="text-purple-700">Revenue</p>
            <p className="text-4xl font-black text-purple-600 mt-2">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* PENDING APPROVAL */}
        {pendingCars.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-6 text-orange-600">
              Pending Approval ({pendingCars.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden"
                >
                  <Image
                    src={car.images[0] || "/placeholder.jpg"}
                    alt={car.model}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-black text-xl">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ₦{(car.price / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-gray-600">
                      {car.dealer_name} • {car.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted:{" "}
                      {new Date(car.created_at!).toLocaleDateString()}
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
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-xl font-black"
                      >
                        MAKE PREMIUM
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

        {/* LIVE CARS */}
        <section>
          <h2 className="text-3xl font-black mb-6 text-green-600">
            Live Listings ({approvedCars.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow p-4 border"
              >
                <Image
                  src={car.images[0]}
                  alt=""
                  width={400}
                  height={300}
                  className="w-full rounded-lg"
                />
                <p className="font-black mt-3">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="text-green-600 font-bold">
                  ₦{(car.price / 1000000).toFixed(1)}M
                </p>
                {car.feature_paid && (
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

        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-bold">
            CARS ABEG © 2025 • Nigeria&apos;s #1 • Built by YOU
          </p>
        </div>
      </div>
    </div>
  );
}
