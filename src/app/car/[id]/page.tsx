// src/app/car/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Car } from "@/types";
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
  Car as CarIcon,
} from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import SimilarCars from "@/components/SimilarCars";

export default function CarDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  // Instant kill invalid IDs
  if (!id || id === "undefined" || id.trim() === "") {
    notFound();
  }

  useEffect(() => {
    async function fetchCar() {
      try {
        console.log("Fetching car with ID:", id); // DEBUG

        const { data, error } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("id", id)
          // REMOVE THIS LINE IN DEV → .eq("approved", true)
          // UNCOMMENT IN PRODUCTION ONLY WHEN READY
          // .eq("approved", true)
          .maybeSingle();

        console.log("Supabase response:", { data, error }); // DEBUG

        if (error && error.code !== "PGRST116") {
          console.error("Supabase error:", error);
        }

        if (!data) {
          console.log("Car not found or not approved yet");
          notFound();
        }

        console.log("Car loaded successfully:", data);
        setCar(data);
      } catch (err) {
        console.error("Fetch failed completely:", err);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [id]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-green-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
            <Zap size={64} className="text-white" />
          </div>
          <p className="text-5xl md:text-7xl font-black text-green-600 mt-10 animate-pulse">
            LOADING THIS RIDE...
          </p>
          <p className="text-2xl text-gray-700 mt-6 font-bold">
            Fresh from Lagos
          </p>
        </div>
      </div>
    );
  }

  // FINAL SAFETY NET — if car is null after loading
  if (!car) {
    console.log("Final check: car is null → 404");
    notFound();
  }

  const cleanPhone =
    car.dealer_phone?.replace(/\D/g, "").replace(/^0/, "") || "8022772234";
  const whatsappUrl = `https://wa.me/234${cleanPhone}`;
  const priceInMillions = (car.price / 1_000_000).toFixed(1);
  const images = car.images?.length ? car.images : ["/placeholder.jpg"];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 pb-24">
        {/* BACK BUTTON */}
        <div className="container mx-auto px-4 pt-8 md:px-6">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-3 text-green-600 font-bold text-lg hover:text-green-700"
          >
            <ArrowLeft size={28} /> Back to Inventory
          </Link>
        </div>

        {/* MAIN GRID */}
        <section className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* IMAGE GALLERY */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={images[imageIndex]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4 bg-green-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-xl">
                  {car.condition === "Foreign Used"
                    ? "TOKUNBO"
                    : "NIGERIAN USED"}
                </div>
                {car.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-5 py-3 rounded-full font-black flex items-center gap-2">
                    <Zap size={20} /> FEATURED
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                        i === imageIndex
                          ? "border-green-600 shadow-xl scale-105"
                          : "border-gray-300"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                  {car.year} {car.make} {car.model}
                </h1>
                <p className="text-2xl font-semibold text-gray-600 mt-3 flex items-center gap-3">
                  <MapPin size={32} /> {car.location}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl text-center">
                <p className="text-6xl md:text-8xl font-black">
                  ₦{priceInMillions}M
                </p>
                <p className="text-xl md:text-2xl font-bold mt-4">
                  Final Price • No Hidden Fees
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {car.mileage > 0 && (
                  <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                    <Gauge className="text-green-600" size={40} />
                    <div>
                      <p className="text-gray-600 font-semibold">Mileage</p>
                      <p className="text-xl font-bold">
                        {car.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                    <Settings className="text-green-600" size={40} />
                    <div>
                      <p className="text-gray-600 font-semibold">
                        Transmission
                      </p>
                      <p className="text-xl font-bold">{car.transmission}</p>
                    </div>
                  </div>
                )}
                {car.fuel && (
                  <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                    <Fuel className="text-green-600" size={40} />
                    <div>
                      <p className="text-gray-600 font-semibold">Fuel</p>
                      <p className="text-xl font-bold">{car.fuel}</p>
                    </div>
                  </div>
                )}
                <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                  <CarIcon className="text-green-600" size={40} />
                  <div>
                    <p className="text-gray-600 font-semibold">Condition</p>
                    <p className="text-xl font-bold">{car.condition}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <WhatsAppButton car={car} size="large" />
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-black hover:bg-gray-900 text-white py-8 rounded-3xl font-black text-3xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-xl"
                >
                  <Phone size={48} /> Call Seller
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-green-700 font-bold text-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={32} /> Real Photos
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={32} /> Verified
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={32} /> Direct Chat Now
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        {car.description && (
          <section className="container mx-auto px-4 md:px-6 py-16 bg-white">
            <h2 className="text-4xl font-black mb-6">Description</h2>
            <p className="text-xl text-gray-700 whitespace-pre-line">
              {car.description}
            </p>
          </section>
        )}

        <SimilarCars currentCarId={car.id} />

        {/* FLOATING WHATSAPP */}
        <Link
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-5 rounded-full shadow-2xl z-50 transition-all hover:scale-110 animate-bounce"
        >
          <MessageCircle size={48} />
        </Link>
      </div>
    </>
  );
}
