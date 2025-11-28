// src/app/inventory/InventoryClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CarGrid from "@/components/CarGrid";
import Link from "next/link";
import { Car } from "@/types";

interface Props {
  initialCars: Car[];
}

export default function InventoryClient({ initialCars }: Props) {
  const searchParams = useSearchParams();

  const make = searchParams.get("make")?.toLowerCase() || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : Infinity;

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      if (make && car.make.toLowerCase() !== make) return false;
      if (minPrice && car.price < minPrice) return false;
      if (maxPrice && car.price > maxPrice) return false;
      return true;
    });
  }, [initialCars, make, minPrice, maxPrice]);

  return (
    <>
      {/* Filter Bar */}
      <section className="py-12 bg-white border-b sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-6">
          <form className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <select
              name="make"
              defaultValue={make || ""}
              className="p-4 border-2 rounded-xl text-lg font-medium"
            >
              <option value="">All Makes</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="mercedes-benz">Mercedes-Benz</option>
              <option value="lexus">Lexus</option>
            </select>
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₦)"
              defaultValue={minPrice || ""}
              className="p-4 border-2 rounded-xl text-lg"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              defaultValue={maxPrice < Infinity ? maxPrice : ""}
              className="p-4 border-2 rounded-xl text-lg"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-xl transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-3xl font-black text-gray-900">
            {filteredCars.length} car{filteredCars.length !== 1 && "s"}{" "}
            available
          </p>
        </div>
      </section>

      {/* Car Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {filteredCars.length > 0 ? (
            <CarGrid cars={filteredCars} />
          ) : (
            <div className="text-center py-32">
              <p className="text-4xl font-bold text-gray-500 mb-8">
                No cars match your search
              </p>
              <Link
                href="/inventory"
                className="bg-green-600 text-white px-12 py-5 rounded-full text-2xl font-bold hover:bg-green-700 transition"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
