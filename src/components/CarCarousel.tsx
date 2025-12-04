// src/components/CarCarousel.tsx
"use client";
import { Car } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarCarousel({ cars }: { cars: Car[] }) {
  const [index, setIndex] = useState(0);

  const validCars = (cars || []).filter(
    (car) => car?.id && car.images && car.images.length > 0
  );

  useEffect(() => {
    if (validCars.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validCars.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [validCars.length]);

  if (validCars.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24 md:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl sm:rounded-3xl text-white shadow-2xl px-4 sm:px-6">
        <p className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 sm:mb-6">
          No Premium Cars Yet
        </p>
        <p className="text-base sm:text-lg md:text-2xl opacity-80">
          Fresh tokunbo beasts dropping soon...
        </p>
      </div>
    );
  }

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + validCars.length) % validCars.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % validCars.length);
  const car = validCars[index];

  if (!car?.id) {
    return (
      <div className="bg-red-900 text-white p-6 sm:p-10 md:p-20 rounded-2xl sm:rounded-3xl text-center text-lg sm:text-2xl md:text-3xl font-black">
        CAROUSEL ERROR: MISSING ID
      </div>
    );
  }

  return (
    <div className="relative group w-full">
      {/* MAIN SLIDE */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl w-full">
        <Link href={`/car/${car.id}`} className="block w-full">
          <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gradient-to-b from-gray-900 to-black w-full">
            <Image
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* TEXT CONTENT — RESPONSIVE */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-10 text-white">
              <h3 className="text-xl sm:text-3xl md:text-5xl font-black drop-shadow-2xl leading-tight">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-lg sm:text-2xl md:text-4xl font-black text-yellow-400 drop-shadow-2xl mt-1 sm:mt-2">
                ₦{(car.price / 1_000_000).toFixed(1)}M
              </p>
              <p className="text-xs sm:text-base md:text-lg font-medium opacity-90 mt-2 sm:mt-3">
                {car.location} •{" "}
                {car.condition === "Foreign Used" ? "TOKUNBO" : car.condition}
              </p>
            </div>

            {/* PREMIUM BADGE — RESPONSIVE */}
            {car.featured_paid && (
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 sm:px-5 py-1 sm:py-2 rounded-full font-black text-xs sm:text-lg shadow-xl animate-pulse">
                PREMIUM
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* NAVIGATION ARROWS — RESPONSIVE */}
      {validCars.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 sm:p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </button>
        </>
      )}

      {/* DOTS INDICATOR — RESPONSIVE */}
      {validCars.length > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {validCars.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-500 rounded-full ${
                i === index
                  ? "bg-green-500 w-8 sm:w-10 h-2 sm:h-2.5 shadow-lg shadow-green-500/50"
                  : "bg-white/40 w-2 sm:w-2.5 h-2 sm:h-2.5 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* COUNTER — RESPONSIVE */}
      {validCars.length > 1 && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm md:text-base">
          {index + 1} / {validCars.length}
        </div>
      )}
    </div>
  );
}
