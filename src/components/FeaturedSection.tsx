// src/components/FeaturedSection.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import CarCarousel from "./CarCarousel";
import CarGrid from "./CarGrid";
import { Car } from "@/types";
import { Zap, Search, Filter, Star, TrendingUp } from "lucide-react";

interface Props {
  initialCars: Car[];
}

export default function FeaturedSection({ initialCars }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const make = (searchParams.get("make") || "").toLowerCase();
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;

  // PREMIUM CARS — ONLY THE BEST
  const featuredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (!(car.featured_paid || car.featured)) return false;
      if (make && car.make.toLowerCase() !== make) return false;
      if (minPrice > 0 && car.price < minPrice) return false;
      if (maxPrice !== Infinity && car.price > maxPrice) return false;
      return !!car.id; // FINAL SAFETY
    });
  }, [initialCars, make, minPrice, maxPrice]);

  const tokunbo = useMemo(
    () =>
      initialCars
        .filter((c) => c.condition === "Foreign Used" && c.id)
        .slice(0, 20),
    [initialCars]
  );

  const nigerianUsed = useMemo(
    () =>
      initialCars
        .filter((c) => c.condition === "Nigerian Used" && c.id)
        .slice(0, 20),
    [initialCars]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const makeVal = formData.get("make")?.toString().trim();
    const minVal = formData.get("minPrice")?.toString().trim();
    const maxVal = formData.get("maxPrice")?.toString().trim();

    if (makeVal) params.set("make", makeVal);
    if (minVal) params.set("minPrice", minVal);
    if (maxVal) params.set("maxPrice", maxVal);

    router.push(`/?${params.toString()}#featured`);
  };

  return (
    <>
      {/* HERO SEARCH BAR — MOBILE FIRST, BOLD, UNMISSABLE */}
      <section className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-700 shadow-2xl">
        <div className="px-4 py-8 md:py-12">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 max-w-7xl mx-auto"
          >
            {/* MAKE */}
            <div className="lg:col-span-4">
              <select
                name="make"
                defaultValue={make || ""}
                className="w-full px-6 py-5 text-lg font-black bg-white border-4 border-gray-900 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200 transition-all"
              >
                <option value="">All Makes</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="lexus">Lexus</option>
                <option value="mercedes-benz">Mercedes-Benz</option>
                <option value="bmw">BMW</option>
                <option value="acura">Acura</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
              </select>
            </div>

            {/* PRICE RANGE */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price ₦"
                defaultValue={minPrice || ""}
                className="px-6 py-5 text-lg font-black bg-white border-4 border-gray-900 rounded-2xl placeholder-gray-500 focus:border-green-400 focus:ring-4 focus:ring-green-200"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price ₦"
                defaultValue={maxPrice === Infinity ? "" : maxPrice}
                className="px-6 py-5 text-lg font-black bg-white border-4 border-gray-900 rounded-2xl placeholder-gray-500 focus:border-green-400 focus:ring-4 focus:ring-green-200"
              />
            </div>

            {/* SEARCH BUTTON */}
            <div className="lg:col-span-3">
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Search size={32} />
                FIND MY CAR
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* PREMIUM SECTION — PURE FIRE */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full text-2xl font-black mb-8 animate-pulse">
            <Zap className="text-yellow-400" size={40} />
            PREMIUM LISTINGS — SELLING FAST
            <TrendingUp className="text-yellow-300" size={40} />
          </div>
          <h2 className="text-3xl md:text-2xl font-black mb-6 drop-shadow-2xl">
            {featuredCars.length} Hot Deals Right Now
          </h2>
          <p className="text-2xl md:text-2xl font-bold max-w-4xl mx-auto opacity-95">
            These cars move in days • Verified sellers • Direct contact
          </p>
        </div>

        {/* MOBILE: CAROUSEL */}
        <div className="mt-12 md:hidden">
          {featuredCars.length > 0 ? (
            <CarCarousel cars={featuredCars} />
          ) : (
            <p className="text-center py-20 text-3xl font-black opacity-80">
              No premium cars right now
            </p>
          )}
        </div>

        {/* DESKTOP: FULL GRID */}
        <div className="hidden md:block mt-16 max-w-7xl mx-auto px-6">
          {featuredCars.length > 0 ? (
            <CarGrid cars={featuredCars} />
          ) : (
            <p className="text-center py-32 text-3xl font-black opacity-50">
              No premium cars yet
            </p>
          )}
        </div>
      </section>

      {/* TOKUNBO SECTION — GREEN ENERGY */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-3xl font-black text-green-600 mb-6">
              FOREIGN USED
            </h2>
            <p className="text-3xl md:text-3xl font-black text-gray-800">
              Tokunbo • Clean Title • Zero Accidents
            </p>
            <div className="flex justify-center gap-6 mt-8">
              <span className="bg-green-600 text-white px-8 py-4 rounded-full font-black text-2xl shadow-xl">
                USA Specs
              </span>
              <span className="bg-green-600 text-white px-8 py-4 rounded-full font-black text-2xl shadow-xl">
                Canada Specs
              </span>
            </div>
          </div>

          <div className="md:hidden">
            <CarCarousel cars={tokunbo} />
          </div>
          <div className="hidden md:block">
            <CarGrid cars={tokunbo} />
          </div>
        </div>
      </section>

      {/* NIGERIAN USED SECTION — NAIJA PRIDE */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-3xl font-black text-gray-900 mb-6">
              NIGERIAN USED
            </h2>
            <p className="text-3xl md:text-3xl font-black text-gray-700">
              Clean • Well Maintained • Lagos Registered
            </p>
            <div className="flex justify-center gap-8 mt-10">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <Star className="text-yellow-500 mx-auto mb-4" size={60} />
                <p className="text-2xl font-black">Top Condition</p>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <Filter className="text-green-600 mx-auto mb-4" size={60} />
                <p className="text-2xl font-black">Accident Free</p>
              </div>
            </div>
          </div>

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
