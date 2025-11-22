// src/components/CarGrid.tsx
"use client"; // ← THIS IS THE KEY

import CarCard from "./CarCard";
import { Car } from "@/types";

interface Props {
  cars: Car[];
}

export default function CarGrid({ cars }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cars.length > 0 ? (
        cars.map((car) => <CarCard key={car.id} car={car} />)
      ) : (
        <p className="text-center col-span-full text-gray-600">
          No cars match your filter.
        </p>
      )}
    </div>
  );
}
