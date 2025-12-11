// src/components/ClientHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CarCard from "./CarCard";
import { getCars, getPaidFeaturedCars } from "@/lib/cars";
import type { Car } from "@/types";
import {
  Flame,
  Shield,
  Star,
  Phone,
  MapPin,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  Heart,
  User,
  PlusCircle,
  Download,
  CheckCircle,
  Award,
  TrendingUp,
} from "lucide-react";

export default function ClientHome() {
  const [cars, setCars] = useState<Car[]>([]);
  const [paidCars, setPaidCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* 1. VERIFICATION BAR — DUBIZZLE STYLE */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 text-center font-black text-sm md:text-base shadow-lg">
        <p className="flex items-center justify-center gap-3">
          <CheckCircle size={20} />
          Join us in building a safer community. Get verified to boost your
          credibility!
          <span className="ml-2 bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-black animate-pulse">
            VERY NOW
          </span>
        </p>
      </div>

      {/* 2. TOP NAV — FULLY RESPONSIVE */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Flame size={36} className="text-green-600" />
              <span className="text-2xl font-black text-gray-900">
                CARS ABEG
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-green-600 transition font-bold">
                All Cities <ChevronDown size={16} />
              </button>
              <button className="relative hover:text-green-600 transition">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="hover:text-green-600 transition font-bold">
                My Searches
              </button>
              <button className="hover:text-green-600 transition font-bold flex items-center gap-2">
                <Heart size={20} /> Favorites
              </button>
              <button className="hover:text-green-600 transition font-bold flex items-center gap-2">
                <MessageCircle size={20} /> Chats
              </button>
              <button className="hover:text-green-600 transition font-bold">
                My Ads
              </button>
              <Link
                href="/auth/signin"
                className="hover:text-green-600 transition font-bold"
              >
                Login
              </Link>
              <Link
                href="/sell"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg hover:shadow-xl transition"
              >
                <PlusCircle size={20} />
                PLACE YOUR AD
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Bottom Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
            <div className="grid grid-cols-5 gap-1 py-3">
              <button className="flex flex-col items-center gap-1 text-green-600 font-bold">
                <Heart size={24} />
                <span className="text-xs">Favorites</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-700 font-bold">
                <MessageCircle size={24} />
                <span className="text-xs">Chats</span>
              </button>
              <Link href="/sell" className="flex flex-col items-center gap-1">
                <div className="bg-green-600 text-white p-4 rounded-full shadow-xl">
                  <PlusCircle size={28} />
                </div>
                <span className="text-xs font-black">Sell</span>
              </Link>
              <button className="flex flex-col items-center gap-1 text-gray-700 font-bold">
                <Bell size={24} />
                <span className="text-xs">Alerts</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-700 font-bold">
                <User size={24} />
                <span className="text-xs">Account</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 3. HERO BANNER — DUBIZZLE STYLE */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Everyone is on CARS ABEG!
            <br />
            <span className="text-yellow-400">Are you?</span>
          </h1>
          <p className="text-xl md:text-3xl font-bold mb-12 opacity-90">
            Buy & Sell Cars • Instant WhatsApp • Verified Sellers
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl p-3 flex items-center gap-4">
              <Search size={28} className="text-gray-600 ml-4" />
              <input
                type="text"
                placeholder="Search for motors..."
                className="w-full text-gray-900 text-lg md:text-xl font-medium outline-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-black text-lg shadow-lg transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES — BIG, BEAUTIFUL CARDS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-12 text-gray-900">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "All Cars",
                count: totalCars,
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600",
              },
              {
                name: "Tokunbo",
                count: foreignUsed,
                icon: Shield,
                color: "from-blue-500 to-cyan-600",
              },
              {
                name: "Nigerian Used",
                count: nigerianUsed,
                icon: Phone,
                color: "from-purple-500 to-pink-600",
              },
              {
                name: "Brand New",
                count: brandNew,
                icon: Star,
                color: "from-yellow-400 to-orange-500",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/inventory"
                className="group block bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${cat.color} flex items-center justify-center`}
                >
                  <cat.icon size={64} className="text-white drop-shadow-2xl" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                    {cat.count.toLocaleString()}
                  </h3>
                  <p className="text-lg font-bold text-gray-700 mt-2">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED LISTINGS */}
      {paidCars.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-black/70 backdrop-blur-xl px-10 py-5 rounded-full text-3xl font-black shadow-2xl border-4 border-yellow-400">
              <Flame className="text-yellow-400" size={40} />
              PREMIUM LISTINGS
              <Flame className="text-yellow-400" size={40} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black mt-8">
              {paidCars.length} Featured Cars
            </h2>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paidCars.slice(0, 8).map((car) => (
                <div
                  key={car.id}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <CarCard car={car} />
                </div>
              ))}
            </div>

            {paidCars.length > 8 && (
              <div className="text-center mt-16">
                <Link
                  href="/inventory?featured=true"
                  className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-110 transition"
                >
                  View All Premium ({paidCars.length - 8}+)
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. TRUST SECTION */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Award size={80} className="mx-auto text-yellow-400 mb-6" />
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Trusted by 50,000+ Car Buyers in Nigeria
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">
            Verified sellers • Instant WhatsApp • No scams • Best prices
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition flex items-center gap-4 mx-auto">
            <Shield size={36} />
            Get Verified Now
          </button>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
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
              },
              {
                name: "Chioma O.",
                text: "Bought a clean Tokunbo Camry. Smooth process!",
              },
              {
                name: "Ahmed K.",
                text: "Instant WhatsApp chat saved me from scams. Thank you!",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-3xl p-8 shadow-xl text-center"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={28}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-lg md:text-xl font-medium text-gray-700 italic mb-6">
                  {t.text}
                </p>
                <p className="font-black text-gray-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. APP DOWNLOAD */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Find Amazing Deals on the Go
          </h2>
          <p className="text-xl md:text-2xl mb-12">
            Download the CARS ABEG app now!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-10 py-6 rounded-2xl font-black text-xl flex items-center gap-4 shadow-2xl">
              <Download size={32} />
              App Store
            </button>
            <button className="bg-black hover:bg-gray-900 text-white px-10 py-6 rounded-2xl font-black text-xl flex items-center gap-4 shadow-2xl">
              <Download size={32} />
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-black mb-6">CARS ABEG</h3>
            <p className="text-gray-400">
              Nigeria&apos;s #1 marketplace for buying and selling cars.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/inventory" className="hover:text-white transition">
                  All Cars
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition">
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4">Contact</h4>
            <p className="text-gray-400">support@carsabeg.ng</p>
            <p className="text-gray-400">+234 802 277 2234</p>
          </div>
          <div>
            <h4 className="font-black mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                <MessageCircle size={24} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 text-sm">
          © 2025 CARS ABEG. All rights reserved.
        </div>
      </footer>
    </>
  );
}
