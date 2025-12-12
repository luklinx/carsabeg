// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Flame,
  MapPin,
  DollarSign,
  Shield,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export default function ClientHome() {
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const premium = await getPaidFeaturedCars();
        setPaidCars((premium || []).filter((c): c is Car => !!c?.id));
      } catch (err) {
        console.error("Failed to load premium cars:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // GROUP PREMIUM CARS
  const byMake = paidCars.reduce((acc, car) => {
    const key = car.make || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(car);
    return acc;
  }, {} as Record<string, Car[]>);

  const byLocation = paidCars.reduce((acc, car) => {
    const key = car.location || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(car);
    return acc;
  }, {} as Record<string, Car[]>);

  const byPriceRange = {
    "Below ₦10M": paidCars.filter((c) => c.price <= 10_000_000),
    "₦10M – ₦20M": paidCars.filter(
      (c) => c.price > 10_000_000 && c.price <= 20_000_000
    ),
    "Above ₦20M": paidCars.filter((c) => c.price > 20_000_000),
  };

  const byCondition = {
    "Foreign Used": paidCars.filter((c) => c.condition === "Foreign Used"),
    "Nigerian Used": paidCars.filter((c) => c.condition === "Nigerian Used"),
    "Brand New": paidCars.filter((c) => c.condition === "Brand New"),
  };

  const PremiumSection = ({
    title,
    cars,
    href,
  }: {
    title: string;
    cars: Car[];
    href: string;
  }) => {
    if (cars.length === 0) return null;

    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900">
              Premium {title}
            </h2>
            {cars.length > 8 && (
              <Link
                href={href}
                className="text-green-600 hover:text-green-700 font-bold text-xl flex items-center gap-2 transition"
              >
                View all <ChevronRight size={28} />
              </Link>
            )}
          </div>

          {/* MOBILE: Manual Swipe Carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-6">
              {cars.slice(0, 10).map((car) => (
                <div key={car.id} className="snap-center flex-shrink-0 w-11/12">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </div>

          {/* DESKTOP: 4-Column Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {cars.slice(0, 8).map((car) => (
              <div
                key={car.id}
                className="hover:-translate-y-4 transition-all duration-300"
              >
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Flame size={80} className="animate-pulse text-green-600 mb-6" />
          <h1 className="text-6xl font-black text-gray-900">CARS ABEG</h1>
          <p className="text-2xl font-bold text-gray-600 mt-4">
            Loading premium deals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* PREMIUM BY MAKE */}
      {Object.entries(byMake).map(([make, cars]) => (
        <PremiumSection
          key={make}
          title={`${make} Premium Cars`}
          cars={cars}
          href={`/inventory?make=${encodeURIComponent(make)}&featured=true`}
        />
      ))}

      {/* PREMIUM BY LOCATION */}
      {Object.entries(byLocation).map(([location, cars]) => (
        <PremiumSection
          key={location}
          title={`Premium Cars in ${location}`}
          cars={cars}
          href={`/inventory?location=${encodeURIComponent(
            location
          )}&featured=true`}
        />
      ))}

      {/* PREMIUM BY PRICE RANGE */}
      {Object.entries(byPriceRange).map(([range, cars]) => (
        <PremiumSection
          key={range}
          title={`Premium ${range}`}
          cars={cars}
          href={`/inventory?priceRange=${encodeURIComponent(
            range
          )}&featured=true`}
        />
      ))}

      {/* PREMIUM BY CONDITION */}
      {Object.entries(byCondition).map(([condition, cars]) => (
        <PremiumSection
          key={condition}
          title={`Premium ${condition}`}
          cars={cars}
          href={`/inventory?condition=${encodeURIComponent(
            condition
          )}&featured=true`}
        />
      ))}

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-12">
            We source any car in 48hrs
          </p>
          <Link
            href="https://wa.me/2348065481663?text=Hi%20CarsAbeg!%20Help%20me%20find%20my%20dream%20car"
            className="inline-flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <MessageCircle size={36} className="animate-bounce" />
            REQUEST ANY CAR
          </Link>
        </div>
      </section>
    </>
  );
}
