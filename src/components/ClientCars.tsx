// src/components/ClientCars.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { Car } from "@/types";
import {
  Flame,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";

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

      const safeAll = ((allData as Car[]) || []).filter((c) => !!c?.id);
      const safePremium = ((premiumData as Car[]) || []).filter((c) => !!c?.id);

      setAllCars(safeAll);
      setPaidFeatured(safePremium);
    } catch (err) {
      console.error("Failed to load cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
    const interval = setInterval(loadCars, 12000); // AGGRESSIVE LIVE REFRESH
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <Flame
            size={120}
            className="mx-auto animate-pulse text-yellow-400 mb-8"
          />
          <h1 className="text-6xl md:text-9xl font-black animate-pulse">
            CARS ABEG
          </h1>
          <p className="text-3xl md:text-5xl font-black mt-6">
            Loading the hottest deals in Nigeria...
          </p>
          <div className="flex justify-center gap-6 mt-12">
            <div className="w-16 h-16 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="w-16 h-16 bg-white rounded-full animate-ping delay-150"></div>
            <div className="w-16 h-16 bg-yellow-400 rounded-full animate-ping delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  const latestCars = allCars.slice(0, 24); // SHOW MORE = MORE SALES

  return (
    <>
      {/* PREMIUM SECTION — PURE FIRE, PURE MONEY */}
      {paidFeatured.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-20 md:py-32 text-white">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-6">
            {/* URGENCY BADGE */}
            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-10 py-5 rounded-full text-3xl md:text-4xl font-black mb-10 shadow-2xl animate-pulse border-4 border-yellow-400">
              <Flame className="text-yellow-400" size={56} />
              PREMIUM — SELLING IN HOURS
              <Zap className="text-yellow-300" size={56} />
            </div>

            <h1 className="text-5xl md:text-9xl font-black mb-6 drop-shadow-2xl">
              {paidFeatured.length} CARS MOVING FAST
            </h1>
            <p className="text-2xl md:text-4xl font-bold max-w-5xl mx-auto opacity-95">
              Sellers paid ₦50,000 to be here • These cars don’t last 48 hours
            </p>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
                <ShieldCheck
                  size={48}
                  className="mx-auto mb-3 text-yellow-400"
                />
                <p className="text-xl font-black">100% Verified</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
                <Clock size={48} className="mx-auto mb-3 text-green-400" />
                <p className="text-xl font-black">Live Updates</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
                <Phone size={48} className="mx-auto mb-3 text-cyan-400" />
                <p className="text-xl font-black">Direct Call</p>
              </div>
            </div>
          </div>

          {/* PREMIUM GRID — MOBILE & DESKTOP GODMODE */}
          <div className="mt-16 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paidFeatured.map((car, i) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-6 hover:shadow-3xl"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-2xl animate-pulse">
                      PREMIUM #{i + 1}
                    </div>
                    <CarCard car={car} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LATEST ARRIVALS — CLEAN, URGENT, CONVERTING */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-9xl font-black text-gray-900 mb-6">
              LATEST ARRIVALS
            </h2>
            <p className="text-2xl md:text-4xl font-bold text-gray-700">
              {allCars.length} Fresh Cars • Updated Every 12 Seconds
            </p>
            <div className="inline-flex items-center gap-3 mt-8 bg-green-600 text-white px-8 py-4 rounded-full font-black text-xl shadow-xl">
              <TrendingUp size={36} />
              New cars dropping live
            </div>
          </div>

          {latestCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {latestCars.map((car, i) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-4 hover:shadow-3xl animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {i < 3 && (
                    <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-5 py-2 rounded-full font-black text-sm shadow-xl animate-bounce">
                      JUST ADDED
                    </div>
                  )}
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white rounded-3xl shadow-2xl">
              <h3 className="text-6xl font-black text-gray-400 mb-8">
                No Cars Yet
              </h3>
              <p className="text-3xl text-gray-600 mb-12">
                Be the FIRST seller on Nigeria’s fastest-growing platform
              </p>
              <Link
                href="/sell"
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-20 py-10 rounded-full font-black text-4xl shadow-3xl transform hover:scale-110 transition-all duration-300"
              >
                LIST YOUR CAR FREE — NOW!
              </Link>
            </div>
          )}

          {/* VIEW ALL — CANNOT MISS */}
          <div className="text-center mt-20">
            <Link
              href="/inventory"
              className="inline-block bg-black hover:bg-gray-900 text-white px-20 py-10 rounded-full font-black text-4xl md:text-5xl shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              VIEW ALL {allCars.length} CARS →
            </Link>
          </div>

          {/* FINAL CTA — NO ONE LEAVES EMPTY */}
          <div className="mt-24 text-center bg-gradient-to-r from-green-600 to-emerald-700 py-16 rounded-3xl shadow-2xl">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-8">
              CAN’T FIND YOUR DREAM CAR?
            </h2>
            <p className="text-2xl md:text-4xl text-white font-bold mb-12 max-w-4xl mx-auto">
              Tell us what you want — we’ll find it in 24 hours
            </p>
            <a
              href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20Please%20help%20me%20find%20my%20dream%20car"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-20 py-10 rounded-full font-black text-4xl md:text-6xl shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              REQUEST ANY CAR NOW
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
