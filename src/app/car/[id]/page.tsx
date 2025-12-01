// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseClient";

// Proper type – no more 'any', no more warnings
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
  dealer_name?: string | null;
  mileage?: number | null;
  transmission?: string | null;
  approved_paid?: boolean;
  approved?: boolean;
}

export default function CarDetails({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCar() {
      console.log("Fetching car ID →", params.id);

      const { data, error } = await supabaseBrowser
        .from("cars")
        .select("*")
        .eq("id", params.id)
        .eq("approved", true);

      console.log("Supabase response →", { data, error });

      // THIS LINE GUARANTEES we always exit loading state
      setCar((data && data.length > 0 ? data[0] : null) as Car | null);
      setLoading(false); // ← runs 100 % of the time
    }

    fetchCar();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-6xl font-black text-green-600 animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <h1 className="text-8xl font-black text-red-600 mb-12">
          Car Not Found
        </h1>
        <Link
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white px-20 py-10 rounded-full font-black text-4xl shadow-2xl"
        >
          Back Home
        </Link>
      </div>
    );
  }

  const phone = car.dealer_phone?.replace(/\D/g, "") ?? "";
  const whatsapp = phone ? `https://wa.me/234${phone}` : "#";

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-green-600 font-bold text-xl mb-10 inline-block"
        >
          ← Back to Cars
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

          <div className="p-12 lg:p-20 flex flex-col justify-center space-y-16">
            <div>
              <h1 className="text-6xl lg:text-8xl font-black text-green-600 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-6xl font-bold mt-8">
                ₦{Number(car.price).toLocaleString()}
              </p>
            </div>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-12 rounded-3xl font-black text-5xl shadow-2xl transition transform hover:scale-105"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
