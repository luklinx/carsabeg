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
    const showViewAll = sectionCars.length >= 5;

    return (
      <section className={`py-16 md:py-20 ${gradient || "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Icon size={36} className="text-green-600 hidden md:block" />
              <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                {title}
              </h2>
            </div>

            {showViewAll && (
              <Link
                href={href}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-lg underline decoration-2 underline-offset-4 hover:scale-105 transition"
              >
                View All →
              </Link>
            )}
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides
              loop={sectionCars.length >= 3}
              autoplay={{ delay: 5000 }}
              navigation
              className="pb-6"
            >
              {sectionCars.map((car) => (
                <SwiperSlide key={car.id}>
                  <div className="px-1">
                    <CarCard car={car} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {sectionCars.slice(0, 4).map((car) => (
              <div key={car.id} className="hover:-translate-y-2 transition">
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
      {/* PREMIUM HERO — SLIMMED DOWN */}
      {paidCars.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 py-16 text-white">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-8 py-4 rounded-full text-xl font-black mb-8 shadow-2xl border-4 border-yellow-400">
              <Flame size={40} className="text-yellow-400" />
              PREMIUM • SELLING FAST
              <TrendingUp size={40} className="text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {paidCars.length} Hot Deals Live
            </h1>
          </div>

          <div className="mt-12 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paidCars.slice(0, 4).map((car) => (
                <div key={car.id} className="hover:scale-105 transition">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400">
                    <CarCard car={car} />
                  </div>
                </div>
              ))}
            </div>

            {paidCars.length > 4 && (
              <div className="text-center mt-10">
                <Link
                  href="/inventory?featured=true"
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition"
                >
                  View All Premium
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* MAIN CATEGORIES */}
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

      {/* FINAL CTA — SLIM & ELEGANT */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto">
            Tell us what you want — we’ll source it in 48hrs
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a
              href="https://wa.me/2348022772234?text=Hi%20CarsAbeg!%20Help%20me%20find%20my%20dream%20car"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-xl md:text-2xl shadow-2xl hover:scale-105 transition flex items-center gap-4 justify-center"
            >
              <MessageCircle size={36} className="animate-bounce" />
              REQUEST ANY CAR
            </a>
            <Link
              href="/sell"
              className="bg-white text-green-700 hover:bg-gray-100 px-12 py-6 rounded-3xl font-black text-xl md:text-2xl shadow-2xl hover:scale-105 transition"
            >
              SELL YOUR CAR FREE
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
