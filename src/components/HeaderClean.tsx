// src/components/HeaderClean.tsx
"use client";

import Link from "next/link";
import {
  Bell,
  Heart,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  Search,
  MapPin,
  Home,
  Car,
  DollarSign,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";
import { useState } from "react";

export default function HeaderClean() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. VERIFICATION BAR — LINKS TO SIGNUP */}
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

      {/* MAIN HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="md" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <button className="flex items-center gap-2 hover:text-green-600 font-bold transition">
                All Cities <ChevronDown size={16} />
              </button>
              <button className="relative hover:text-green-600 transition">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                href="/favorites"
                className="hover:text-green-600 font-bold flex items-center gap-2"
              >
                <Heart size={20} /> Favorites
              </Link>
              <Link
                href="/chats"
                className="hover:text-green-600 font-bold flex items-center gap-2"
              >
                <MessageCircle size={20} /> Chats
              </Link>
              <Link href="/my-ads" className="hover:text-green-600 font-bold">
                My Ads
              </Link>
              <UserNav />
              <Link
                href="/sell"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-black flex items-center gap-3 shadow-lg hover:shadow-xl transition"
              >
                <PlusCircle size={24} />
                PLACE YOUR AD
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Bottom Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
            <div className="grid grid-cols-5 gap-2 py-3">
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
                <div className="bg-green-600 text-white p-4 rounded-full shadow-2xl">
                  <PlusCircle size={32} />
                </div>
                <span className="text-xs font-black">Sell</span>
              </Link>
              <Link
                href="/chats"
                className="flex flex-col items-center text-gray-700 font-bold"
              >
                <MessageCircle size={24} />
                <span className="text-xs">Chat</span>
              </Link>
              <div className="flex flex-col items-center">
                <UserNav />
                <span className="text-xs font-bold">Me</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
