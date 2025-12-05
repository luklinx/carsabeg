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
  AlertTriangle,
  Star,
  AlertCircle,
  Lock,
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-3 text-green-600 font-bold text-base sm:text-lg hover:text-green-700 transition-all hover:-translate-x-2"
        >
          <ArrowLeft size={24} /> Back to Inventory
        </Link>
      </div>

      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
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
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                <MapPin size={28} className="text-green-600 flex-shrink-0" />{" "}
                {car.location || "Lagos"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl text-center">
              <p className="text-4xl sm:text-6xl md:text-8xl font-black">
                ₦{priceInMillions}M
              </p>
              <p className="text-base sm:text-lg md:text-2xl font-bold mt-2 sm:mt-4 opacity-90">
                Final Price • No Hidden Charges
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {car.mileage != null && car.mileage > 0 && (
                <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl flex items-center gap-3 sm:gap-4">
                  <Gauge className="text-green-600 flex-shrink-0" size={36} />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      Mileage
                    </p>
                    <p className="text-lg sm:text-2xl font-black text-gray-900">
                      {Number(car.mileage).toLocaleString()} km
                    </p>
                  </div>
                </div>
              )}
              {car.transmission && (
                <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl flex items-center gap-3 sm:gap-4">
                  <Settings
                    className="text-green-600 flex-shrink-0"
                    size={36}
                  />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      Transmission
                    </p>
                    <p className="text-lg sm:text-2xl font-black text-gray-900">
                      {car.transmission}
                    </p>
                  </div>
                </div>
              )}
              {car.fuel && (
                <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl flex items-center gap-3 sm:gap-4">
                  <Fuel className="text-green-600 flex-shrink-0" size={36} />
                  <div>
                    <p className="text-gray-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      Fuel Type
                    </p>
                    <p className="text-lg sm:text-2xl font-black text-gray-900">
                      {car.fuel}
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-gray-100 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl flex items-center gap-3 sm:gap-4">
                <CarIcon className="text-green-600 flex-shrink-0" size={36} />
                <div>
                  <p className="text-gray-700 font-bold uppercase tracking-wider text-xs sm:text-sm">
                    Condition
                  </p>
                  <p className="text-lg sm:text-2xl font-black text-gray-900">
                    {car.condition === "Foreign Used"
                      ? "TOKUNBO"
                      : car.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <WhatsAppButton car={car} size="large" />
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-black hover:bg-gray-900 text-white py-5 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl md:text-3xl flex items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 shadow-2xl"
              >
                <Phone size={32} /> Call Seller Now
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-green-700 font-black text-sm sm:text-base md:text-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle size={28} /> Real Photos
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Shield size={28} /> Verified Seller
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <MessageCircle size={28} /> Instant Reply
              </div>
            </div>
          </div>
        </div>
      </section>

      {car.description && (
        <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-16 bg-white rounded-2xl sm:rounded-3xl shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 md:mb-8 text-gray-900">
            Description
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 whitespace-pre-line leading-relaxed">
            {car.description}
          </p>
        </section>
      )}

      {/* SELLER INFO & FEEDBACK SECTION */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8">
            About the Seller
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Seller Name & Contact */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Seller Name
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-4">
                {car.dealer_name || "Cars Abeg Verified Dealer"}
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Contact
              </p>
              <a
                href={`tel:${car.dealer_phone}`}
                className="text-green-600 font-bold text-base sm:text-lg hover:underline flex items-center gap-2"
              >
                <Phone size={20} /> {car.dealer_phone || "+234 901 883 7909"}
              </a>
            </div>

            {/* Number of Ads */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Active Listings
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-green-600 mb-4">
                12
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                This seller has 12 active cars for sale
              </p>
            </div>
          </div>

          {/* Leave Feedback */}
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <Star size={28} className="text-yellow-500" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900">
                Seller Rating
              </h3>
            </div>
            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  className="text-yellow-400 hover:text-yellow-500 transition text-2xl"
                  title={`Rate ${i + 1} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105">
              Leave Feedback About This Seller
            </button>
          </div>
        </div>
      </section>

      {/* SAFETY TIPS SECTION */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
            <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              Safety Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                icon: Lock,
                title: "Meet in Safe Places",
                desc: "Always meet the seller in a public location during daylight",
              },
              {
                icon: Shield,
                title: "Verify Identity",
                desc: "Ask for government-issued ID and confirm seller details",
              },
              {
                icon: Gauge,
                title: "Get Vehicle Inspection",
                desc: "Have a trusted mechanic inspect the car before payment",
              },
              {
                icon: AlertTriangle,
                title: "Use Secure Payment",
                desc: "Never send money via wire; use escrow or bank transfer",
              },
            ].map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Icon
                      size={24}
                      className="text-red-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-black text-gray-900 text-base sm:text-lg md:text-xl mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-4 sm:py-5 md:py-6 px-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3">
            <AlertTriangle size={24} /> Mark as Unavailable
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white py-4 sm:py-5 md:py-6 px-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3">
            <AlertCircle size={24} /> Report Abuse
          </button>
        </div>
      </section>

      <SimilarCars currentCarId={car.id} />

      <div className="fixed top-1/2 -right-4 -rotate-90 origin-right bg-yellow-400 text-black px-8 py-3 rounded-tl-2xl rounded-tr-2xl font-black text-xl shadow-2xl z-40 animate-pulse">
        <Link href="/careers" className="flex items-center gap-3">
          <Briefcase size={28} /> WE ARE HIRING!
        </Link>
      </div>
    </div>
  );
}
