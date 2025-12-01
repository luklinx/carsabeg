// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Car } from "@/types"; // ← OFFICIAL GLOBAL TYPE — NO MORE DUPLICATES
import {
  MessageCircle,
  Phone,
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Shield,
  Zap,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import SimilarCars from "@/components/SimilarCars";

export default function CarDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  // Kill bad IDs instantly
  if (!id || id === "undefined" || id.trim() === "") notFound();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabaseBrowser
        .from("cars")
        .select("*")
        .eq("id", id)
        .eq("approved", true)
        .single();

      if (error || !data) {
        setCar(null);
      } else {
        setCar(data);
      }
      setLoading(false);
    }
    fetchCar();
  }, [id]);

  // LOADING STATE — Nigerian Power
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-green-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
            <Zap size={64} className="text-white" />
          </div>
          <p className="text-6xl md:text-8xl font-black text-green-600 mt-10 animate-pulse">
            LOADING THIS RIDE...
          </p>
          <p className="text-2xl text-gray-700 mt-6 font-bold">
            Fresh from the streets of Lagos
          </p>
        </div>
      </div>
    );
  }

  // NOT FOUND — Clean & Proud
  if (!car) {
    notFound();
  }

  const cleanPhone = car.dealer_phone?.replace(/\D/g, "") || "80022772234";
  const whatsappUrl = `https://wa.me/234${cleanPhone}`;
  const priceInMillions = (car.price / 1_000_000).toFixed(1);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
        {/* BACK BUTTON */}
        <div className="container mx-auto px-6 pt-10">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-4 text-green-600 font-black text-2xl hover:text-green-700 transition-all hover:translate-x-2"
          >
            <ArrowLeft size={40} />
            Back to All Cars
          </Link>
        </div>

        {/* MAIN CAR SECTION */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* IMAGE GALLERY */}
            <div className="space-y-6 order-1 lg:order-none">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-3xl bg-black">
                <Image
                  src={car.images[imageIndex] || "/placeholder.jpg"}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 left-6 bg-green-600 text-white px-8 py-4 rounded-full font-black text-2xl shadow-2xl z-10">
                  {car.condition === "Foreign Used"
                    ? "TOKUNBO"
                    : "NIGERIAN USED"}
                </div>
              </div>

              {/* THUMBNAILS */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                        i === imageIndex
                          ? "border-green-600 shadow-2xl scale-105"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CAR DETAILS */}
            <div className="space-y-12">
              <div>
                <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none">
                  {car.year} {car.make} {car.model}
                </h1>
                <p className="text-3xl font-bold text-gray-600 mt-4 flex items-center gap-3">
                  <MapPin size={36} />
                  {car.location}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-12 rounded-3xl shadow-3xl text-center">
                <p className="text-8xl md:text-9xl font-black">
                  ₦{priceInMillions}M
                </p>
                <p className="text-3xl font-black opacity-90 mt-4">
                  Final Price • No Hidden Fees
                </p>
              </div>

              {/* SPECS */}
              <div className="grid grid-cols-2 gap-6">
                {car.mileage && (
                  <div className="bg-gray-100 p-8 rounded-3xl flex items-center gap-5">
                    <Gauge size={48} className="text-green-600" />
                    <div>
                      <p className="text-gray-600 font-bold">Mileage</p>
                      <p className="text-2xl font-black">
                        {car.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-100 p-8 rounded-3xl flex items-center gap-5">
                    <Settings size={48} className="text-green-600" />
                    <div>
                      <p className="text-gray-600 font-bold">Transmission</p>
                      <p className="text-2xl font-black">{car.transmission}</p>
                    </div>
                  </div>
                )}
                {car.fuel && (
                  <div className="bg-gray-100 p-8 rounded-3xl flex items-center gap-5">
                    <Fuel size={48} className="text-green-600" />
                    <div>
                      <p className="text-gray-600 font-bold">Fuel Type</p>
                      <p className="text-2xl font-black">{car.fuel}</p>
                    </div>
                  </div>
                )}
                <div className="bg-gray-100 p-8 rounded-3xl flex items-center gap-5">
                  <Shield size={48} className="text-green-600" />
                  <div>
                    <p className="text-gray-600 font-bold">Status</p>
                    <p className="text-2xl font-black">Verified & Ready</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-6">
                <WhatsAppButton car={car} size="large" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-black hover:bg-gray-900 text-white py-10 rounded-3xl font-black text-4xl flex items-center justify-center gap-5 transition-all hover:scale-105"
                >
                  <Phone size={56} />
                  Call Seller Now
                </a>
              </div>

              {/* TRUST BADGES */}
              <div className="flex flex-wrap justify-center gap-8 text-green-600 font-black text-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle size={40} />
                  Real Photos
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={40} />
                  Verified Seller
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={40} />
                  Direct Contact
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        {car.description && (
          <section className="container mx-auto px-6 py-16">
            <div className="bg-white rounded-3xl p-12 shadow-3xl">
              <h2 className="text-5xl font-black mb-8 text-gray-900">
                Seller&apos;s Description
              </h2>
              <p className="text-2xl text-gray-700 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>
          </section>
        )}

        {/* SIMILAR CARS */}
        <section className="container mx-auto px-6 py-20 bg-gray-50">
          <SimilarCars currentCarId={car.id} cars={[]} />
        </section>

        {/* STICKY WHATSAPP FLOAT */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-6 rounded-full shadow-3xl z-50 transform hover:scale-110 transition-all duration-300 animate-bounce"
        >
          <MessageCircle size={56} />
        </a>
      </div>
    </>
  );
}
