// src/components/CarCarousel.tsx
"use client";
import { Car } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CarCarousel({ cars }: { cars: Car[] }) {
  const [index, setIndex] = useState(0);

  if (!cars || cars.length === 0) {
    return (
      <p className="text-center py-20 text-2xl text-gray-600">
        No cars available
      </p>
    );
  }

  const car = cars[index];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl shadow-2xl">
        <Link href={`/car/${car.id}`}>
          <div className="relative aspect-[4/3] bg-gray-200">
            <Image
              src={car.images[0] || "/placeholder.jpg"}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <h3 className="text-2xl md:text-3xl font-black text-white">
                {car.year} {car.make} {car.model}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                ₦{car.price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {cars.slice(0, 10).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-green-600 w-10" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
