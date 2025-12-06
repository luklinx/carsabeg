// src/components/InventoryFilters.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { Car } from "@/types";
import CarGrid from "./CarGrid";
import { Filter, X } from "lucide-react";

interface Props {
  initialCars: Car[];
}

export default function InventoryFilters({ initialCars }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract current filters
  const currentMake = (searchParams.get("make") || "").toLowerCase();
  const currentMin = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const currentMax = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : Infinity;
  const currentCondition = searchParams.get("condition") || "";

  // Filter cars with useMemo — blazing fast
  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (currentMake && car.make.toLowerCase() !== currentMake) return false;
      if (currentMin > 0 && car.price < currentMin) return false;
      if (currentMax !== Infinity && car.price > currentMax) return false;
      if (currentCondition && car.condition !== currentCondition) return false;
      return true;
    });
  }, [initialCars, currentMake, currentMin, currentMax, currentCondition]);

  // Update URL on filter change
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearFilters = () => {
    router.push("/inventory", { scroll: false });
  };

  // Auto-scroll to results on mobile when filters change
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  }, [filteredCars]);

  const hasActiveFilters =
    currentMake ||
    currentMin > 0 ||
    currentMax !== Infinity ||
    currentCondition;

  return (
    <>
      {/* STICKY MOBILE FILTER BAR — Nigerian Genius */}
      <div className="sticky top-0 z-40 bg-white border-b-4 border-green-600 shadow-xl">
        <div className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-3xl font-black text-gray-900">
              All Cars ({filteredCars.length})
            </h1>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-green-600 font-black text-lg hover:bg-green-50 px-4 py-2 rounded-full transition"
              >
                <X size={20} />
                Clear All
              </button>
            )}
          </div>

          {/* FILTERS — Mobile: Full Width | Desktop: Compact */}
          <form className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Make */}
            <select
              value={currentMake}
              onChange={(e) => updateSearchParams("make", e.target.value)}
              className="px-4 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            >
              <option value="">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="lexus">Lexus</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
              <option value="bmw">BMW</option>
              <option value="hyundai">Hyundai</option>
              <option value="kia">Kia</option>
            </select>

            {/* Condition */}
            <select
              value={currentCondition}
              onChange={(e) => updateSearchParams("condition", e.target.value)}
              className="px-4 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            >
              <option value="">All Conditions</option>
              <option value="Foreign Used">Foreign Used</option>
              <option value="Nigerian Used">Nigerian Used</option>
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min Price"
              value={currentMin || ""}
              onChange={(e) => updateSearchParams("minPrice", e.target.value)}
              className="px-4 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black placeholder-gray-500 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max Price"
              value={currentMax === Infinity ? "" : currentMax}
              onChange={(e) => updateSearchParams("maxPrice", e.target.value)}
              className="px-4 py-4 border-2 border-gray-800 rounded-2xl text-lg font-black placeholder-gray-500 focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            {/* Mobile Filter Button (hidden on large screens) */}
            <div className="md:hidden col-span-2">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("results")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-105 transition-all"
              >
                <Filter size={24} />
                Show {filteredCars.length} Cars
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RESULTS HEADER */}
      <section
        className="bg-gradient-to-b from-green-50 to-white py-12"
        id="results"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-2xl font-black text-gray-900">
            {filteredCars.length} {filteredCars.length === 1 ? "Car" : "Cars"}{" "}
            Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mt-4 font-bold">
            Fresh listings • Verified sellers • Best prices in Nigeria
          </p>
        </div>
      </section>

      {/* CAR GRID */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          {filteredCars.length > 0 ? (
            <CarGrid cars={filteredCars} />
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl">
              <div className="text-3xl font-black text-gray-400 mb-8">
                No cars found
              </div>
              <p className="text-2xl text-gray-600 mb-10">
                Try adjusting your filters — new cars arrive every minute!
              </p>
              <button
                onClick={clearFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl transform hover:scale-110 transition"
              >
                Show All Cars
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
