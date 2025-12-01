// src/components/SimilarCars.tsx
import Link from "next/link";
import CarCard from "./CarCard";
import { Car } from "@/types";
import { ArrowRight, Zap } from "lucide-react";

interface Props {
  currentCarId: string;
  cars: Car[];
}

export default function SimilarCars({ currentCarId, cars }: Props) {
  // Find current car to get make/model/year for smarter matching
  const currentCar = cars.find((c) => c.id === currentCarId);
  if (!currentCar) return null;

  // Smart similar cars: same make → then similar price → then condition
  const similar = cars
    .filter((car) => {
      if (car.id === currentCarId) return false;
      const sameMake = car.make.toLowerCase() === currentCar.make.toLowerCase();
      const similarPrice = Math.abs(car.price - currentCar.price) <= 5_000_000; // within ~₦5M
      const sameCondition = car.condition === currentCar.condition;

      return sameMake || (similarPrice && sameCondition);
    })
    .sort((a, b) => {
      // Prioritize same make
      if (
        a.make.toLowerCase() === currentCar.make.toLowerCase() &&
        b.make.toLowerCase() !== currentCar.make.toLowerCase()
      )
        return -1;
      if (
        b.make.toLowerCase() === currentCar.make.toLowerCase() &&
        a.make.toLowerCase() !== currentCar.make.toLowerCase()
      )
        return 1;
      return 0;
    })
    .slice(0, 6); // Show more on mobile

  if (similar.length === 0) return null;

  return (
    <section className="mt-20 mb-10 px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-7xl font-black text-gray-900">
          Similar Cars You Might Like
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 font-bold mt-4">
          More {currentCar.make} rides • Same vibe • Ready to buy
        </p>
      </div>

      {/* MOBILE: Vertical Scroll Carousel */}
      <div className="md:hidden space-y-8">
        {similar.map((car, index) => (
          <div
            key={car.id}
            className="animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CarCard car={car} />
            {index === 1 && (
              <div className="my-8 text-center">
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full font-black text-lg">
                  <Zap size={24} className="animate-pulse" />
                  Hot Deals Like This One
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP: 3-Column Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similar.map((car) => (
          <div
            key={car.id}
            className="transform transition-all duration-500 hover:-translate-y-6 hover:shadow-2xl"
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="text-center mt-16">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl md:text-3xl shadow-2xl transform hover:scale-110 transition-all duration-300"
        >
          View All {currentCar.make} Cars
          <ArrowRight size={36} />
        </Link>

        <p className="text-gray-600 font-bold text-lg mt-6">
          {similar.length}+ similar cars available right now
        </p>
      </div>
    </section>
  );
}
