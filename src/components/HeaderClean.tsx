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
      <div className="hidden md:flex items-center justify-center bg-amber-50 text-amber-800 text-sm py-1">
        Free listing for the first 30 days • Trusted sellers only
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="md" />
              </Link>
            </div>

            <div className="flex-1">
              <form action="/inventory" className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-64">
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

                <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-3 hidden sm:flex items-center text-gray-500">
                    <Search size={18} />
                  </div>
                  <input
                    name="q"
                    className="flex-1 px-3 py-3 text-sm outline-none"
                    placeholder="Search cars, makes, models, registration..."
                  />
                  <button className="bg-green-600 text-white px-5 py-2 rounded-r-lg text-sm font-semibold">
                    Search
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/sell"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              >
                <DollarSign size={16} />
                Sell
              </Link>
              <UserNav />
            </div>
          </div>
        </div>

        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-6 py-3 text-sm text-gray-600">
              <Link
                href="/inventory?category=suv"
                className="hover:text-green-600"
              >
                SUVs
              </Link>
              <Link
                href="/inventory?category=sedan"
                className="hover:text-green-600"
              >
                Sedans
              </Link>
              <Link
                href="/inventory?category=pickup"
                className="hover:text-green-600"
              >
                Pickups
              </Link>
              <Link
                href="/inventory?category=foreign"
                className="hover:text-green-600"
              >
                Foreign Used
              </Link>
              <Link
                href="/inventory?category=nigerian"
                className="hover:text-green-600"
              >
                Nigerian Used
              </Link>
              <Link
                href="/inventory?category=commercial"
                className="hover:text-green-600"
              >
                Commercial
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
            </Link>
            <UserNav />
          </div>
          <div className="px-4 pb-2">
            <form action="/inventory" className="flex items-center gap-2">
              <input
                name="q"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="Search cars, makes, models..."
              />
              <button className="bg-green-600 text-white px-3 py-2 rounded-lg">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="h-28" />

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-2 py-2">
              <Link
                href="/"
                className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/inventory"
                className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
              >
                <Car size={20} />
                <span>Cars</span>
              </Link>
              <Link
                href="/sell"
                className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
              >
                <DollarSign size={20} />
                <span>Sell</span>
              </Link>
              <Link
                href="/contact"
                className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
              >
                <MessageCircle size={20} />
                <span>Chat</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
              >
                <UserIcon size={20} />
                <span>Me</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
