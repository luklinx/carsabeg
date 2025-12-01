// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react"; // ← FIXED
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // ← Removed unused Pagination
import "swiper/css";
import "swiper/css/navigation";

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
        setCars(all);
        setPaidCars(premium);
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // FILTERED SECTIONS — FULLY TYPE-SAFE
  const foreignUsed = cars
    .filter((car: Car) => car.condition === "Foreign Used")
    .slice(0, 12);

  const nigerianUsed = cars
    .filter((car: Car) => car.condition === "Nigerian Used")
    .slice(0, 12);

  const lagosCars = cars
    .filter((car: Car) => car.location.toLowerCase().includes("lagos"))
    .slice(0, 12);

  const below10m = cars
    .filter((car: Car) => car.price <= 10_000_000)
    .slice(0, 12);

  const between10and20m = cars
    .filter((car: Car) => car.price > 10_000_000 && car.price <= 20_000_000)
    .slice(0, 12);

  if (loading) {
    return (
      <div className="py-32 text-center bg-gray-50">
        <div className="text-5xl md:text-7xl font-black text-green-600 animate-pulse">
          LOADING FRESH CARS...
        </div>
        <p className="text-2xl text-gray-600 mt-8">
          Thousands of verified cars waiting
        </p>
      </div>
    );
  }

  // REUSABLE CAROUSEL SECTION — TYPE-SAFE
  const CarouselSection = ({
    title,
    cars: sectionCars,
    href,
  }: {
    title: string;
    cars: Car[];
    href: string;
  }) => {
    if (sectionCars.length === 0) return null;

    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900">
              {title}
            </h2>
            <Link
              href={href}
              className="text-green-600 hover:text-green-700 font-black text-xl underline decoration-4 underline-offset-4 hover:decoration-green-600 transition"
            >
              View All
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={sectionCars.length > 4}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            navigation
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
              1536: { slidesPerView: 6 },
            }}
            className="!pb-12"
          >
            {sectionCars.map((car: Car) => (
              <SwiperSlide key={car.id}>
                <div className="px-3">
                  <div className="transform transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
                    <CarCard car={car} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* HERO PREMIUM BANNER */}
      {paidCars.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 py-20">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
            <div className="inline-flex items-center gap-4 bg-black/40 backdrop-blur-md px-8 py-4 rounded-full text-2xl font-black mb-8">
              PREMIUM LISTINGS
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl">
              Fastest Selling Cars in Nigeria
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-12 max-w-4xl mx-auto">
              Only verified dealers pay ₦50,000 to appear here — these cars move
              in days
            </p>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              centeredSlides={true}
              loop
              autoplay={{ delay: 4000 }}
              className="max-w-6xl mx-auto"
            >
              {paidCars.map((car: Car) => (
                <SwiperSlide key={car.id}>
                  <div className="px-10">
                    <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
                      <CarCard car={car} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* MAIN SECTIONS */}
      <CarouselSection
        title="Foreign Used Cars"
        cars={foreignUsed}
        href="/inventory?condition=Foreign%20Used"
      />
      <CarouselSection
        title="Nigerian Used Cars"
        cars={nigerianUsed}
        href="/inventory?condition=Nigerian%20Used"
      />
      <CarouselSection
        title="Cars in Lagos"
        cars={lagosCars}
        href="/inventory?location=Lagos"
      />
      <CarouselSection
        title="Below ₦10 Million"
        cars={below10m}
        href="/inventory?maxPrice=10000000"
      />
      <CarouselSection
        title="₦10M – ₦20M"
        cars={between10and20m}
        href="/inventory?minPrice=10000000&maxPrice=20000000"
      />

      {/* FINAL CTA */}
      <section className="py-24 bg-green-600 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-8xl font-black mb-8">
            SELL YOUR CAR IN 48 HOURS
          </h2>
          <p className="text-2xl md:text-3xl font-bold mb-12 max-w-3xl mx-auto">
            List for FREE today • Get buyers calling immediately • Premium spot
            available
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/sell"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-16 py-8 rounded-full font-black text-3xl md:text-4xl shadow-2xl transform hover:scale-110 transition duration-300"
            >
              LIST YOUR CAR FREE
            </Link>
            <Link
              href="/sell"
              className="border-4 border-white text-white hover:bg-white hover:text-green-600 px-16 py-8 rounded-full font-black text-2xl md:text-3xl transition duration-300"
            >
              Go Premium (₦50k)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
