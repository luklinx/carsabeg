// src/components/CarCard.tsx
"use client"; // ← THIS IS REQUIRED FOR showModal() & onClick

import Image from "next/image";
import Link from "next/link";
import { Car } from "@/types";
import InquiryForm from "./InquiryForm";

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  const msg = `Hi! I'm interested in the ${car.year} ${car.make} ${
    car.model
  } @ ₦${(car.price / 1000000).toFixed(1)}M`;

  // Unique modal ID
  const modalId = `inquiry-modal-${car.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-100">
        <Image
          src={car.images[0] || "/placeholder.jpg"}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
        />
        {car.featured && (
          <span className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-4xl font-bold text-green-600 my-3">
          ₦{(car.price / 1000000).toFixed(1)}M
        </p>

        <div className="text-sm text-gray-600 space-y-1 mb-5">
          <p>
            {car.mileage.toLocaleString()} km • {car.transmission}
          </p>
          <p>
            {car.condition} • {car.location}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/car/${car.id}`}
            className="bg-gray-900 text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            View Details
          </Link>

          <a
            href={`https://wa.me/2348123456789?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white text-center py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            WhatsApp
          </a>
        </div>

        {/* Make Inquiry Button */}
        <button
          onClick={() => {
            const modal = document.getElementById(modalId) as HTMLDialogElement;
            modal?.showModal();
          }}
          className="w-full mt-4 bg-blue-600 text-white py-1 py-4 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Make Inquiry
        </button>
      </div>

      {/* Inquiry Modal */}
      <dialog
        id={modalId}
        className="p-8 rounded-2xl backdrop:bg-black/50 max-w-lg w-full mx-4"
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              const modal = document.getElementById(
                modalId
              ) as HTMLDialogElement;
              modal?.close();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <InquiryForm
          car={car}
          onClose={() => {
            const modal = document.getElementById(modalId) as HTMLDialogElement;
            modal?.close();
          }}
        />
      </dialog>
    </div>
  );
}
