// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/cars";
import type { Car } from "@/types";

export default function CarDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .eq("approved", true)
        .single();

      if (error || !data) {
        console.log("Car not found or not approved:", id, error?.message);
        setLoading(false);
        return;
      }

      setCar(data);
      setLoading(false);
    }

    if (id) loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-5xl font-black text-green-600 animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <h1 className="text-6xl font-black text-red-600 mb-8">
            Car Not Found
          </h1>
          <Link
            href="/"
            className="bg-green-600 text-white px-12 py-6 rounded-full font-black text-2xl inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // SAFE PHONE NUMBER — NO MORE UNDEFINED WARNING
  const phoneNumber = car.dealer_phone?.replace(/\D/g, "").trim();
  const whatsappLink = phoneNumber ? `https://wa.me/234${phoneNumber}` : "#";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-green-600 font-bold text-lg mb-8 inline-block hover:underline"
        >
          ← Back to Cars
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 gap-0">
          {/* Main Image */}
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={car.images[0] || "/placeholder.jpg"}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="p-8 lg:p-12 space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-green-600">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-4xl lg:text-5xl font-bold mt-4">
                ₦{Number(car.price).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <span className="font-bold text-gray-600">Condition:</span>{" "}
                <span className="block text-xl">{car.condition}</span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Location:</span>{" "}
                <span className="block text-xl">{car.location}</span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Mileage:</span>{" "}
                <span className="block text-xl">
                  {car.mileage?.toLocaleString() || "N/A"} km
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Transmission:</span>{" "}
                <span className="block text-xl">
                  {car.transmission || "N/A"}
                </span>
              </div>
            </div>

            {/* 100% SAFE WHATSAPP BUTTON */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`block text-center text-white font-black text-2xl py-6 rounded-2xl shadow-xl transition ${
                phoneNumber
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => !phoneNumber && e.preventDefault()}
            >
              {phoneNumber ? "Chat Seller on WhatsApp" : "Phone Not Available"}
            </a>

            <p className="text-center text-gray-600">
              Seller:{" "}
              <span className="font-bold">{car.dealer_name || "Unknown"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
