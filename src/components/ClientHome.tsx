// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import { Car } from "@/types";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// MOVE CAROUSEL SECTION OUTSIDE — THIS FIXES THE ERROR
const CarouselSection = ({
  title,
  cars: sectionCars,
  filterKey,
  filterValue,
}: {
  title: string;
  cars: Car[];
  filterKey: string;
  filterValue: string;
}) => {
  if (sectionCars.length === 0) return null;

  const query = new URLSearchParams();
  if (filterKey === "price") {
    query.set("maxPrice", filterValue);
  } else {
    query.set(filterKey, filterValue);
  }

  const href = `/inventory?${query.toString()}`;

  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-5xl font-black text-gray-800">
            {title}
          </h2>
          <Link
            href={href}
            className="text-green-600 hover:text-green-800 font-black text-xl underline"
          >
            View All
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.2 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={sectionCars.length > 4}
          className="pb-12"
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
    </section>
  );
};

export default function ClientHome() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      const all = getCars();
      setCars(all);
      setPaidCars(getPaidFeaturedCars());
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="text-4xl font-black text-green-600 animate-pulse">
          LOADING CARS...
        </div>
      </div>
    );
  }

  const foreignUsed = cars
    .filter((c) => c.condition === "Foreign Used")
    .slice(0, 10);
  const nigerianUsed = cars
    .filter((c) => c.condition === "Nigerian Used")
    .slice(0, 10);
  const lagosCars = cars.filter((c) => c.location === "Lagos").slice(0, 10);
  const below10m = cars.filter((c) => c.price <= 10000000).slice(0, 10);

  return (
    <>
      {/* PREMIUM PAID LISTINGS — NOW FIXED */}
      {paidCars.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-yellow-50 to-orange-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-gray-800">
                Premium Listings
              </h2>
              <p className="text-xl text-gray-600 mt-2">
                Only ₦50,000 paid ads appear here
              </p>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={1.1}
              centeredSlides={false}
              loop={paidCars.length > 4}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 2.5, spaceBetween: 24 },
                1024: { slidesPerView: 3.5, spaceBetween: 28 },
                1280: { slidesPerView: 4, spaceBetween: 32 },
              }}
              className="pb-10 !px-4 md:!px-0"
            >
              {paidCars.map((car) => (
                <SwiperSlide key={car.id}>
                  <div className="px-2">
                    <CarCard car={car} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Rest of your sections (unchanged) */}
      <CarouselSection
        title="Foreign Used Cars"
        cars={foreignUsed}
        filterKey="condition"
        filterValue="Foreign Used"
      />
      <CarouselSection
        title="Nigerian Used Cars"
        cars={nigerianUsed}
        filterKey="condition"
        filterValue="Nigerian Used"
      />
      <CarouselSection
        title="Cars in Lagos"
        cars={lagosCars}
        filterKey="location"
        filterValue="Lagos"
      />
      <CarouselSection
        title="Below ₦10 Million"
        cars={below10m}
        filterKey="price"
        filterValue="10000000"
      />

      {/* FINAL CTA */}
      <section className="py-20 text-center bg-green-600 text-white">
        <h2 className="text-3xl md:text-7xl font-black mb-6">
          SELL YOUR CAR TODAY
        </h2>
        <p className="text-2xl mb-8">
          First 3 listings FREE • Then ₦50,000 for top spot
        </p>
        <Link
          href="/sell"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-6 rounded-full font-black text-3xl shadow-2xl transform hover:scale-110 transition"
        >
          LIST YOUR CAR NOW
        </Link>
      </section>
    </>
  );
}
