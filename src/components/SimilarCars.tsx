// src/components/SimilarCars.tsx
import CarCard from "./CarCard";
import { Car } from "@/types";

interface Props {
  currentCarId: string;
  cars: Car[];
}

export default function SimilarCars({ currentCarId, cars }: Props) {
  const similar = cars
    .filter(
      (car) =>
        car.id !== currentCarId &&
        car.make === cars.find((c) => c.id === currentCarId)?.make
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-gray-800/70">Similar Cars</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similar.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
