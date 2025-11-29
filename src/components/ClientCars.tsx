// src/components/ClientCars.tsx
"use client";

import { useEffect, useState } from "react";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import { Car } from "@/types";

export default function ClientCars() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [paidFeatured, setPaidFeatured] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      setAllCars(getCars());
      setPaidFeatured(getPaidFeaturedCars());
      setLoading(false);
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="text-4xl font-black text-green-600 animate-pulse">
          LOADING PREMIUM CARS...
        </div>
      </div>
    );
  }

  const latestCars = allCars.slice(0, 12);

  return (
    <>
      {/* ONLY PAID CARS IN FEATURED */}
      {paidFeatured.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-b from-yellow-50 to-white">
          <h2 className="text-3xl font-black text-center mb-4 text-gray-800">
            Featured Cars
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            Only ₦50,000 paid listings appear here
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {paidFeatured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Arrivals (paid + free) */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-black text-center mb-12 text-gray-800">
          Latest Arrivals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {latestCars.length > 0 ? (
            latestCars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p className="col-span-full text-center text-3xl font-black text-gray-400 py-20">
              No cars yet — be the first!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
