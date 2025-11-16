// src/components/CarCard.tsx
import Image from "next/image";
import Link from "next/link";

interface Props {
  car: any;
}

export default function CarCard({ car }: Props) {
  const msg = `Hi! I'm interested in the ${car.year} ${car.make} ${
    car.model
  } @ ₦${(car.price / 1000000).toFixed(1)}M`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      <div className="relative h-64 bg-gray-200">
        <Image
          src={car.images[0] || "/placeholder.jpg"}
          alt={car.model}
          fill
          className="object-cover"
        />
        {car.featured && (
          <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-3xl font-bold text-green-600 my-2">
          ₦{(car.price / 1000000).toFixed(1)}M
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            {car.mileage.toLocaleString()} km • {car.transmission}
          </p>
          <p>
            {car.condition} • {car.location}
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            href={`/car/${car.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-3 rounded-lg font-semibold"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/2348123456789?text=${encodeURIComponent(msg)}`}
            target="_blank"
            className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
