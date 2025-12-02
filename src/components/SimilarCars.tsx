// src/components/SimilarCars.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Car } from "@/types";
import { ArrowRight, Zap } from "lucide-react";

interface Props {
  currentCarId: string;
}

export default function SimilarCars({ currentCarId }: Props) {
  const [currentCar, setCurrentCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current car first
        const { data: current } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("id", currentCarId)
          .eq("approved", true)
          .single();

        if (!current) {
          setLoading(false);
          return;
        }

        setCurrentCar(current);

        // Now fetch similar cars
        const { data: allCars } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("approved", true)
          .neq("id", currentCarId)
          .limit(50); // Get enough to filter smartly

        if (!allCars || allCars.length === 0) {
          setLoading(false);
          return;
        }

        // YOUR GENIUS FILTERING LOGIC — KEPT 100%
        const similar = allCars
          .filter((car) => {
            const sameMake =
              car.make.toLowerCase() === current.make.toLowerCase();
            const similarPrice =
              Math.abs(car.price - current.price) <= 5_000_000;
            const sameCondition = car.condition === current.condition;
            return sameMake || (similarPrice && sameCondition);
          })
          .sort((a, b) => {
            const aSameMake =
              a.make.toLowerCase() === current.make.toLowerCase();
            const bSameMake =
              b.make.toLowerCase() === current.make.toLowerCase();
            if (aSameMake && !bSameMake) return -1;
            if (!aSameMake && bSameMake) return 1;
            return 0;
          })
          .slice(0, 6);

        setSimilarCars(similar);
      } catch (err) {
        console.error("Similar cars fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentCarId]);

  if (loading || !currentCar || similarCars.length === 0) return null;

  return (
    <section className="mt-20 mb-10 px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-2xl font-black text-gray-900">
          Similar Cars You Might Like
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 font-bold mt-4">
          More {currentCar.make} rides • Same vibe • Ready to buy
        </p>
      </div>

      {/* MOBILE: Vertical Scroll */}
      <div className="md:hidden space-y-8">
        {similarCars.map((car, index) => (
          <div
            key={car.id}
            className="animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CarCard car={car} />
            {index === 1 && (
              <div className="my-8 text-center">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-black text-lg">
                  Hot Deals Like This One
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similarCars.map((car) => (
          <div
            key={car.id}
            className="transform transition-all duration-500 hover:-translate-y-6 hover:shadow-2xl"
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl md:text-3xl shadow-2xl transform hover:scale-110 transition-all duration-300"
        >
          View All {currentCar.make} Cars
          <ArrowRight size={36} />
        </Link>
        <p className="text-gray-600 font-bold text-lg mt-6">
          {similarCars.length}+ similar cars available right now
        </p>
      </div>
    </section>
  );
}
