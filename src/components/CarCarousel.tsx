// src/components/CarCarousel.tsx
"use client";

import { Car } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarCarousel({ cars }: { cars: Car[] }) {
  const [index, setIndex] = useState(0);

  // Auto-play every 5 seconds
  useEffect(() => {
    if (cars.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cars.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cars.length]);

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-32 bg-gray-100 rounded-3xl">
        <p className="text-3xl font-black text-gray-500">
          No cars available yet
        </p>
        <p className="text-xl text-gray-600 mt-4">
          Check back soon — new cars dropping daily!
        </p>
      </div>
    );
  }

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + cars.length) % cars.length);
  const nextSlide = () => setIndex((prev) => (prev + 1) % cars.length);

  const car = cars[index];

  return (
    <div className="relative group">
      {/* Main Image */}
      <div className="overflow-hidden rounded-3xl shadow-2xl bg-gray-900">
        <Link href={`/car/${car.id}`} className="block">
          <div className="relative aspect-[4/3] md:aspect-[16/9] bg-gray-800">
            <Image
              src={car.images[0] || "/placeholder.jpg"}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-3xl md:text-5xl font-bold text-yellow-400 drop-shadow-2xl mt-2">
                ₦{Number(car.price).toLocaleString()}
              </p>
              <p className="text-lg md:text-xl font-medium opacity-90 mt-3">
                {car.location} • {car.condition}
              </p>
            </div>

            {/* Premium Badge */}
            {car.featured_paid && (
              <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-2xl animate-pulse">
                PREMIUM
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation Arrows (show on hover) */}
      {cars.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Previous car"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            aria-label="Next car"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {cars.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {cars.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === index
                  ? "bg-green-600 w-12 h-4"
                  : "bg-gray-400 w-4 h-4 hover:bg-gray-600"
              }`}
              aria-label={`Go to car ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {cars.length > 1 && (
        <div className="absolute top-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full font-bold text-sm">
          {index + 1} / {cars.length}
        </div>
      )}
    </div>
  );
}
