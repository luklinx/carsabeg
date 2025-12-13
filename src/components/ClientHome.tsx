// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Flame,
  Zap,
  Shield,
  Phone,
  Star,
  MessageCircle,
  Download,
  ChevronRight,
  Search,
  CheckCircle,
} from "lucide-react";

export default function ClientHome() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [all, premium] = await Promise.all([
          getCars(),
          getPaidFeaturedCars(),
        ]);
        setCars((all || []).filter((c): c is Car => !!c?.id));
        setPaidCars((premium || []).filter((c): c is Car => !!c?.id));
      } catch (err) {
        console.error("Failed to load cars:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const foreignUsed = cars.filter((c) => c.condition === "Foreign Used").length;
  const nigerianUsed = cars.filter(
    (c) => c.condition === "Nigerian Used"
  ).length;
  const brandNew = cars.filter((c) => c.condition === "Brand New").length;
  const totalCars = cars.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Flame size={80} className="animate-pulse text-green-600 mb-6" />
          <h1 className="text-6xl font-black text-gray-900">CARS ABEG</h1>
          <p className="text-2xl font-bold text-gray-600 mt-4">
            Loading fresh deals...
          </p>
        </div>
      </div>
    );
  }

  // GROUP FEATURED CARS
  const lagosCars = paidCars.filter((c) =>
    c.location?.toLowerCase().includes("lagos")
  );
  const kadunaCars = paidCars.filter((c) =>
    c.location?.toLowerCase().includes("kaduna")
  );
  const kanoCars = paidCars.filter((c) =>
    c.location?.toLowerCase().includes("kano")
  );
  const portharcourtCars = paidCars.filter((c) =>
    c.location?.toLowerCase().includes("portharcourt")
  );
  const foreignUsedCars = paidCars.filter(
    (c) => c.condition === "Foreign Used"
  );
  const nigerianUsedCars = paidCars.filter(
    (c) => c.condition === "Nigerian Used"
  );

  const FeaturedRow = ({ title, cars }: { title: string; cars: Car[] }) => {
    if (cars.length === 0) return null;

    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
            {title}
          </h3>
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
            {cars.map((car) => (
              <div key={car.id} className="snap-center flex-shrink-0 w-80">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Your Dream Car is Waiting!
            <br />
            <span className="text-yellow-400">
              Best Prices • Verified Sellers • Instant Deals
            </span>
          </h1>
          <p className="text-xl md:text-3xl font-bold mb-12 opacity-90">
            Over 1,000+ verified cars sold weekly. Join 50,000+ happy buyers
            today!
          </p>
          <Link
            href="/inventory"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            Start Browsing Now
          </Link>
        </div>
      </section>

      {/* FEATURED LISTINGS HEADING */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center text-gray-900">
            Featured Listings
          </h2>
        </div>
      </section>

      {/* FEATURED CARS CATEGORIES */}
      <FeaturedRow title="Cars in Lagos" cars={lagosCars} />
      <FeaturedRow title="Cars in Kaduna" cars={kadunaCars} />
      <FeaturedRow title="Cars in Kano" cars={kanoCars} />
      <FeaturedRow title="Cars in Portharcourt" cars={portharcourtCars} />
      <FeaturedRow title="Foreign Used Cars" cars={foreignUsedCars} />
      <FeaturedRow title="Nigerian Used Cars" cars={nigerianUsedCars} />

      {/* VERIFICATION ADVOCATE */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <CheckCircle size={80} className="mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Build a Safer Community
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">
            Get verified to boost your credibility and create trust among users.
            Verified sellers sell 3x faster!
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <CheckCircle size={36} className="animate-pulse" />
            Verify Now
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Tunde A.",
                text: "Sold my Toyota in 3 days! Best platform in Nigeria.",
                stars: 5,
              },
              {
                name: "Chioma O.",
                text: "Bought a clean Tokunbo Camry. Smooth process!",
                stars: 5,
              },
              {
                name: "Ahmed K.",
                text: "Instant WhatsApp chat saved me from scams. Thank you!",
                stars: 5,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-3xl p-10 shadow-xl text-center"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star
                      key={i}
                      size={32}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700 italic mb-8">
                  {t.text}
                </p>
                <p className="font-black text-2xl text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "How do I sell my car on CARS ABEG?",
                a: "List your car for free in under 5 minutes. Upload photos, add details, and get buyers via WhatsApp.",
              },
              {
                q: "Is CARS ABEG safe?",
                a: "Yes! All sellers are verified. Use our secure chat and meet in public places.",
              },
              {
                q: "What is verification?",
                a: "Verification boosts trust. Get your badge by signing up and submitting ID - sell 3x faster!",
              },
              {
                q: "How do I contact sellers?",
                a: "Use instant WhatsApp chat on each listing. No emails, no delays.",
              },
              // {
              //   q: "Do you have an app?",
              //   a: "Yes! Download from App Store or Google Play for deals on the go.",
              // },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  {faq.q}
                </h3>
                <p className="text-xl text-gray-700 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            CAN’T FIND YOUR DREAM CAR?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-12">
            We source any car in 48hrs
          </p>
          <a
            href="https://wa.me/2348065481663?text=Hi%20CarsAbeg!%20Help%20me%20find%20my%20dream%20car"
            className="inline-flex items-center gap-4 bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 transition"
          >
            <MessageCircle size={36} className="animate-bounce" />
            REQUEST ANY CAR
          </a>
        </div>
      </section>
    </>
  );
}
