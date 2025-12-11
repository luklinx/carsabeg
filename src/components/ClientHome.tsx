// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import HeaderClean from "./HeaderClean";
import Footer from "./Footer";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Flame,
  Zap,
  Shield,
  Phone,
  Star,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function ClientHome() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [all, premium] = await Promise.all([
          getCars(),
          getPaidFeaturedCars(),
        ]);
        setCars((all || []).filter((c): c is Car => !!c?.id));
        setPaidCars((premium || []).filter((c): c is Car => !!c?.id));
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const foreignUsed = cars.filter((c) => c.condition === "Foreign Used").length;
  const nigerianUsed = cars.filter(
    (c) => c.condition === "Nigerian Used"
  ).length;
  const brandNew = cars.filter((c) => c.condition === "Brand New").length;
  const totalCars = cars.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Flame size={80} className="animate-pulse text-green-600 mb-6" />
          <h1 className="text-6xl font-black text-gray-900">CARS ABEG</h1>
          <p className="text-2xl font-bold text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <HeaderClean />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 py-32 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Everyone is on CARS ABEG!
            <br />
            <span className="text-yellow-400">Are you?</span>
          </h1>
          <p className="text-xl md:text-3xl font-bold mb-12">
            Verified cars • Instant WhatsApp • Best prices
          </p>
          <Link
            href="/inventory"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            Browse Cars
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "All Cars",
                count: totalCars,
                icon: Flame,
                color: "from-green-500 to-emerald-600",
              },
              {
                name: "Tokunbo",
                count: foreignUsed,
                icon: Shield,
                color: "from-blue-500 to-cyan-600",
              },
              {
                name: "Nigerian Used",
                count: nigerianUsed,
                icon: Phone,
                color: "from-purple-500 to-pink-600",
              },
              {
                name: "Brand New",
                count: brandNew,
                icon: Star,
                color: "from-yellow-400 to-orange-500",
              },
            ].map((cat) => (
              <Link key={cat.name} href="/inventory" className="group block">
                <div
                  className={`h-40 bg-gradient-to-br ${cat.color} rounded-3xl flex items-center justify-center shadow-xl`}
                >
                  <cat.icon size={80} className="text-white" />
                </div>
                <div className="text-center mt-6">
                  <p className="text-4xl font-black text-gray-900">
                    {cat.count.toLocaleString()}
                  </p>
                  <p className="text-xl font-bold text-gray-700 mt-2">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      {paidCars.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-orange-600 to-pink-700 text-white">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-black/70 px-10 py-5 rounded-full text-3xl font-black border-4 border-yellow-400">
              <Flame className="text-yellow-400" size={40} />
              PREMIUM LISTINGS
              <Flame className="text-yellow-400" size={40} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mt-8">
              {paidCars.length} Featured Cars
            </h2>
          </div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paidCars.slice(0, 8).map((car) => (
                <div key={car.id} className="hover:scale-105 transition">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <Footer />
    </>
  );
}
