// src/app/car/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
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

// CRITICAL: params is now a PROMISE in Next.js 16
export default async function CarDetails({
  params,
}: {
  params: Promise<{ id: string }>; // ← PROMISE!
}) {
  const { id } = await params; // ← AWAIT IT! THIS IS THE FIX

  // Validate ID
  if (!id || id === "undefined" || id.trim() === "" || id.length < 10) {
    console.log("Invalid ID received:", id);
    notFound();
  }

  const { data: car, error } = await supabaseServer
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("approved", true) // ← always check approved
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    notFound();
  }

  if (!car) {
    console.log("Car not found or not approved → ID:", id);
    notFound();
  }

  // SAFE DATA
  const cleanPhone = car.dealer_phone
    ? car.dealer_phone.replace(/\D/g, "").replace(/^0/, "234")
    : "2348022772234";
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const priceInMillions = (car.price / 1_000_000).toFixed(1);
  const images: string[] = car.images?.length
    ? car.images
    : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 pb-24">
      {/* BACK BUTTON */}
      <div className="container mx-auto px-4 pt-8 md:px-6">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-3 text-green-600 font-bold text-lg hover:text-green-700 transition-all"
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
                src={images[0]}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 bg-green-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-xl">
                {car.condition === "Foreign Used" ? "TOKUNBO" : car.condition}
              </div>
              {car.featured_paid && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-5 py-3 rounded-full font-black flex items-center gap-2">
                  <Zap size={20} /> PREMIUM
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border-4 border-gray-300 transition-all hover:border-green-600 hover:scale-105 cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CAR DETAILS */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-xl font-semibold text-gray-600 mt-3 flex items-center gap-3">
                <MapPin size={32} /> {car.location}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl text-center">
              <p className="text-5xl md:text-6xl font-black">
                ₦{priceInMillions}M
              </p>
              <p className="text-xl font-bold mt-4">
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
                    <p className="text-gray-600 font-semibold">Transmission</p>
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
        <section className="container mx-auto px-4 md:px-6 py-16 bg-white rounded-3xl shadow-xl">
          <h2 className="text-4xl font-black mb-6">Description</h2>
          <p className="text-xl text-gray-700 whitespace-pre-line leading-relaxed">
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
        className="fixed bottom-6 right-6 bg-green-600 text-white p-6 rounded-full shadow-2xl z-50 hover:scale-110 transition-all animate-bounce"
      >
        <MessageCircle size={36} />
      </Link>
    </div>
  );
}
