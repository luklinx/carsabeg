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
    const interval = setInterval(loadCars, 12000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <Flame
            size={80}
            className="mx-auto animate-pulse text-yellow-400 mb-6"
          />
          <h1 className="text-5xl md:text-7xl font-black">CARS ABEG</h1>
          <p className="text-xl md:text-2xl font-bold mt-4">
            Loading fresh deals...
          </p>
        </div>
      </div>
    );
  }

  const latestCars = allCars.slice(0, 24);

  return (
    <>
      {/* PREMIUM SECTION — REFINED & ELEGANT */}
      {paidFeatured.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-16 md:py-24 text-white">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-6">
            {/* URGENCY BADGE — SLIMMER */}
            <div className="inline-flex items-center gap-3 bg-black/70 backdrop-blur-xl px-6 py-3 rounded-full text-lg md:text-xl font-black mb-8 shadow-2xl border-4 border-yellow-400">
              <Flame size={36} className="text-yellow-400" />
              PREMIUM • SELLING FAST
              <Zap size={36} className="text-yellow-300" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4">
              {paidFeatured.length} Hot Deals Live
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-4xl mx-auto opacity-90">
              Verified sellers paid ₦50k • These cars don’t last
            </p>

            {/* TRUST BADGES — SMALLER & CLEANER */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center">
                <ShieldCheck
                  size={36}
                  className="mx-auto mb-2 text-yellow-400"
                />
                <p className="text-base font-bold">Verified</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center">
                <Clock size={36} className="mx-auto mb-2 text-green-400" />
                <p className="text-base font-bold">Live Updates</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 text-center">
                <Phone size={36} className="mx-auto mb-2 text-cyan-400" />
                <p className="text-base font-bold">Direct Call</p>
              </div>
            </div>
          </div>

          {/* PREMIUM GRID */}
          <div className="mt-12 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paidFeatured.map((car, i) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1.5 rounded-full font-black text-sm shadow-lg">
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

      {/* LATEST ARRIVALS */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              LATEST ARRIVALS
            </h2>
            <p className="text-lg md:text-xl font-medium text-gray-700">
              {allCars.length} Fresh Cars • Updated Live
            </p>
            <div className="inline-flex items-center gap-2 mt-6 bg-green-600 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg">
              <TrendingUp size={28} />
              New cars dropping now
            </div>
          </div>

          {latestCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {latestCars.map((car, i) => (
                <div
                  key={car.id}
                  className="group transform transition-all duration-500 hover:-translate-y-2"
                >
                  {i < 3 && (
                    <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg animate-bounce">
                      NEW
                    </div>
                  )}
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl shadow-2xl">
              <h3 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-6">
                No Cars Yet
              </h3>
              <p className="text-lg md:text-xl text-[var(--muted)] mb-10 max-w-2xl mx-auto">
                Be the FIRST seller on Nigeria’s fastest platform
              </p>
              <Link
                href="/sell"
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition"
              >
                LIST YOUR CAR FREE
              </Link>
            </div>
          )}

          {/* VIEW ALL BUTTON — SLIM & PROUD */}
          <div className="text-center mt-16">
            <Link
              href="/inventory"
              className="inline-block bg-black hover:bg-gray-900 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition"
            >
              VIEW ALL {allCars.length} CARS →
            </Link>
          </div>

          {/* FINAL CTA — ELEGANT & POWERFUL */}
          <div className="mt-20 text-center bg-gradient-to-r from-green-600 to-emerald-700 py-14 rounded-3xl shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              CAN’T FIND YOUR DREAM CAR?
            </h2>
            <p className="text-lg md:text-xl text-white font-medium mb-10 max-w-3xl mx-auto">
              Tell us what you want — we’ll find it in 24hrs
            </p>
            <a
              href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20Please%20help%20me%20find%20my%20dream%20car"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-xl md:text-2xl shadow-2xl hover:scale-105 transition"
            >
              REQUEST ANY CAR NOW
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
