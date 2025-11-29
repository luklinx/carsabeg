// src/app/inventory/InventoryClient.tsx
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CarCard from "@/components/CarCard";
import { getCars } from "@/lib/cars";
// import { Car } from "@/types";

export default function InventoryClient() {
  const searchParams = useSearchParams();
  const allCars = getCars();

  // REPLACE useEffect + useState WITH useMemo → ZERO WARNINGS
  const cars = useMemo(() => {
    let filtered = [...allCars];

    const condition = searchParams.get("condition");
    const location = searchParams.get("location");
    const maxPrice = searchParams.get("maxPrice");

    if (condition) {
      filtered = filtered.filter((c) => c.condition === condition);
    }
    if (location) {
      filtered = filtered.filter((c) => c.location === location);
    }
    if (maxPrice) {
      filtered = filtered.filter((c) => c.price <= Number(maxPrice));
    }

    return filtered;
  }, [allCars, searchParams]); // Re-run only when searchParams change

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-7xl font-black text-center mb-4 text-green-600">
        ALL CARS IN STOCK
      </h1>
      <p className="text-center text-2xl font-bold text-gray-700 mb-12">
        {cars.length} car{cars.length !== 1 ? "s" : ""} found
      </p>

      {cars.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-4xl font-black text-gray-400 mb-6">
            No cars match your filter
          </p>
          <Link
            href="/inventory"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black text-xl shadow-lg transform hover:scale-105 transition"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
