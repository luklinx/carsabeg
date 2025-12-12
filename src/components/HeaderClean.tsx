// src/components/HeaderClean.tsx
"use client";

import Link from "next/link";
import {
  Home,
  Car,
  DollarSign,
  MessageCircle,
  Search,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";

export default function HeaderClean() {
  return (
    <>
      {/* VERIFICATION BAR — DUBIZZLE STYLE */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 text-center font-black text-sm shadow-lg">
        <Link
          href="/auth/signup"
          className="flex items-center justify-center gap-3 hover:underline"
        >
          <span>
            Join us in building a safer community. Get verified to boost your
            credibility!
          </span>
          <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs animate-pulse">
            VERY NOW
          </span>
        </Link>
      </div>

      {/* YOUR ORIGINAL HEADER — 100% UNTOUCHED */}
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full overflow-x-hidden">
        <div className="w-full px-3 sm:px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="md" />
              </Link>
            </div>

            <div className="hidden sm:flex flex-1 min-w-0">
              <form
                action="/inventory"
                className="flex items-center gap-2 w-full min-w-0"
              >
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-shrink-0">
                  <MapPin size={16} className="text-gray-500" />
                  <select
                    name="location"
                    className="bg-transparent text-sm outline-none"
                  >
                    <option value="">All locations</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                  </select>
                </div>

                <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-w-0">
                  <div className="px-3 hidden sm:flex items-center text-gray-500">
                    <Search size={18} />
                  </div>
                  <input
                    name="q"
                    className="flex-1 px-3 py-3 text-sm outline-none min-w-0"
                    placeholder="Search cars, makes, models, registration..."
                  />
                  <button className="bg-green-600 text-white px-5 py-2 rounded-r-lg text-sm font-semibold flex-shrink-0">
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/sell"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md flex-shrink-0"
              >
                <DollarSign size={16} />
                Sell
              </Link>
              <UserNav />
            </div>
          </div>
        </div>

        {/* BOTTOM NAV — YOUR ORIGINAL MOBILE NAV */}
        <div className="lg:hidden">
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="grid grid-cols-5 gap-1 py-2">
              <Link
                href="/"
                className="flex flex-col items-center text-green-600 font-bold"
              >
                <Home size={24} />
                <span className="text-xs">Home</span>
              </Link>
              <Link
                href="/inventory"
                className="flex flex-col items-center text-gray-700 font-bold"
              >
                <Car size={24} />
                <span className="text-xs">Cars</span>
              </Link>
              <Link href="/sell" className="flex flex-col items-center">
                <div className="bg-green-600 text-white p-4 rounded-full shadow-2xl -mt-8">
                  <DollarSign size={32} />
                </div>
                <span className="text-xs font-black">Sell</span>
              </Link>
              <Link
                href="/contact"
                className="flex flex-col items-center text-gray-700 font-bold"
              >
                <MessageCircle size={24} />
                <span className="text-xs">Chat</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex flex-col items-center text-gray-700 font-bold"
              >
                <UserIcon size={24} />
                <span className="text-xs">Me</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
