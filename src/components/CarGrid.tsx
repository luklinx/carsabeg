// src/components/CarGrid.tsx
import CarCard from "./CarCard";
import { Car } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  cars: Car[];
  href: string;
}

export default function CarGrid({ cars, href }: Props) {
  const displayCars = cars.slice(0, 4);
  const showViewAll = cars.length > 4;

  if (displayCars.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {displayCars.map((car) => (
          <div key={car.id} className="hover:-translate-y-3 transition-all duration-300">
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="text-center mt-12">
          <Link
            href={href}
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            View All ({cars.length - 4}+)
            <ChevronRight size={32} />
          </Link>
        </div>
      )}
    </div>
  );
}