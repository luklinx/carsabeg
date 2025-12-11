// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Flame,
  TrendingUp,
  Zap,
  Shield,
  Phone,
  MapPin,
  MessageCircle,
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

  // PREMIUM SECTION — MULTIPLE IMAGE SWIPE + DOTS (NO ARROWS)
  const PremiumSection = () => {
    if (paidCars.length === 0) return null;

    return (
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white overflow-hidden">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-8 py-4 rounded-full text-2xl md:text-3xl font-black shadow-2xl border-4 border-yellow-400">
            <Flame className="text-yellow-400" size={36} />
            PREMIUM • SELLING FAST
            <TrendingUp className="text-yellow-300" size={36} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mt-8">
            {paidCars.length} Hot Deals Live
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* MOBILE & DESKTOP — SAME SWIPER */}
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1.1}
            centeredSlides
            loop={paidCars.length >= 2}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="premium-swiper !pb-12"
            breakpoints={{
              640: { slidesPerView: 1.3 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {paidCars.map((car) => (
              <SwiperSlide key={car.id}>
                <div className="px-2">
                  {/* PREMIUM CARD WITH IMAGE SWIPER INSIDE */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400 shadow-2xl">
                    {/* IMAGE SWIPER — INSIDE EACH CARD */}
                    <Swiper
                      modules={[Pagination]}
                      spaceBetween={0}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      className="!pb-10"
                    >
                      {car.images.map((img, i) => (
                        <SwiperSlide key={i}>
                          <div className="relative aspect-[4/3] md:aspect-video">
                            <img
                              src={img}
                              alt={`${car.make} ${car.model} image ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* CARD CONTENT */}
                    <div className="p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-black">
                        {car.year} {car.make} {car.model}
                      </h3>
                      <p className="text-3xl md:text-4xl font-black text-yellow-400 mt-2">
                        ₦{(car.price / 1_000_000).toFixed(1)}M
                      </p>
                      <p className="text-lg opacity-90 mt-2">
                        {car.location} • {car.condition}
                      </p>
                      <Link
                        href={`/car/${car.id}`}
                        className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full font-black text-lg shadow-xl"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* VIEW ALL — AFTER 8 CARS */}
          {paidCars.length > 8 && (
            <div className="text-center mt-10">
              <Link
                href="/inventory?featured=true"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-110 transition"
              >
                View All Premium ({paidCars.length - 8}+)
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  // REGULAR SECTIONS — NO ARROWS, FULL WIDTH CARDS ON MOBILE
  const HomeSection = ({
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

    const showViewMoreMobile = sectionCars.length > 6;
    const showViewAllDesktop = sectionCars.length > 8;

    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <Icon size={36} className="text-green-600 hidden md:block" />
              <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                {title}
              </h2>
            </div>
            {showViewAllDesktop && (
              <Link
                href={href}
                className="hidden md:block text-green-600 font-black text-xl hover:underline"
              >
                View All →
              </Link>
            )}
          </div>

          {/* MOBILE — FULL WIDTH CARDS, NO ARROWS */}
          <div className="md:hidden space-y-6">
            {sectionCars.slice(0, 6).map((car) => (
              <div key={car.id}>
                <CarCard car={car} />
              </div>
            ))}
            {showViewMoreMobile && (
              <Link href={href}>
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-10 text-white text-center shadow-2xl">
                  <p className="text-3xl font-black">View More</p>
                  <p className="text-xl mt-2">
                    {sectionCars.length - 6}+ cars available
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* DESKTOP — GRID */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {sectionCars.slice(0, 8).map((car) => (
              <div key={car.id} className="hover:-translate-y-3 transition">
                <CarCard car={car} />
              </div>
            ))}
          </div>

          {/* LOAD MORE — DESKTOP */}
          {showViewAllDesktop && (
            <div className="text-center mt-12">
              <Link
                href={href}
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-12 py-6 py-6 rounded-full font-black text-2xl shadow-2xl transition hover:scale-110"
              >
                Load More ({sectionCars.length - 8}+)
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Flame
            size={80}
            className="mx-auto animate-pulse text-yellow-400 mb-6"
          />
          <h1 className="text-6xl font-black">CARS ABEG</h1>
          <p className="text-2xl font-bold mt-4">Loading fresh deals...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PremiumSection />

      <HomeSection
        title="Brand New Cars"
        cars={brandNew}
        href="/inventory?condition=Brand%20New"
        icon={Zap}
      />
      <HomeSection
        title="Foreign Used • Tokunbo"
        cars={foreignUsed}
        href="/inventory?condition=Foreign%20Used"
        icon={Shield}
      />
      <HomeSection
        title="Nigerian Used • Clean"
        cars={nigerianUsed}
        href="/inventory?condition=Nigerian%20Used"
        icon={Phone}
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
      />
      <HomeSection
        title="₦10M – ₦20M"
        cars={between10and20m}
        href="/inventory?minPrice=10000000&maxPrice=20000000"
        icon={Flame}
      />

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-12 mb-12">
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
