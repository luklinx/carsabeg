// src/components/ClientCars.tsx
"use client";

import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import { supabase } from "@/lib/cars";
import type { Car } from "@/types";

export default function ClientCars() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [paidFeatured, setPaidFeatured] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    try {
      // Load ALL approved cars
      const { data: allData } = await supabase
        .from("cars")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      // Load only PREMIUM paid cars (not expired)
      const today = new Date().toISOString().split("T")[0];
      const { data: premiumData } = await supabase
        .from("cars")
        .select("*")
        .eq("approved", true)
        .eq("featured_paid", true)
        .gte("featured_until", today)
        .order("created_at", { ascending: false });

      setAllCars((allData as Car[]) || []);
      setPaidFeatured((premiumData as Car[]) || []);
    } catch (err) {
      console.error("Failed to load cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
    // Refresh every 15 seconds — instant updates when you approve in admin
    const interval = setInterval(loadCars, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="text-5xl font-black text-green-600 animate-pulse">
          LOADING FRESH CARS...
        </div>
      </div>
    );
  }

  const latestCars = allCars.slice(0, 12);

  return (
    <>
      {/* PREMIUM PAID CARS */}
      {paidFeatured.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-b from-yellow-50 via-orange-50 to-white">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-gray-800 mb-4">
              PREMIUM LISTINGS
            </h2>
            <p className="text-2xl text-gray-700 font-bold">
              Only ₦50,000 paid ads appear here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {paidFeatured.map((car) => (
              <div
                key={car.id}
                className="transform hover:scale-105 transition duration-300"
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LATEST ARRIVALS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-gray-800">
            LATEST ARRIVALS
          </h2>

          {latestCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {latestCars.map((car) => (
                <div
                  key={car.id}
                  className="transform hover:scale-105 transition duration-300"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-5xl font-black text-gray-400">
                No cars yet — be the first to list!
              </p>
              <a
                href="/sell"
                className="inline-block mt-10 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-3xl shadow-2xl transform hover:scale-110 transition"
              >
                SELL YOUR CAR NOW
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
