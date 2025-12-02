// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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
        const safeAll = (all || []).filter((c): c is Car => !!c?.id);
        const safePremium = (premium || []).filter((c): c is Car => !!c?.id);
        setCars(safeAll);
        setPaidCars(safePremium);
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const foreignUsed = cars
    .filter((c) => c.condition === "Foreign Used")
    .slice(0, 20);
  const nigerianUsed = cars
    .filter((c) => c.condition === "Nigerian Used")
    .slice(0, 20);
  const lagosCars = cars
    .filter((c) => c.location?.toLowerCase().includes("lagos"))
    .slice(0, 20);
  const below10m = cars.filter((c) => c.price <= 10_000_000).slice(0, 20);
  const between10and20m = cars
    .filter((c) => c.price > 10_000_000 && c.price <= 20_000_000)
    .slice(0, 20);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <Flame size={100} className="mx-auto animate-pulse text-yellow-400" />
          <h1 className="text-6xl md:text-8xl font-black mt-8 animate-pulse">
            CARS ABEG
          </h1>
          <p className="text-3xl font-bold mt-4">
            Loading the hottest deals in Naija...
          </p>
        </div>
      </div>
    );
  }

  // REUSABLE SECTION WITH DUBIZZLE-LEVEL POWER
  const HomeSection = ({
    title,
    cars: sectionCars,
    href,
    gradient,
  }: {
    title: string;
    cars: Car[];
    href: string;
    gradient?: string;
  }) => {
    if (sectionCars.length === 0) return null;

    return (
      <section className={`py-12 md:py-20 ${gradient || "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900">
              {title}
            </h2>
            <Link
              href={href}
              className="text-green-600 hover:text-green-700 font-black text-lg md:text-xl underline decoration-4 underline-offset-4 hover:scale-110 transition"
            >
              View All →
            </Link>
          </div>

          {/* MOBILE: Compact Carousel */}
          <div className="md:hidden">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              slidesPerView={1.3}
              centeredSlides={sectionCars.length === 1}
              loop={sectionCars.length > 2}
              autoplay={{ delay: 4000 }}
              navigation
            >
              {sectionCars.map((car) => (
                <SwiperSlide key={car.id}>
                  <div className="px-2">
                    <CarCard car={car} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DESKTOP: Full Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {sectionCars.slice(0, 12).map((car) => (
              <div
                key={car.id}
                className="transform hover:-translate-y-3 transition-all duration-300"
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* PREMIUM HERO — THIS IS DUBIZZLE ON STEROIDS */}
      {paidCars.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-16 md:py-24 text-white">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-4 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full text-2xl md:text-3xl font-black mb-8 animate-pulse shadow-2xl">
              <Flame className="text-yellow-400" size={48} />
              PREMIUM LISTINGS — SELLING IN HOURS
              <TrendingUp className="text-yellow-300" size={48} />
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-6 drop-shadow-2xl">
              {paidCars.length} Cars Moving FAST
            </h1>
            <p className="text-xl md:text-3xl font-bold max-w-4xl mx-auto opacity-95">
              Verified sellers paid ₦50,000 to be here • These cars don’t last
            </p>
          </div>

          {/* MOBILE PREMIUM CAROUSEL */}
          <div className="mt-12 md:hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1.1}
              centeredSlides
              loop
              autoplay={{ delay: 3500 }}
              className="px-4"
            >
              {paidCars.map((car) => (
                <SwiperSlide key={car.id}>
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
                    <CarCard car={car} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DESKTOP PREMIUM GRID */}
          <div className="hidden md:block mt-16 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {paidCars.slice(0, 8).map((car) => (
                <div
                  key={car.id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
                    <CarCard car={car} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MAIN SECTIONS — CLEAN, FAST, CONVERTING */}
      <HomeSection
        title="Foreign Used • Tokunbo"
        cars={foreignUsed}
        href="/inventory?condition=Foreign%20Used"
        gradient="bg-gradient-to-b from-green-50 to-white"
      />
      <HomeSection
        title="Nigerian Used • Clean"
        cars={nigerianUsed}
        href="/inventory?condition=Nigerian%20Used"
        gradient="bg-gradient-to-b from-gray-100 to-white"
      />
      <HomeSection
        title="Cars in Lagos"
        cars={lagosCars}
        href="/inventory?location=Lagos"
      />
      <HomeSection
        title="Below ₦10 Million"
        cars={below10m}
        href="/inventory?maxPrice=10000000"
        gradient="bg-gradient-to-b from-yellow-50 to-white"
      />
      <HomeSection
        title="₦10M – ₦20M"
        cars={between10and20m}
        href="/inventory?minPrice=10000000&maxPrice=20000000"
        gradient="bg-gradient-to-b from-purple-50 to-white"
      />

      {/* FINAL CTA — NO ONE LEAVES WITHOUT ACTION */}
      <section className="py-24 bg-green-600 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-8xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-2xl md:text-4xl font-bold mb-12">
            We’ll source it in 48 hours • Direct from owner • Best price
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20I%20want%20you%20to%20help%20me%20find%20my%20dream%20car"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-8 rounded-full font-black text-3xl md:text-5xl shadow-2xl transform hover:scale-110 transition"
            >
              REQUEST ANY CAR
            </Link>
            <Link
              href="/sell"
              className="border-8 border-white hover:bg-white hover:text-green-600 px-16 py-8 rounded-full font-black text-3xl md:text-5xl transition"
            >
              SELL YOUR CAR FREE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
