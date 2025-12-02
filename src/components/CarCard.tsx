// src/components/CarCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  // DEBUG — You can remove later when everything works
  console.log("CarCard received →", {
    id: car.id,
    make: car.make,
    model: car.model,
    images: car.images?.length,
    phone: car.dealer_phone,
  });

  // SAFETY FIRST — BLOCK CARS WITH NO ID (THE REAL KILLER)
  if (!car?.id) {
    console.error("CAR HAS NO ID → WILL CAUSE 404", car);
    return (
      <div className="bg-red-900 text-white p-10 rounded-2xl text-center font-black text-2xl">
        ERROR: NO CAR ID
      </div>
    );
  }

  // Fix Nigerian phone: 080x → 23480x
  const cleanPhone = car.dealer_phone
    ? car.dealer_phone.replace(/\D/g, "").replace(/^0/, "234")
    : null;

  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  // Safe image
  const mainImage =
    car.images && car.images.length > 0 ? car.images[0] : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* ONLY CREATE LINK IF car.id IS VALID — THIS IS THE FINAL FIX */}
      <Link href={`/car/${car.id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={mainImage}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
          {car.featured_paid && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-black text-sm shadow-lg">
              PREMIUM
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-black text-xl text-gray-900 line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-3xl font-black text-green-600">
            ₦{(car.price / 1_000_000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{car.mileage?.toLocaleString() || "N/A"} km</span>
            <span>•</span>
            <span>{car.location || "Lagos"}</span>
          </div>
        </div>
      </Link>

      {/* WHATSAPP BUTTON */}
      <div className="px-5 pb-5">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block text-center bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black text-lg shadow-lg transform hover:scale-105 transition"
          >
            Chat on WhatsApp
          </a>
        ) : (
          <button
            disabled
            className="block w-full text-center bg-gray-400 text-white py-4 rounded-xl font-black text-lg opacity-60 cursor-not-allowed"
          >
            No Phone Number
          </button>
        )}
      </div>
    </div>
  );
}
