// src/components/SimilarCars.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Car } from "@/types";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  currentCarId: string;
  make?: string;
  title?: string; // e.g. "Similar Cars" or "You might also like"
  limit?: number; // number of similar cars to return (default 6)
}

export default function SimilarCars({
  currentCarId,
  make: passedMake,
  title = "Similar Cars",
  limit = 6,
}: Props) {
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch current car first
        const { data: current } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("id", currentCarId)
          .eq("approved", true)
          .single();

        if (!current) {
          setCurrentCar(null);
          setSimilarCars([]);
          return;
        }
        setCurrentCar(current);

        // Fetch candidate cars (broad query then score/rank client-side)
        const { data: candidates } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("approved", true)
          .neq("id", currentCarId)
          .limit(200);

        if (!candidates || candidates.length === 0) {
          setSimilarCars([]);
          return;
        }

        // Scoring: prioritize same make/model, then price proximity and year closeness
        const scored = candidates
          .map((car) => {
            let score = 0;
            if (car.make?.toLowerCase() === current.make?.toLowerCase())
              score += 50;
            if (car.model?.toLowerCase() === current.model?.toLowerCase())
              score += 70;

            // price proximity: within 20% = +30, within 10% = +50
            const priceDiff = Math.abs((car.price || 0) - (current.price || 0));
            const pricePct = current.price ? priceDiff / current.price : 1;
            if (pricePct <= 0.1) score += 50;
            else if (pricePct <= 0.2) score += 30;

            // year closeness
            if (current.year && car.year) {
              const yearDiff = Math.abs(car.year - current.year);
              if (yearDiff <= 1) score += 20;
              else if (yearDiff <= 3) score += 10;
            }

            // bonus for same condition
            if (car.condition === current.condition) score += 5;

            return { car, score };
          })
          .sort((a, b) => b.score - a.score)
          .map((s) => s.car)
          .slice(0, Math.max(6, limit));

        setSimilarCars(scored);
      } catch (err) {
        console.error("Similar cars fetch failed:", err);
        setSimilarCars([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentCarId, limit]);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToIndex = useCallback(
    (index: number) => {
      const bounded = Math.max(0, Math.min(index, similarCars.length - 1));
      const el = itemRefs.current[bounded];
      if (el) el.scrollIntoView({ behavior: "smooth", inline: "start" });
      setCurrentIndex(bounded);
    },
    [similarCars.length]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // choose entry with highest intersectionRatio
        let bestIndex = currentIndex;
        let bestRatio = 0;
        entries.forEach((entry) => {
          const idx = items.indexOf(entry.target as HTMLDivElement);
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = idx;
          }
        });
        if (bestIndex !== currentIndex) setCurrentIndex(bestIndex);
      },
      { root: container, threshold: [0.25, 0.5, 0.75] }
    );

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, [similarCars, currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToIndex(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToIndex(currentIndex - 1);
    }
  };

  const displayMake = passedMake || currentCar?.make || "";

  // Loading skeleton
  if (loading) {
    const mobileSkeletons = Array.from({ length: 4 });
    const desktopSkeletons = Array.from({ length: 8 });

    return (
      <section className="mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-10 px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">You might also like</p>
          </div>
          <Link
            href={`/inventory?make=${encodeURIComponent(displayMake)}`}
            className="text-sm font-bold text-green-600"
          >
            View more
          </Link>
        </div>

        {/* Mobile horizontal skeleton */}
        <div className="md:hidden overflow-x-auto -mx-3 pb-4">
          <div className="flex gap-4 px-3">
            {mobileSkeletons.map((_, i) => (
              <div key={i} className="min-w-[260px] w-[260px] flex-shrink-0">
                <div className="bg-gray-200 rounded-lg h-40 animate-pulse" />
                <div className="mt-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid skeleton */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {desktopSkeletons.map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-3">
              <div className="bg-gray-200 h-44 rounded-lg animate-pulse" />
              <div className="mt-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!currentCar || similarCars.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-10 px-3 sm:px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">More {displayMake} rides</p>
        </div>
        <Link
          href={`/inventory?make=${encodeURIComponent(displayMake)}`}
          className="text-sm font-bold text-green-600"
        >
          View more
        </Link>
      </div>

      {/* Mobile: horizontal carousel with snap + keyboard support */}
      <div className="md:hidden relative -mx-3 pb-6">
        <div
          ref={scrollRef}
          onKeyDown={handleKeyDown}
          role="list"
          aria-label={title}
          tabIndex={0}
          className="flex gap-4 px-3 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {similarCars.map((car, i) => (
            <div
              key={car.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="listitem"
              tabIndex={-1}
              className="min-w-[260px] w-[260px] flex-shrink-0 snap-start"
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>

        {/* Left chevron (mobile) */}
        <button
          onClick={() => goToIndex(currentIndex - 1)}
          aria-label="Previous"
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-20 text-white focus:outline-none disabled:opacity-30"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Right chevron (mobile) */}
        <button
          onClick={() => goToIndex(currentIndex + 1)}
          aria-label="Next"
          disabled={currentIndex >= similarCars.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-20 text-white focus:outline-none disabled:opacity-30"
        >
          <ArrowRight size={18} />
        </button>

        {/* Counter overlay */}
        <div className="absolute right-3 bottom-3 bg-green-600 text-white px-3 py-1 rounded-full shadow-lg text-sm md:text-base font-black">
          {currentIndex + 1}/{similarCars.length}
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mt-3 md:hidden">
          {similarCars.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              aria-label={`Go to item ${i + 1} of ${similarCars.length}`}
              aria-pressed={i === currentIndex}
              className={`w-2 h-2 rounded-full transform transition-all ${
                i === currentIndex
                  ? "bg-green-600 scale-110 shadow-md"
                  : "bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-300`}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarCars.map((car) => (
          <div key={car.id}>
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-10 sm:mt-12 md:mt-16">
        <Link
          href={`/inventory?make=${encodeURIComponent(displayMake)}`}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black text-base shadow-md"
        >
          View All {displayMake} Cars
          <ArrowRight size={16} />
        </Link>
        <p className="text-gray-600 font-bold text-xs sm:text-sm md:text-lg mt-4 sm:mt-5 md:mt-6">
          {similarCars.length}+ similar cars available right now
        </p>
      </div>
    </section>
  );
}
