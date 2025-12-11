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
  MapPin,
  MessageCircle,
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Flame
            size={80}
            className="mx-auto animate-pulse text-green-600 mb-6"
          />
          <h1 className="text-6xl font-black text-gray-900">CARS ABEG</h1>
          <p className="text-2xl font-bold text-gray-600 mt-4">
            Loading fresh deals...
          </p>
        </div>
      </div>
    );
  }

  const CategorySection = ({
    title,
    cars: sectionCars,
    href,
    icon: Icon,
  }: {
    title: string;
    cars: Car[];
    href: string;
    icon: React.ElementType;
  }) => {
    if (sectionCars.length === 0) return null;

    const showViewAll = sectionCars.length > 8; // FIXED: was "showAll"

    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <Icon size={40} className="text-green-600" />
              <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                {title}
              </h2>
            </div>

            {/* VIEW ALL — ONLY IF MORE THAN 8 CARS */}
            {showViewAll && (
              <Link
                href={href}
                className="text-green-600 hover:text-green-700 font-bold text-xl flex items-center gap-2 transition"
              >
                View all
                <ChevronRight size={28} />
              </Link>
            )}
          </div>

          {/* MOBILE: Full-width cards */}
          <div className="md:hidden space-y-8">
            {sectionCars.slice(0, 8).map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* DESKTOP: 4-column grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {sectionCars.slice(0, 8).map((car) => (
              <div
                key={car.id}
                className="hover:-translate-y-4 transition-all duration-300"
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {/* MOBILE "VIEW MORE" CARD */}
          {showViewAll && (
            <div className="md:hidden text-center mt-12">
              <Link
                href={href}
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
              >
                View All ({sectionCars.length - 8}+)
                <ChevronRight size={32} />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 py-32 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Find Your Dream Car
          </h1>
          <p className="text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto opacity-90">
            Verified cars • Instant WhatsApp • Best prices in Nigeria
          </p>
          <Link
            href="/inventory"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <Search className="inline mr-3" size={32} />
            Browse Cars
          </Link>
        </div>
      </section>

      {/* PREMIUM SECTION */}
      {paidCars.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-10 py-5 rounded-full text-3xl font-black shadow-2xl border-4 border-yellow-400">
              <Flame className="text-yellow-400" size={40} />
              PREMIUM • SELLING FAST
              <Flame className="text-yellow-400" size={40} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mt-8">
              {paidCars.length} Hot Deals Live
            </h1>
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

      {/* CATEGORIES */}
      <CategorySection
        title="Brand New Cars"
        cars={brandNew}
        href="/inventory?condition=Brand%20New"
        icon={Zap}
      />
      <CategorySection
        title="Foreign Used • Tokunbo"
        cars={foreignUsed}
        href="/inventory?condition=Foreign%20Used"
        icon={Shield}
      />
      <CategorySection
        title="Nigerian Used • Clean"
        cars={nigerianUsed}
        href="/inventory?condition=Nigerian%20Used"
        icon={Phone}
      />
      <CategorySection
        title="Cars in Lagos"
        cars={lagosCars}
        href="/inventory?location=Lagos"
        icon={MapPin}
      />
      <CategorySection
        title="Below ₦10 Million"
        cars={below10m}
        href="/inventory?maxPrice=10000000"
        icon={Zap}
      />
      <CategorySection
        title="₦10M – ₦20M"
        cars={between10and20m}
        href="/inventory?minPrice=10000000&maxPrice=20000000"
        icon={Flame}
      />

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN&apos;T FIND YOUR DREAM CAR?
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
