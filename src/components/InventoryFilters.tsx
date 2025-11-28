// src/components/InventoryFilters.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Car } from "@/types";
import CarGrid from "./CarGrid";

interface Props {
  initialCars: Car[];
}

export default function InventoryFilters({ initialCars }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const make = searchParams.get("make")?.toLowerCase() || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : Infinity;

  const filtered = useMemo(() => {
    return initialCars.filter((car) => {
      if (make && car.make.toLowerCase() !== make) return false;
      if (minPrice > 0 && car.price < minPrice) return false;
      if (maxPrice !== Infinity && car.price > maxPrice) return false;
      return true;
    });
  }, [make, minPrice, maxPrice, initialCars]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    formData.forEach((value, key) => {
      if (value) params.set(key, value.toString());
      else params.delete(key);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* FILTER BAR */}
      <section className="py-10 bg-white border-b">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <select
              name="make"
              defaultValue={make}
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
              defaultValue={minPrice > 0 ? minPrice.toString() : ""}
              className="p-4 border-2 rounded-xl text-lg"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              defaultValue={maxPrice !== Infinity ? maxPrice.toString() : ""}
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

      {/* RESULTS */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-bold">
            {filtered.length} car{filtered.length !== 1 && "s"} found
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            All Cars for Sale
          </h2>
          {filtered.length > 0 ? (
            <CarGrid cars={filtered} />
          ) : (
            <p className="text-center text-3xl text-gray-500 py-20">
              No cars match your search.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
