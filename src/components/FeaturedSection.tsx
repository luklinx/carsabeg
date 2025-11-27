// src/components/FeaturedSection.tsx
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CarGrid from "./CarGrid";
import { Car } from "@/types";

interface Props {
  initialCars: Car[];
  initialFeatured: Car[];
}

export default function FeaturedSection({
  initialCars,
  initialFeatured,
}: Props) {
  const searchParams = useSearchParams();

  const filtered = useMemo(() => {
    const make = searchParams.get("make")?.toLowerCase() || "";
    const min = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0;
    const max = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : Infinity;

    return initialCars.filter((car) => {
      if (make && car.make.toLowerCase() !== make) return false;
      if (min > 0 && car.price < min) return false;
      if (max !== Infinity && car.price > max) return false;
      return car.featured === true;
    });
  }, [searchParams, initialCars]);

  return (
    <>
      {/* FILTER BAR — DARK, BOLD, READABLE */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <form className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <select
              name="make"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-bold text-gray-900 bg-white focus:border-green-600 focus:outline-none transition"
            >
              <option value="">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
              <option value="lexus">Lexus</option>
            </select>

            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₦)"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-bold text-gray-900 placeholder-gray-700 bg-white focus:border-green-600 focus:outline-none transition"
            />

            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              className="p-5 border-2 border-gray-800 rounded-2xl text-xl font-bold text-gray-900 placeholder-gray-700 bg-white focus:border-green-600 focus:outline-none transition"
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-2xl transition shadow-lg"
            >
              SEARCH CARS
            </button>
          </form>
        </div>
      </section>

      {/* RESULTS COUNT */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-3xl font-black text-gray-900">
            {filtered.length} featured car{filtered.length !== 1 && "s"}{" "}
            available
          </p>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16 text-gray-900">
            Featured Rides
          </h2>
          {filtered.length > 0 ? (
            <CarGrid cars={filtered} />
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl font-bold text-gray-500 mb-10">
                No featured cars match your search
              </p>
              <Link
                href="/"
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-full text-2xl font-black transition shadow-xl"
              >
                CLEAR FILTERS
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
