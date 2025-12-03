// src/components/CarCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  if (!car?.id) {
    console.error("CAR HAS NO ID → WILL CAUSE 404", car);
    return (
      <div className="bg-red-900 text-white p-10 rounded-2xl text-center font-black text-2xl">
        ERROR: NO CAR ID
      </div>
    );
  }

  const cleanPhone = car.dealer_phone
    ? car.dealer_phone.replace(/\D/g, "").replace(/^0/, "234")
    : null;
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const mainImage =
    car.images && car.images.length > 0 ? car.images[0] : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <Link href={`/car/${car.id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {car.featured_paid && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full font-black text-xs shadow-lg uppercase tracking-wider">
              Premium
            </div>
          )}
        </div>

        <div className="p-5 space-y-2">
          <h3 className="font-black text-lg text-gray-900 line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-2xl font-black text-green-600">
            ₦{(car.price / 1_000_000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <span>{car.mileage?.toLocaleString() || "N/A"} km</span>
            <span className="text-gray-400">•</span>
            <span>{car.location || "Lagos"}</span>
          </div>
        </div>
      </Link>

      {/* WHATSAPP BUTTON — 50% SLIMMER, 1000% CLASSIER */}
      <div className="px-5 pb-5">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-2xl font-black text-base shadow-md hover:shadow-lg transform hover:scale-[1.03] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.263c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            Chat on WhatsApp
          </a>
        ) : (
          <button
            disabled
            className="w-full text-center bg-gray-300 text-gray-600 py-3.5 rounded-2xl font-bold text-base cursor-not-allowed"
          >
            No Number
          </button>
        )}
      </div>
    </div>
  );
}
