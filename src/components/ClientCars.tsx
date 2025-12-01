// src/components/ClientCars.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { supabaseBrowser } from "@/lib/supabaseClient"; // ← FIXED: Client-only
import type { Car } from "@/types";

export default function ClientCars() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [paidFeatured, setPaidFeatured] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [{ data: allData }, { data: premiumData }] = await Promise.all([
        supabaseBrowser
          .from("cars")
          .select("*")
          .eq("approved", true)
          .order("created_at", { ascending: false }),

        supabaseBrowser
          .from("cars")
          .select("*")
          .eq("approved", true)
          .eq("featured_paid", true)
          .gte("featured_until", today)
          .order("created_at", { ascending: false }),
      ]);

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
    const interval = setInterval(loadCars, 15000); // Live refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center bg-gray-50">
        <div className="text-5xl md:text-6xl font-black text-green-600 animate-pulse">
          LOADING FRESH CARS...
        </div>
        <p className="text-xl text-gray-600 mt-6">New arrivals every minute</p>
      </div>
    );
  }

  const latestCars = allCars.slice(0, 16);

  return (
    <>
      {/* PREMIUM LISTINGS — Dubizzle Gold Standard */}
      {paidFeatured.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-amber-50 via-orange-50 to-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-black text-lg shadow-xl mb-8">
              PREMIUM LISTINGS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Top of the Market
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mt-4 max-w-3xl mx-auto">
              Only verified sellers pay ₦50,000 to appear here — these cars sell
              fastest
            </p>
          </div>

          <div className="mt-16 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paidFeatured.map((car) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST ARRIVALS — Clean, White, Dubizzle Perfection */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900">
              Latest Arrivals
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mt-4">
              Fresh cars added every hour — be the first to grab
            </p>
          </div>

          {latestCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {latestCars.map((car) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl">
              <div className="text-5xl font-black text-gray-400 mb-8">
                No cars yet
              </div>
              <p className="text-2xl text-gray-600 mb-10">
                Be the first seller on Nigeria&apos;s hottest car platform!
              </p>
              <Link
                href="/sell"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-16 py-8 rounded-full font-black text-3xl shadow-2xl transform hover:scale-110 transition"
              >
                LIST YOUR CAR NOW — FREE
              </Link>
            </div>
          )}

          {/* View All Button — Dubizzle Classic */}
          {allCars.length > 16 && (
            <div className="text-center mt-20">
              <Link
                href="/inventory"
                className="inline-block bg-white border-4 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl transition-all duration-300"
              >
                VIEW ALL {allCars.length} CARS
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
