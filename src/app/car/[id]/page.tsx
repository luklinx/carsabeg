// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation"; // ← THIS IS THE KEY
import { supabaseBrowser } from "@/lib/supabaseClient";

interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  condition: string;
  location: string;
  images: string[];
  dealer_phone?: string | null;
}

export default function CarDetails({ params }: { params: { id?: string } }) {
  const id = params.id;

  // THIS LINE KILLS "undefined" FOREVER
  if (!id || id === "undefined" || id.trim() === "") {
    notFound();
  }

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabaseBrowser
        .from("cars")
        .select("*")
        .eq("id", id)
        .eq("approved", true);

      console.log("Supabase →", { data, error, id });

      setCar(data && data.length > 0 ? data[0] : null);
      setLoading(false);
    }

    fetchCar();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-6xl font-black text-green-600">
        LOADING...
      </div>
    );

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h1 className="text-8xl font-black text-red-600 mb-10">
          Car Not Found
        </h1>
        <Link
          href="/"
          className="bg-green-600 text-white px-20 py-10 rounded-full text-4xl font-black"
        >
          Back Home
        </Link>
      </div>
    );
  }

  const phone = car.dealer_phone?.replace(/\D/g, "") ?? "";
  const wa = phone ? `https://wa.me/234${phone}` : "#";

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-green-600 font-bold text-xl mb-10 inline-block"
        >
          ← Back
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="relative aspect-square">
            <Image
              src={car.images[0]}
              alt="car"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-16 flex flex-col justify-center space-y-16">
            <h1 className="text-7xl lg:text-9xl font-black text-green-600">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-6xl font-bold">
              ₦{Number(car.price).toLocaleString()}
            </p>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-12 rounded-3xl font-black text-5xl"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
