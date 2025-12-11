// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import CarCarousel from "./CarCarousel";
import CarGrid from "./CarGrid";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Zap,
  Flame,
  TrendingUp,
  Shield,
  MessageCircle,
  Phone,
  MapPin,
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

  const foreignUsed = cars.filter((c) => c.condition === "Foreign Used");
  const nigerianUsed = cars.filter((c) => c.condition === "Nigerian Used");
  const brandNew = cars.filter((c) => c.condition === "Brand New");
  const lagosCars = cars.filter((c) =>
    c.location?.toLowerCase().includes("lagos")
  );
  const below10m = cars.filter((c) => c.price <= 10_000_000);
  const between10and20m = cars.filter(
    (c) => c.price > 10_000_000 && c.price <= 20_000_000
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Flame size={80} className="animate-pulse text-yellow-400 mb-6" />
          <h1 className="text-6xl font-black">CARS ABEG</h1>
          <p className="text-2xl font-bold mt-4">Loading fresh deals...</p>
        </div>
      </div>
    );
  }

  const HomeSection = ({
    title,
    cars: sectionCars,
    href,
    icon: Icon,
    gradient,
  }: {
    title: string;
    cars: Car[];
    href: string;
    icon: React.ElementType;
    gradient?: string;
  }) => {
    if (sectionCars.length === 0) return null;

    return (
      <section className={`py-16 ${gradient || "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <Icon size={36} className="text-green-600 hidden md:block" />
              <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                {title}
              </h2>
            </div>
          </div>

          {/* MOBILE: Manual Carousel */}
          <div className="md:hidden">
            <CarCarousel cars={sectionCars} href={href} />
          </div>

          {/* DESKTOP: Grid */}
          <div className="hidden md:block">
            <CarGrid cars={sectionCars} href={href} />
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* PREMIUM HERO */}
      {paidCars.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-8 py-4 rounded-full text-2xl font-black shadow-2xl border-4 border-yellow-400">
              <Flame className="text-yellow-400" />
              PREMIUM • SELLING FAST
              <TrendingUp className="text-yellow-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mt-8">
              {paidCars.length} Hot Deals Live
            </h1>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <CarCarousel cars={paidCars} href="/inventory?featured=true" />
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <HomeSection
        title="Brand New Cars"
        cars={brandNew}
        href="/inventory?condition=Brand%20New"
        icon={Zap}
        gradient="bg-gradient-to-b from-purple-50 to-white"
      />
      <HomeSection
        title="Foreign Used • Tokunbo"
        cars={foreignUsed}
        href="/inventory?condition=Foreign%20Used"
        icon={Shield}
        gradient="bg-gradient-to-b from-green-50 to-white"
      />
      <HomeSection
        title="Nigerian Used • Clean"
        cars={nigerianUsed}
        href="/inventory?condition=Nigerian%20Used"
        icon={Phone}
        gradient="bg-gradient-to-b from-gray-100 to-white"
      />
      <HomeSection
        title="Cars in Lagos"
        cars={lagosCars}
        href="/inventory?location=Lagos"
        icon={MapPin}
      />
      <HomeSection
        title="Below ₦10 Million"
        cars={below10m}
        href="/inventory?maxPrice=10000000"
        icon={Zap}
        gradient="bg-gradient-to-b from-yellow-50 to-white"
      />
      <HomeSection
        title="₦10M – ₦20M"
        cars={between10and20m}
        href="/inventory?minPrice=10000000&maxPrice=20000000"
        icon={Flame}
        gradient="bg-gradient-to-b from-orange-50 to-white"
      />

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-12">
            We source any car in 48hrs
          </p>
          <a
            href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20Help%20me%20find%20my%20dream%20car"
            className="inline-flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <MessageCircle size={36} className="animate-bounce" />
            REQUEST ANY CAR
          </a>
        </div>
      </section>
    </>
  );
}
