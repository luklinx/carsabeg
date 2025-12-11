// src/components/CarCarousel.tsx
"use client";

import { Car } from "@/types";
import { useState } from "react";
import CarCard from "./CarCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CarCarousel({
  cars,
  href,
}: {
  cars: Car[];
  href: string;
}) {
  const [index, setIndex] = useState(0);
  const displayCars = cars.slice(0, 6);
  const showViewAll = cars.length > 6;

  const handleNext = () => {
    if (index < displayCars.length - 1 + (showViewAll ? 1 : 0)) {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {displayCars.map((car) => (
          <div key={car.id} className="min-w-full px-4">
            <CarCard car={car} />
          </div>
        ))}

        {showViewAll && (
          <div className="min-w-full px-4">
            <Link href={href} className="block h-full">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 h-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white/20">
                <ChevronRight size={64} className="mb-6 text-yellow-400" />
                <p className="text-3xl font-black text-center">View All</p>
                <p className="text-xl mt-3 text-center opacity-90">
                  {cars.length - 6}+ cars
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Invisible swipe areas */}
      <button
        onClick={handlePrev}
        className="absolute inset-y-0 left-0 w-1/3 z-10"
        aria-label="Previous"
      />
      <button
        onClick={handleNext}
        className="absolute inset-y-0 right-0 w-1/3 z-10"
        aria-label="Next"
      />
    </div>
  );
}
