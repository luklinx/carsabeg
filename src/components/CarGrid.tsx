// src/components/CarGrid.tsx
"use client";

import CarCard from "./CarCard";
import { Car } from "@/types";

interface Props {
  cars: Car[];
  title?: string;
  subtitle?: string;
}

export default function CarGrid({ cars, title, subtitle }: Props) {
  if (cars.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <svg
            className="w-w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-3xl font-black text-gray-700 mb-3">
          No cars found
        </h3>
        <p className="text-xl text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or check back later — new cars drop every
          minute!
        </p>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12">
      {/* Optional Section Title — Dubizzle Style */}
      {(title || subtitle) && (
        <div className="text-center mb-10 md:mb-16 px-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 mt-4 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* DUBIZZLE-LEVEL GRID — Ultra Clean, Ultra Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4 md:px-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="transform transition-all duration-300 hover:-translate-y-3"
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* Load More Hint (optional future use) */}
      {cars.length > 12 && (
        <div className="text-center mt-16">
          <button className="bg-white border-2 border-gray-300 hover:border-green-600 text-gray-800 hover:text-green-600 font-black text-lg px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
            LOAD MORE CARS
          </button>
        </div>
      )}
    </section>
  );
}
