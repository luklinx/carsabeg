// src/app/car/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";
import { supabase } from "@/lib/cars";
import type { Car } from "@/types";

interface Props {
  params: { id: string };
}

export default function CarDetailPage({ params }: Props) {
  const { id } = params;

  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadCar() {
      // Fetch the main car
      const { data: carData, error: carError } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .eq("approved", true)
        .single();

      if (carError || !carData) {
        notFound();
      }

      setCar(carData as Car);

      // Fetch all approved cars for similar recommendations
      const { data: allCars } = await supabase
        .from("cars")
        .select("*")
        .eq("approved", true);

      if (!allCars) {
        setLoading(false);
        return;
      }

      const otherCars = allCars.filter((c: Car) => c.id !== id);

      let matches: Car[] = [];
      let heading = "";

      // 1. Same make + location
      matches = otherCars.filter(
        (c: Car) =>
          c.make.toLowerCase() === carData.make.toLowerCase() &&
          c.location === carData.location
      );
      heading = `More ${carData.make} in ${carData.location}`;

      // 2. Same make only
      if (matches.length === 0) {
        matches = otherCars.filter(
          (c: Car) => c.make.toLowerCase() === carData.make.toLowerCase()
        );
        heading = `More ${carData.make} in Nigeria`;
      }

      // 3. Same location only
      if (matches.length === 0) {
        matches = otherCars.filter((c: Car) => c.location === carData.location);
        heading = `More Cars in ${carData.location}`;
      }

      // 4. Premium nationwide
      if (matches.length === 0) {
        matches = otherCars
          .filter((c: Car) => c.feature_paid)
          .sort((a: Car, b: Car) => b.price - a.price);
        heading = "Premium Listings Across Nigeria";
      }

      // Final: sort by price desc, take top 6
      const finalSimilar = matches
        .sort((a: Car, b: Car) => b.price - a.price)
        .slice(0, 6);

      setSimilarCars(finalSimilar);
      setLoading(false);
    }

    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-5xl font-black text-green-600 animate-pulse">
          LOADING CAR...
        </div>
      </div>
    );
  }

  if (!car) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold text-lg transition"
        >
          ← Back to all cars
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* IMAGE GALLERY */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden bg-black shadow-2xl">
              <Image
                src={car.images[selectedImage] || "/placeholder.jpg"}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
                {selectedImage + 1} / {car.images.length}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                    selectedImage === i
                      ? "border-green-600 shadow-xl scale-110 ring-4 ring-green-600/30"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS + CONTACT */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-3xl md:text-6xl font-black text-green-600 mt-4">
                ₦{(car.price / 1000000).toFixed(1)}M
              </p>
            </div>

            {car.feature_paid && (
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-xl">
                PREMIUM LISTING
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow">
              <div>
                <p className="text-gray-600 font-bold uppercase text-sm">
                  Condition
                </p>
                <p className="font-black text-2xl">{car.condition}</p>
              </div>
              <div>
                <p className="text-gray-600 font-bold uppercase text-sm">
                  Mileage
                </p>
                <p className="font-black text-2xl">
                  {car.mileage.toLocaleString()} km
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-bold uppercase text-sm">
                  Location
                </p>
                <p className="font-black text-2xl">{car.location}</p>
              </div>
              <div>
                <p className="text-gray-600 font-bold uppercase text-sm">
                  Seller
                </p>
                <p className="font-black text-2xl">
                  {car.dealer_name || "Private"}
                </p>
              </div>
            </div>

            {car.description && (
              <div className="bg-white p-8 rounded-2xl shadow">
                <h3 className="font-black text-2xl mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            {car.dealer_phone && (
              <div className="space-y-4">
                <Link
                  href={`https://wa.me/${car.dealer_phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-black text-2xl shadow-2xl transform hover:scale-105 transition"
                >
                  Chat on WhatsApp
                </Link>
                <Link
                  href={`tel:${car.dealer_phone}`}
                  className="block text-center bg-gray-800 hover:bg-black text-white py-6 rounded-2xl font-black text-2xl shadow-2xl"
                >
                  Call Seller
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* SIMILAR CARS */}
        {similarCars.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black text-gray-900">
                {`More ${car.make} in ${car.location}`.includes("More")
                  ? `More ${car.make} in ${car.location}`
                  : similarCars.length > 0
                  ? `More ${car.make} in ${car.location}`
                  : "Premium Listings Across Nigeria"}
              </h2>
              <Link
                href="/inventory"
                className="text-green-600 hover:text-green-700 font-black text-lg underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {similarCars.map((similarCar) => (
                <CarCard key={similarCar.id} car={similarCar} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
