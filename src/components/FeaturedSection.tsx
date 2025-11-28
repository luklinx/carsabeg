// src/components/FeaturedSection.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CarGrid from "./CarGrid";
import CarCarousel from "./CarCarousel";
import { Car } from "@/types";

interface Props {
  initialCars: Car[];
}

export default function FeaturedSection({ initialCars }: Props) {
  const searchParams = useSearchParams();

  // Extract values directly — this fixes React Compiler memo conflict
  const make = (searchParams.get("make") || "").toLowerCase();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;

  // useMemo with correct dependencies — React Compiler now happy
  const filtered = useMemo(() => {
    return initialCars.filter((car) => {
      if (make && car.make.toLowerCase() !== make) return false;
      if (minPrice > 0 && car.price < minPrice) return false;
      if (maxPrice !== Infinity && car.price > maxPrice) return false;
      return car.featured === true;
    });
  }, [initialCars, make, minPrice, maxPrice]); // ← Correct dependencies

  const tokunbo = useMemo(
    () => initialCars.filter((c) => c.condition === "Foreign Used"),
    [initialCars]
  );

  const nigerian = useMemo(
    () => initialCars.filter((c) => c.condition === "Nigerian Used"),
    [initialCars]
  );

  return (
    <>
      {/* FILTER BAR */}
      <section className="py-10 bg-white border-b sticky top-16 z-40 shadow-lg">
        <div className="container mx-auto px-6">
          <form className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <select
              name="make"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-black text-gray-900 bg-white focus:border-green-600"
            >
              <option value="">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="mercedes-benz">Mercedes</option>
              <option value="lexus">Lexus</option>
            </select>
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₦)"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-black text-gray-900 placeholder-gray-700"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-black text-gray-900 placeholder-gray-700"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl transition shadow-lg"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* MOBILE: Carousel */}
      <section className="py-12 bg-gradient-to-b from-green-50 to-white md:hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-8">
            Featured Rides
          </h2>
          <CarCarousel cars={filtered} />
        </div>
      </section>

      {/* DESKTOP: Grid */}
      <section className="hidden md:block py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-black text-center mb-16">
            Featured Rides
          </h2>
          {filtered.length > 0 ? (
            <CarGrid cars={filtered} />
          ) : (
            <p className="text-center text-3xl py-20">No featured cars</p>
          )}
        </div>
      </section>

      {/* TOKUNBO ROW */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            Foreign Used (Tokunbo)
          </h2>
          <div className="md:hidden">
            <CarCarousel cars={tokunbo.slice(0, 10)} />
          </div>
          <div className="hidden md:block">
            <CarGrid cars={tokunbo.slice(0, 12)} />
          </div>
        </div>
      </section>

      {/* NIGERIAN USED ROW */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            Nigerian Used
          </h2>
          <div className="md:hidden">
            <CarCarousel cars={nigerian.slice(0, 10)} />
          </div>
          <div className="hidden md:block">
            <CarGrid cars={nigerian.slice(0, 12)} />
          </div>
        </div>
      </section>
    </>
  );
}
