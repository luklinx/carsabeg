// src/components/CarCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types"; // ← This kills the "any" forever

interface Props {
  car: Car; // ← Now using the real Car type
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
          alt={`${car.make} ${car.model}`}
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
            className="flex-1 bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            View Details
          </Link>
          <a
            href={`https://wa.me/2348123456789?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.5-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.088" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
