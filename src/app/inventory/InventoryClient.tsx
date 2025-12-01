// src/app/inventory/InventoryClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { getCars } from "@/lib/cars";
import { Car } from "@/types";
import { X, Zap, Car as CarIcon } from "lucide-react";

export default function InventoryClient() {
  const searchParams = useSearchParams();
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH CARS ONCE
  useEffect(() => {
    async function loadCars() {
      try {
        const cars = await getCars();
        setAllCars(cars || []);
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCars();
  }, []);

  // FILTER LOGIC — REAL-TIME, NO RELOADS
  const filteredCars = useMemo(() => {
    if (!allCars.length) return [];

    let result = [...allCars];

    const make = searchParams.get("make")?.toLowerCase();
    const condition = searchParams.get("condition");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (make) {
      result = result.filter((c) => c.make.toLowerCase().includes(make));
    }

    if (condition) {
      result = result.filter((c) => c.condition === condition);
    }

    if (
      location &&
      (result = result.filter((c) =>
        c.location?.toLowerCase().includes(location.toLowerCase())
      ))
    )
      if (minPrice) {
        result = result.filter((c) => c.price >= Number(minPrice));
      }

    if (maxPrice) {
      result = result.filter((c) => c.price <= Number(maxPrice));
    }

    return result;
  }, [allCars, searchParams]);

  const hasActiveFilters = searchParams.toString().length > 0;

  // LOADING STATE — Nigerian Energy
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <CarIcon
            size={80}
            className="mx-auto text-green-600 animate-bounce"
          />
          <p className="text-5xl md:text-7xl font-black text-green-600 mt-8 animate-pulse">
            LOADING FRESH CARS...
          </p>
          <p className="text-2xl text-gray-700 mt-6 font-bold">
            {allCars.length > 0
              ? "Applying filters..."
              : "Fetching latest deals..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO HEADER */}
      <section className="bg-gradient-to-b from-green-600 to-emerald-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-9xl font-black mb-6 leading-none">
            ALL CARS IN STOCK
          </h1>
          <p className="text-3xl md:text-5xl font-black opacity-90">
            {filteredCars.length} Fresh{" "}
            {filteredCars.length === 1 ? "Car" : "Cars"} Available Now
          </p>
          {hasActiveFilters && (
            <a
              href="/inventory"
              className="inline-flex items-center gap-3 mt-8 bg-white text-green-600 px-10 py-5 rounded-full font-black text-2xl shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition"
            >
              <X size={32} />
              Clear All Filters
            </a>
          )}
        </div>
      </section>

      {/* RESULTS COUNT + FILTER BADGES */}
      <section className="bg-white border-b-4 border-green-600 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Zap className="text-yellow-500 animate-pulse" size={36} />
              <p className="text-3xl font-black text-gray-900">
                {filteredCars.length}{" "}
                {filteredCars.length === 1 ? "Car" : "Cars"} Found
              </p>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-3">
                {Array.from(searchParams.entries()).map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-green-100 text-green-800 px-5 py-3 rounded-full font-black text-lg flex items-center gap-2"
                  >
                    {key === "condition" &&
                      (value === "Foreign Used" ? "Tokunbo" : "Nigerian Used")}
                    {key === "make" && value}
                    {key === "location" && value}
                    {key === "minPrice" &&
                      `Min ₦${(Number(value) / 1e6).toFixed(1)}M`}
                    {key === "maxPrice" &&
                      `Max ₦${(Number(value) / 1e6).toFixed(1)}M`}
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete(key);
                        window.history.pushState({}, "", `?${newParams}`);
                      }}
                      className="ml-2 hover:bg-green-200 rounded-full p-1"
                    >
                      <X size={18} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CAR GRID */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-2xl">
              <CarIcon size={100} className="mx-auto text-gray-300 mb-8" />
              <p className="text-5xl font-black text-gray-400 mb-8">
                No cars match your search
              </p>
              <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Try removing some filters — new cars are added every hour!
              </p>
              <a
                href="/inventory"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-16 py-8 rounded-full font-black text-3xl shadow-2xl transform hover:scale-110 transition"
              >
                Show All Cars
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {filteredCars.map((car, index) => (
                <div
                  key={car.id}
                  className="animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}
      {filteredCars.length > 0 && (
        <section className="py-20 bg-green-600 text-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Can’t Find Your Dream Car?
            </h2>
            <p className="text-2xl md:text-3xl font-bold mb-12 max-w-4xl mx-auto">
              Tell us what you want — we’ll find it and deliver in 48 hours
            </p>
            <a
              href="https://wa.me/23480022772234?text=Hi%20CarsAbeg!%20I%20couldn%27t%20find%20my%20dream%20car.%20Can%20you%20help%20me%20source%20it%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-black text-3xl md:text-4xl px-16 py-8 rounded-full shadow-2xl transform hover:scale-110 transition"
            >
              REQUEST ANY CAR
            </a>
          </div>
        </section>
      )}
    </>
  );
}
