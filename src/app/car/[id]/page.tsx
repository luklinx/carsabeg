// src/app/car/[id]/page.tsx
import Image from "next/image";
import { fetchCars } from "@/services/api";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Car } from "@/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const cars: Car[] = await fetchCars();
  return cars.map((car) => ({ id: car.id })); // no more "any"
}

export default async function CarDetail({
  params,
}: {
  params: { id: string };
}) {
  const cars: Car[] = await fetchCars();
  const car = cars.find((c) => c.id === params.id);

  if (!car)
    return (
      <div className="container mx-auto p-6 text-center text-xl">
        Car not found
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-96 md:h-full bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={car.images[0] || "/placeholder.jpg"}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-4xl font-bold text-green-600 mb-6">
            ₦{(car.price / 1000000).toFixed(1)}M
          </p>

          <div className="grid grid-cols-2 gap-4 text-lg mb-8">
            <div>
              <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
            </div>
            <div>
              <strong>Transmission:</strong> {car.transmission}
            </div>
            <div>
              <strong>Fuel:</strong> {car.fuel}
            </div>
            <div>
              <strong>Location:</strong> {car.location}
            </div>
            <div>
              <strong>Condition:</strong> {car.condition}
            </div>
          </div>

          <WhatsAppButton car={car} />
        </div>
      </div>
    </div>
  );
}
