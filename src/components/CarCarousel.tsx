// src/components/CarCarousel.tsx
"use client";
import { Car } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarCarousel({ cars }: { cars: Car[] }) {
  const [index, setIndex] = useState(0);

  // FILTER VALID CARS FIRST — BEFORE ANY HOOKS
  const validCars =
    cars?.filter((car) => car?.id && car.images?.length > 0) || [];

  // AUTO-PLAY — MUST BE AFTER ALL STATE, BEFORE ANY RETURN
  useEffect(() => {
    if (validCars.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validCars.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [validCars.length]); // ← DEPENDS ON validCars, NOT raw cars

  // EARLY RETURN ONLY AFTER ALL HOOKS
  if (validCars.length === 0) {
    return (
      <div className="text-center py-32 bg-gradient-to-b from-gray-900 to-black rounded-3xl text-white">
        <p className="text-4xl md:text-6xl font-black">No Premium Cars Yet</p>
        <p className="text-xl mt-6 opacity-80">New beasts dropping soon...</p>
      </div>
    );
  }

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + validCars.length) % validCars.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % validCars.length);
  const car = validCars[index];

  return (
    <div className="relative group">
      {/* Main Slide */}
      <div className="overflow-hidden rounded-3xl shadow-2xl bg-gray-900">
        <Link href={`/car/${car.id}`} className="block">
          <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gray-800">
            <Image
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              priority
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black drop-shadow-2xl leading-tight">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-4xl md:text-6xl font-black text-yellow-400 drop-shadow-2xl mt-3">
                ₦{(car.price / 1_000_000).toFixed(1)}M
              </p>
              <p className="text-xl md:text-2xl font-medium opacity-90 mt-4">
                {car.location} •{" "}
                {car.condition === "Foreign Used" ? "TOKUNBO" : car.condition}
              </p>
            </div>

            {car.featured_paid && (
              <div className="absolute top-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-black text-2xl shadow-2xl animate-pulse">
                PREMIUM
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Arrows */}
      {validCars.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      {/* Dots */}
      {validCars.length > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          {validCars.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === index
                  ? "bg-green-500 w-16 h-4 shadow-lg"
                  : "bg-white/50 w-4 h-4 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {validCars.length > 1 && (
        <div className="absolute top-8 left-8 bg-black/70 text-white px-5 py-3 rounded-full font-bold text-lg backdrop-blur-sm">
          {index + 1} / {validCars.length}
        </div>
      )}
    </div>
  );
}
