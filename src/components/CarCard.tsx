// src/components/CarCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  console.log("CarCard received car →", car);
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* INTERNAL LINK — Click card to view car details */}
      <Link href={`/car/${car.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={car.images[0] || "/placeholder.jpg"}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {car.feature_paid && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-black text-sm shadow-lg">
              PREMIUM
            </div>
          )}
        </div>

        {/* Car Info */}
        <div className="p-5 space-y-3">
          <h3 className="font-black text-xl text-gray-900 line-clamp-1">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-3xl font-black text-green-600">
            ₦{(car.price / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{car.mileage.toLocaleString()} km</span>
            <span>•</span>
            <span>{car.location}</span>
          </div>
        </div>
      </Link>

      {/* EXTERNAL WHATSAPP BUTTON — OUTSIDE THE LINK */}
      {car.dealer_phone && (
        <div className="px-5 pb-5">
          <a
            href={`https://wa.me/${car.dealer_phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Prevents card click
            className="block text-center bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black text-lg shadow-lg transform hover:scale-105 transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
