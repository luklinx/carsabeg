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

  const params = Object.fromEntries(searchParams ?? new URLSearchParams());

  const make = (params.make || "").toLowerCase();
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || Infinity;

  const featuredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (!(car.featured_paid || car.featured)) return false;
      if (make && car.make.toLowerCase() !== make) return false;
      if (minPrice > 0 && car.price < minPrice) return false;
      if (maxPrice !== Infinity && car.price > maxPrice) return false;
      return !!car.id;
    });
  }, [initialCars, make, minPrice, maxPrice]);

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
      {/* YOUR HERO SEARCH BAR */}
      <section className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-emerald-700 shadow-2xl">
        <div className="px-4 py-8 md:py-12">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 max-w-7xl mx-auto"
          >
            {/* Your select/input fields */}
          </form>
        </div>
      </section>

      {/* PREMIUM SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full text-2xl font-black mb-8 animate-pulse">
            <Zap className="text-yellow-400" size={40} />
            PREMIUM LISTINGS — SELLING FAST
            <TrendingUp className="text-yellow-300" size={40} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-2xl">
            {featuredCars.length} Hot Deals Right Now
          </h2>
        </div>

        {/* MOBILE: CarCarousel with href */}
        <div className="mt-12 md:hidden">
          {featuredCars.length > 0 ? (
            <CarCarousel cars={featuredCars} href="/inventory?featured=true" />
          ) : (
            <p className="text-center py-20 text-3xl font-black opacity-80">
              No premium cars right now
            </p>
          )}
        </div>

        {/* DESKTOP: CarGrid */}
        <div className="hidden md:block mt-16 max-w-7xl mx-auto px-6">
          {featuredCars.length > 0 ? (
            <CarGrid cars={featuredCars} href="/inventory?featured=true" />
          ) : (
            <p className="text-center py-32 text-3xl font-black opacity-50">
              No premium cars yet
            </p>
          )}
        </div>
      </section>

      {/* REST OF YOUR SECTIONS */}
      {/* ... */}
    </>
  );
}
