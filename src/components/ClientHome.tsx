// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Flame,
  Zap,
  Shield,
  Phone,
  Star,
  MessageCircle,
  Download,
  ChevronRight,
  Search,
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
          <p className="text-2xl font-bold text-gray-600 mt-4">
            Loading fresh deals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 py-32 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Everyone is on CARS ABEG!
            <br />
            <span className="text-yellow-400">Are you?</span>
          </h1>
          <p className="text-xl md:text-3xl font-bold mb-12">
            Verified cars • Instant WhatsApp • Best prices
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl p-3 flex items-center gap-4">
              <Search size={28} className="text-gray-600 ml-4" />
              <input
                type="text"
                placeholder="Search for motors..."
                className="w-full text-gray-900 text-lg md:text-xl font-medium outline-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-black text-lg shadow-lg transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
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

      {/* PREMIUM LISTINGS */}
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
                <div
                  key={car.id}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>

            {paidCars.length > 8 && (
              <div className="text-center mt-12">
                <Link
                  href="/inventory?featured=true"
                  className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
                >
                  View All Premium ({paidCars.length - 8}+)
                  <ChevronRight size={32} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TRUST SECTION */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Star size={80} className="mx-auto text-yellow-400 mb-6" />
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Trusted by 50,000+ Car Buyers in Nigeria
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">
            Verified sellers • Direct WhatsApp • No scams • Best prices
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <Shield size={36} />
            Get Verified Now
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Tunde A.",
                text: "Sold my Toyota in 3 days! Best platform in Nigeria.",
              },
              {
                name: "Chioma O.",
                text: "Bought a clean Tokunbo Camry. Smooth process!",
              },
              {
                name: "Ahmed K.",
                text: "Instant WhatsApp chat saved me from scams. Thank you!",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-3xl p-10 shadow-xl text-center"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={32}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700 italic mb-8">
                  {t.text}
                </p>
                <p className="font-black text-2xl text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Find Amazing Deals on the Go
          </h2>
          <p className="text-xl md:text-2xl mb-12">
            Download the CARS ABEG app now!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 shadow-2xl">
              <Download size={36} />
              App Store
            </button>
            <button className="bg-black hover:bg-gray-900 text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 shadow-2xl">
              <Download size={36} />
              Google Play
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
