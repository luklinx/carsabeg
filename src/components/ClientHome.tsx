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
// import Logo from "./Logo";

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

  // EXACTLY 4 CARS PER CATEGORY — NO MORE, NO LESS
  const foreignUsed = cars
    .filter((c) => c.condition === "Foreign Used")
    .slice(0, 4);
  const nigerianUsed = cars
    .filter((c) => c.condition === "Nigerian Used")
    .slice(0, 4);
  const brandNew = cars.filter((c) => c.condition === "Brand New").slice(0, 4);
  const lagosCars = cars
    .filter((c) => c.location?.toLowerCase().includes("lagos"))
    .slice(0, 4);
  const below10m = cars.filter((c) => c.price <= 10_000_000).slice(0, 4);
  const between10and20m = cars
    .filter((c) => c.price > 10_000_000 && c.price <= 20_000_000)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center px-6">
        <div className="text-center text-white">
          <Flame
            size={120}
            className="mx-auto animate-pulse text-yellow-400 mb-8"
          />
          <h1 className="text-7xl md:text-9xl font-black animate-pulse">
            CARS ABEG
          </h1>
          <p className="text-3xl md:text-5xl font-bold mt-6">
            Loading fresh deals...
          </p>
        </div>
      </div>
    );
  }

  // REUSABLE SECTION — 4 CARS ONLY + VIEW ALL
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
      <section className={`py-16 md:py-24 ${gradient || "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-5">
              <Icon size={48} className="text-green-600 hidden md:block" />
              <h2 className="text-5xl md:text-7xl font-black text-gray-900">
                {title}
              </h2>
            </div>
            <Link
              href={href}
              className="flex items-center gap-3 text-green-600 hover:text-green-700 font-black text-xl underline decoration-4 underline-offset-8 hover:scale-110 transition"
            >
              View All
            </Link>
          </div>

          {/* MOBILE: 4 SWIPES */}
          <div className="md:hidden">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={1.15}
              centeredSlides
              loop={sectionCars.length >= 3}
              autoplay={{ delay: 5000 }}
              navigation
              className="pb-8"
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

          {/* DESKTOP: 4 GRID */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {sectionCars.map((car) => (
              <div
                key={car.id}
                className="transform hover:-translate-y-4 transition-all duration-300"
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
      {/* HERO WITH LOGO */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20 md:py-32 text-white text-center">
        {/* <Logo size="xl" className="mx-auto mb-10" /> */}
        <h1 className="text-6xl md:text-9xl font-black mb-6 drop-shadow-2xl">
          FIND YOUR DREAM CAR
        </h1>
        <p className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto">
          Foreign Used • Nigerian Used • Brand New • Direct from Owner
        </p>
      </section>

      {/* PREMIUM HERO */}
      {paidCars.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-20 text-white">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-6 bg-black/70 backdrop-blur-xl px-10 py-6 rounded-full text-4xl font-black mb-10 shadow-3xl animate-pulse border-4 border-yellow-400">
              <Flame className="text-yellow-400" size={64} />
              PREMIUM — SELLING IN HOURS
              <TrendingUp className="text-yellow-300" size={64} />
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-8">
              {paidCars.length} HOT DEALS LIVE
            </h1>
          </div>

          <div className="mt-16 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paidCars.slice(0, 4).map((car) => (
                <div
                  key={car.id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-3xl border-4 border-yellow-400">
                    <CarCard car={car} />
                  </div>
                </div>
              ))}
            </div>
            {paidCars.length > 4 && (
              <div className="text-center mt-12">
                <Link
                  href="/inventory?featured=true"
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-full font-black text-3xl shadow-2xl transform hover:scale-110 transition"
                >
                  View All Premium Cars
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MAIN CATEGORIES — 4 CARS ONLY */}
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
      <section className="py-32 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-6xl md:text-9xl font-black mb-12">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-3xl md:text-5xl font-bold mb-16 max-w-4xl mx-auto">
            Tell us what you want — we’ll find it in 48hrs
          </p>
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            <a
              href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20Help%20me%20find%20my%20dream%20car"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-20 py-12 rounded-full font-black text-4xl md:text-6xl shadow-3xl transform hover:scale-110 transition flex items-center gap-6 justify-center"
            >
              <MessageCircle size={64} className="animate-bounce" />
              REQUEST ANY CAR
            </a>
            <Link
              href="/sell"
              className="bg-white text-green-600 px-20 py-12 rounded-full font-black text-4xl md:text-6xl shadow-3xl hover:bg-gray-100 transform hover:scale-110 transition"
            >
              SELL YOUR CAR FREE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
