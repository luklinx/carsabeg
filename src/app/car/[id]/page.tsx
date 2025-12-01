// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseClient";

// Minimal type — no more 'any' warnings
interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  condition: string;
  location: string;
  images: string[];
  dealer_phone?: string;
  dealer_name?: string;
  mileage?: number;
  transmission?: string;
  description?: string;
  featured_paid?: boolean;
}

export default function CarDetails({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCar() {
      const { data, error } = await supabaseBrowser
        .from("cars")
        .select("*")
        .eq("id", params.id)
        .eq("approved", true);

      console.log("Supabase response:", { data, error });

      if (data && data.length > 0) {
        setCar(data[0] as Car);
      } else {
        setCar(null);
      }
      setLoading(false);
    }

    if (params.id) {
      loadCar();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-6xl font-black text-green-600 animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-6">
        <h1 className="text-7xl font-black text-red-600 mb-8">Car Not Found</h1>
        <Link
          href="/"
          className="bg-green-600 text-white px-16 py-8 rounded-full font-black text-3xl inline-block hover:bg-green-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const cleanPhone = car.dealer_phone?.replace(/\D/g, "") ?? "";
  const whatsappLink = cleanPhone ? `https://wa.me/234${cleanPhone}` : "#";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-green-600 font-bold text-xl mb-10 inline-block hover:underline"
        >
          Back to Cars
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="relative aspect-square lg:aspect-auto">
            <Image
              src={car.images[0] || "/placeholder.jpg"}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-10 lg:p-16 flex flex-col justify-center space-y-12">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black text-green-600 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-5xl lg:text-6xl font-bold mt-6">
                ₦{car.price.toLocaleString()}
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-10 rounded-3xl font-black text-4xl shadow-2xl transition transform hover:scale-105"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
