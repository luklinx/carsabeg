// src/app/inventory/page.tsx
"use client"; // ← Must be client component because of useSearchParams

import { useSearchParams } from "next/navigation";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import CarGrid from "@/components/CarGrid";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      const serverCars = await fetchCars();
      const userCars = JSON.parse(
        localStorage.getItem("userListedCars") || "[]"
      ) as Car[];
      setCars([...serverCars, ...userCars]);
      setLoading(false);
    }
    loadCars();
  }, []);

  const make = searchParams.get("make")?.toLowerCase() || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : Infinity;

  const filtered = cars.filter((car) => {
    if (make && car.make.toLowerCase() !== make) return false;
    if (minPrice > 0 && car.price < minPrice) return false;
    if (maxPrice !== Infinity && car.price > maxPrice) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-3xl font-bold">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-black text-center mb-4">
          All Cars for Sale
        </h1>
        <p className="text-2xl text-center text-gray-700 mb-12">
          {filtered.length} {filtered.length === 1 ? "car" : "cars"} available
        </p>

        {filtered.length > 0 ? (
          <CarGrid cars={filtered} />
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-500 mb-8">
              No cars match your search
            </p>
            <Link
              href="/inventory"
              className="bg-green-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-green-700"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
