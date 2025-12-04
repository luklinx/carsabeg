// src/app/car/[id]/page.tsx
// SERVER COMPONENT — PERFECT NEXT.JS 16 WAY

import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import {
  MessageCircle,
  Phone,
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Shield,
  ArrowLeft,
  CheckCircle,
  Car as CarIcon,
  Briefcase,
} from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import SimilarCars from "@/components/SimilarCars";
import ImageGallery from "@/components/CarGallery";

export default async function CarDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || id === "undefined" || id.trim() === "" || id.length < 10) {
    notFound();
  }

  const supabase = getSupabaseServer();

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .single();

  if (error || !car) {
    console.log("Car not found → ID:", id);
    notFound();
  }

  const cleanPhone = car.dealer_phone
    ? car.dealer_phone.replace(/\D/g, "").replace(/^0/, "234")
    : "2348065481663";
  const whatsappUrl = `https://wa.me/${cleanPhone}`;
  const priceInMillions = (car.price / 1_000_000).toFixed(1);
  const images = car.images?.length ? car.images : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 pb-32">
      <div className="container mx-auto px-4 pt-8 md:px-6">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-3 text-green-600 font-bold text-lg hover:text-green-700 transition-all hover:-translate-x-2"
        >
          <ArrowLeft size={28} /> Back to Inventory
        </Link>
      </div>

      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* IMAGE GALLERY — NOW FULLY INTERACTIVE */}
          <ImageGallery
            images={images}
            year={car.year}
            make={car.make}
            model={car.model}
            condition={car.condition}
            featured_paid={car.featured_paid}
          />

          {/* CAR DETAILS */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-2xl font-bold text-gray-700 mt-4 flex items-center gap-3">
                <MapPin size={36} className="text-green-600" />{" "}
                {car.location || "Lagos"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl text-center">
              <p className="text-6xl md:text-8xl font-black">
                ₦{priceInMillions}M
              </p>
              <p className="text-xl md:text-2xl font-bold mt-4 opacity-90">
                Final Price • No Hidden Charges
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {car.mileage != null && car.mileage > 0 && (
                <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                  <Gauge className="text-green-600" size={44} />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-sm">
                      Mileage
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      {Number(car.mileage).toLocaleString()} km
                    </p>
                  </div>
                </div>
              )}
              {car.transmission && (
                <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                  <Settings className="text-green-600" size={44} />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-sm">
                      Transmission
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      {car.transmission}
                    </p>
                  </div>
                </div>
              )}
              {car.fuel && (
                <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                  <Fuel className="text-green-600" size={44} />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-sm">
                      Fuel Type
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      {car.fuel}
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-gray-100 p-6 rounded-2xl flex items-center gap-4">
                <CarIcon className="text-green-600" size={44} />
                <div>
                  <p className="text-gray-700 font-bold uppercase tracking-wider text-sm">
                    Condition
                  </p>
                  <p className="text-2xl font-black text-gray-900">
                    {car.condition === "Foreign Used"
                      ? "TOKUNBO"
                      : car.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <WhatsAppButton car={car} size="large" />
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-black hover:bg-gray-900 text-white py-8 rounded-3xl font-black text-3xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-2xl"
              >
                <Phone size={48} /> Call Seller Now
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-green-700 font-black text-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={36} /> Real Photos
              </div>
              <div className="flex items-center gap-3">
                <Shield size={36} /> Verified Seller
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={36} /> Instant Reply
              </div>
            </div>
          </div>
        </div>
      </section>

      {car.description && (
        <section className="container mx-auto px-4 md:px-6 py-16 bg-white rounded-3xl shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-gray-900">
            Description
          </h2>
          <p className="text-xl text-gray-700 whitespace-pre-line leading-relaxed">
            {car.description}
          </p>
        </section>
      )}

      <SimilarCars currentCarId={car.id} />

      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-6 rounded-full shadow-2xl z-50 hover:scale-110 transition-all animate-bounce"
      >
        <MessageCircle size={38} />
      </Link>

      <div className="fixed top-1/2 -right-4 -rotate-90 origin-right bg-yellow-400 text-black px-8 py-3 rounded-tl-2xl rounded-tr-2xl font-black text-xl shadow-2xl z-40 animate-pulse">
        <Link href="/careers" className="flex items-center gap-3">
          <Briefcase size={28} /> WE ARE HIRING!
        </Link>
      </div>
    </div>
  );
}
