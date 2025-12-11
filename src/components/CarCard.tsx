// src/components/CarCard.tsx
"use client";

import { Car } from "@/types";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarCard({ car }: { car: Car }) {
  const [imageIndex, setImageIndex] = useState(0);

  const handleImageSwipe = (delta: number) => {
    setImageIndex((prev) => {
      let newIndex = prev + delta;
      if (newIndex < 0) newIndex = car.images.length - 1;
      if (newIndex > car.images.length - 1) newIndex = 0;
      return newIndex;
    });
  };

  const hasMultipleImages = car.images.length > 1;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-green-600 transition-all duration-300">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={car.images[imageIndex] || "/placeholder.jpg"}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Image Swipe Controls (No Arrows — Manual Swipe) */}
        {hasMultipleImages && (
          <>
            <button
              onClick={() => handleImageSwipe(-1)}
              className="absolute left-0 top-0 bottom-0 w-1/2 opacity-0 hover:opacity-100 transition"
            />
            <button
              onClick={() => handleImageSwipe(1)}
              className="absolute right-0 top-0 bottom-0 w-1/2 opacity-0 hover:opacity-100 transition"
            />
          </>
        )}

        {/* Dot Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {car.images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === imageIndex ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Featured Badge */}
        {car.featured_paid && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm shadow-xl">
            PREMIUM
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6 md:p-8 space-y-2">
        <h3 className="text-2xl md:text-3xl font-black truncate">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-2xl md:text-3xl font-black text-green-600">
          ₦{(car.price / 1_000_000).toFixed(1)}M
        </p>
        <p className="text-gray-600 text-base md:text-lg font-medium">
          {car.location} • {car.condition}
        </p>
        <Link
          href={`/car/${car.id}`}
          className="block mt-4 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black text-center text-xl transition-all hover:shadow-green-500/25"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
