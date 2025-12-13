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
  MapPin,
  MessageCircle,
  ChevronRight,
  Search,
  CheckCircle,
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

  // ALL CARS COUNTS
  const lagosCount = cars.filter(c => c.location?.toLowerCase().includes("lagos")).length;
  const abujaCount = cars.filter(c => c.location?.toLowerCase().includes("abuja")).length;
  const kadunaCount = cars.filter(c => c.location?.toLowerCase().includes("kaduna")).length;
  const kanoCount = cars.filter(c => c.location?.toLowerCase().includes("kano")).length;
  const portharcourtCount = cars.filter(c => c.location?.toLowerCase().includes("portharcourt")).length;
  const foreignUsedCount = cars.filter(c => c.condition === "Foreign Used").length;
  const nigerianUsedCount = cars.filter(c => c.condition === "Nigerian Used").length;
  const totalCars = cars.length;

  // FEATURED CARS CATEGORIES
  const lagosFeatured = paidCars.filter(c => c.location?.toLowerCase().includes("lagos"));
  const abujaFeatured = paidCars.filter(c => c.location?.toLowerCase().includes("abuja"));
  const kadunaFeatured = paidCars.filter(c => c.location?.toLowerCase().includes("kaduna"));
  const kanoFeatured = paidCars.filter(c => c.location?.toLowerCase().includes("kano"));
  const portharcourtFeatured = paidCars.filter(c => c.location?.toLowerCase().includes("portharcourt"));
  const foreignFeatured = paidCars.filter(c => c.condition === "Foreign Used");
  const nigerianFeatured = paidCars.filter(c => c.condition === "Nigerian Used");

  const FeaturedRow = ({ title, cars }: { title: string; cars: Car[] }) => {
    if (cars.length === 0) return null;

    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-6">
            {title}
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            {cars.map((car) => (
              <div key={car.id} className="snap-center flex-shrink-0 w-72">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <Flame size={64} className="animate-pulse text-green-600 mb-4" />
          <h1 className="text-5xl font-black text-gray-900">CARS ABEG</h1>
          <p className="text-xl font-bold text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CLEAN HERO — MOBILE-FIRST */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Your Dream Car is Just a Click Away
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-8 opacity-90">
            Verified sellers • Instant WhatsApp • No hidden fees
          </p>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-full font-black text-xl shadow-xl hover:scale-105 transition"
          >
            <Search size={24} />
            Browse Cars
          </Link>
        </div>
      </section>

      {/* CATEGORY CARDS — MOBILE: 2 COL, DESKTOP: 4 COL */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "All Cars", count: totalCars, icon: Flame, color: "bg-green-600" },
              { name: "Lagos", count: lagosCount, icon: MapPin, color: "bg-blue-600" },
              { name: "Abuja", count: abujaCount, icon: MapPin, color: "bg-purple-600" },
              { name: "Kaduna", count: kadunaCount, icon: MapPin, color: "bg-orange-600" },
              { name: "Kano", count: kanoCount, icon: MapPin, color: "bg-red-600" },
              { name: "Portharcourt", count: portharcourtCount, icon: MapPin, color: "bg-teal-600" },
              { name: "Tokunbo", count: foreignUsedCount, icon: Shield, color: "bg-cyan-600" },
              { name: "Nigerian Used", count: nigerianUsedCount, icon: Phone, color: "bg-indigo-600" },
            ].map((cat) => (
              <Link key={cat.name} href="/inventory" className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 text-center">
                <div className={`w-16 h-16 ${cat.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <cat.icon size={32} className="text-white" />
                </div>
                <p className="text-3xl font-black text-gray-900">{cat.count.toLocaleString()}</p>
                <p className="text-lg font-bold text-gray-700 mt-2">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-8">
            Featured Listings
          </h2>
        </div>
      </section>

      <FeaturedRow title="Premium in Lagos" cars={lagosFeatured} />
      <FeaturedRow title="Premium in Abuja" cars={abujaFeatured} />
      <FeaturedRow title="Premium in Kaduna" cars={kadunaFeatured} />
      <FeaturedRow title="Premium in Kano" cars={kanoFeatured} />
      <FeaturedRow title="PREMIUM in Portharcourt" cars={portharcourtFeatured} />
      <FeaturedRow title="Premium Foreign Used" cars={foreignFeatured} />
      <FeaturedRow title="Premium Nigerian Used" cars={nigerianFeatured} />

      {/* VERIFICATION ADVOCATE */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <CheckCircle size={64} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Sell Faster. Build Trust.
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Verified sellers get 3x more inquiries. Join thousands of trusted sellers today.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-full font-black text-xl shadow-xl hover:scale-105 transition"
          >
            Verify Now
            <ChevronRight size={24} />
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Tunde A.", text: "Sold my Toyota in 3 days! Best platform in Nigeria." },
              { name: "Chioma O.", text: "Bought a clean Tokunbo Camry. Smooth process!" },
              { name: "Ahmed K.", text: "Instant WhatsApp chat saved me from scams. Thank you!" },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-8 shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg font-medium text-gray-700 italic mb-6">
                  "{t.text}"
                </p>
                <p className="font-black text-xl text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD — MODERN & SPACE-EFFICIENT */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Deals on the Go
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Get notifications, chat faster, browse anywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl mx-auto sm:mx-0">
              App Store
            </button>
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl mx-auto sm:mx-0">
              Google Play
            </button>
          </div>
        </div>
      </section>
    </>
  );
}