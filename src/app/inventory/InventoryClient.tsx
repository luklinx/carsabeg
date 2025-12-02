"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { getCars } from "@/lib/cars";
import { Car } from "@/types";
import { X, Car as CarIcon } from "lucide-react";

export default function InventoryClient() {
  const searchParams = useSearchParams();
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      try {
        const cars = await getCars();
        // FINAL FIX: REMOVE ANY CAR WITHOUT ID
        const safeCars = (cars || []).filter((car): car is Car => !!car?.id);
        setAllCars(safeCars);
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    if (!allCars.length) return [];

    let result = [...allCars];

    const make = searchParams.get("make")?.toLowerCase();
    const condition = searchParams.get("condition");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (make)
      result = result.filter((c) => c.make.toLowerCase().includes(make));
    if (condition) result = result.filter((c) => c.condition === condition);
    if (location)
      result = result.filter((c) =>
        c.location?.toLowerCase().includes(location.toLowerCase())
      );
    if (minPrice) result = result.filter((c) => c.price >= Number(minPrice));
    if (maxPrice) result = result.filter((c) => c.price <= Number(maxPrice));

    return result;
  }, [allCars, searchParams]);

  const hasActiveFilters = searchParams.toString().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <CarIcon
            size={80}
            className="mx-auto text-green-600 animate-bounce"
          />
          <p className="text-3xl md:text-2xl font-black text-green-600 mt-8 animate-pulse">
            LOADING FRESH CARS...
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
          <h1 className="text-3xl md:text-3xl font-black mb-6 leading-none">
            ALL CARS IN STOCK
          </h1>
          <p className="text-3xl md:text-3xl font-black opacity-90">
            {filteredCars.length} Fresh{" "}
            {filteredCars.length === 1 ? "Car" : "Cars"} Available
          </p>
          {hasActiveFilters && (
            <a
              href="/inventory"
              className="inline-flex items-center gap-3 mt-8 bg-white text-green-600 px-10 py-5 rounded-full font-black text-2xl shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition"
            >
              <X size={32} /> Clear All Filters
            </a>
          )}
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl shadow-2xl">
              <p className="text-3xl font-black text-gray-400 mb-8">
                No cars match your search
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
    </>
  );
}
