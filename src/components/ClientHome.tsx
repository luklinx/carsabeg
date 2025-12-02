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

        // FINAL FIX: FILTER OUT BAD CARS
        const safeAll = (all || []).filter((car): car is Car => !!car?.id);
        const safePremium = (premium || []).filter(
          (car): car is Car => !!car?.id
        );

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

  // Safe filtered sections
  const foreignUsed = cars
    .filter((c) => c.condition === "Foreign Used")
    .slice(0, 12);
  const nigerianUsed = cars
    .filter((c) => c.condition === "Nigerian Used")
    .slice(0, 12);
  const lagosCars = cars
    .filter((c) => c.location?.toLowerCase().includes("lagos"))
    .slice(0, 12);
  const below10m = cars.filter((c) => c.price <= 10_000_000).slice(0, 12);
  const between10and20m = cars
    .filter((c) => c.price > 10_000_000 && c.price <= 20_000_000)
    .slice(0, 12);

  if (loading) {
    return (
      <div className="py-32 text-center bg-gray-50">
        <div className="text-5xl md:text-7xl font-black text-green-600 animate-pulse">
          LOADING FRESH CARS...
        </div>
      </div>
    );
  }

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
              className="text-green-600 hover:text-green-700 font-black text-xl underline decoration-4 underline-offset-4"
            >
              View All
            </Link>
          </div>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={sectionCars.length > 4}
            autoplay={{ delay: 4500 }}
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
            {sectionCars.map((car) => (
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
      {/* PREMIUM BANNER */}
      {paidCars.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 py-20">
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-12">
              Fastest Selling Cars in Nigeria
            </h1>
            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              centeredSlides
              loop
              autoplay={{ delay: 4000 }}
            >
              {paidCars.map((car) => (
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
    </>
  );
}
