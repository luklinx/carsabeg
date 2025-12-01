// src/components/FeaturedSection.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import CarGrid from "./CarGrid";
import CarCarousel from "./CarCarousel";
import { Car } from "@/types";

interface Props {
  initialCars: Car[];
}

export default function FeaturedSection({ initialCars }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract filters safely
  const make = (searchParams.get("make") || "").toLowerCase();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;

  // Featured cars (paid or marked featured)
  const featuredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (car.featured_paid || car.featured) {
        if (make && car.make.toLowerCase() !== make) return false;
        if (minPrice > 0 && car.price < minPrice) return false;
        if (maxPrice !== Infinity && car.price > maxPrice) return false;
        return true;
      }
      return false;
    });
  }, [initialCars, make, minPrice, maxPrice]);

  // Condition-based sections
  const tokunbo = useMemo(
    () =>
      initialCars.filter((c) => c.condition === "Foreign Used").slice(0, 20),
    [initialCars]
  );

  const nigerianUsed = useMemo(
    () =>
      initialCars.filter((c) => c.condition === "Nigerian Used").slice(0, 20),
    [initialCars]
  );

  // Handle search form submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams();

    const makeVal = formData.get("make")?.toString().trim();
    const minVal = formData.get("minPrice")?.toString().trim();
    const maxVal = formData.get("maxPrice")?.toString().trim();

    if (makeVal) newParams.set("make", makeVal);
    if (minVal) newParams.set("minPrice", minVal);
    if (maxVal) newParams.set("maxPrice", maxVal);

    router.push(`/?${newParams.toString()}#featured`);
  };

  return (
    <>
      {/* MOBILE-FIRST SEARCH BAR — Sticky, Bold, Dubizzle Style */}
      <section className="sticky top-0 z-50 bg-white border-b-4 border-green-600 shadow-xl">
        <div className="px-4 py-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <select
              name="make"
              defaultValue={make}
              className="w-full px-5 py-5 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            >
              <option value="">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
              <option value="lexus">Lexus</option>
              <option value="bmw">BMW</option>
              <option value="acura">Acura</option>
            </select>

            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₦)"
              defaultValue={minPrice || ""}
              className="w-full px-5 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black placeholder-gray-600 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              defaultValue={maxPrice === Infinity ? "" : maxPrice}
              className="w-full px-5 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black placeholder-gray-600 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xl py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              SEARCH CARS
            </button>
          </form>
        </div>
      </section>

      {/* PREMIUM / FEATURED — Mobile: Carousel | Desktop: Grid */}
      <section
        className="py-12 md:py-20 bg-gradient-to-b from-yellow-50 to-white"
        id="featured"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-4">
            Premium & Featured
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-bold">
            Top picks • Fastest selling • Verified sellers
          </p>
        </div>

        {/* MOBILE: Carousel */}
        <div className="md:hidden mt-10">
          {featuredCars.length > 0 ? (
            <CarCarousel cars={featuredCars} />
          ) : (
            <p className="text-center py-20 text-2xl text-gray-500 font-bold">
              No premium cars right now
            </p>
          )}
        </div>

        {/* DESKTOP: Grid */}
        <div className="hidden md:block mt-16">
          {featuredCars.length > 0 ? (
            <CarGrid cars={featuredCars} />
          ) : (
            <p className="text-center py-32 text-4xl font-black text-gray-300">
              No featured cars yet
            </p>
          )}
        </div>
      </section>

      {/* TOKUNBO SECTION */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-12 text-gray-900">
            Foreign Used (Tokunbo)
          </h2>
          <div className="md:hidden">
            <CarCarousel cars={tokunbo} />
          </div>
          <div className="hidden md:block">
            <CarGrid cars={tokunbo} />
          </div>
        </div>
      </section>

      {/* NIGERIAN USED SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-12 text-gray-900">
            Nigerian Used
          </h2>
          <div className="md:hidden">
            <CarCarousel cars={nigerianUsed} />
          </div>
          <div className="hidden md:block">
            <CarGrid cars={nigerianUsed} />
          </div>
        </div>
      </section>
    </>
  );
}
