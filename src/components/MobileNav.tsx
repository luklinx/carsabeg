// src/components/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  DollarSign,
  MessageCircle,
  Zap,
  Info,
  Home,
  Search,
} from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HAMBURGER BUTTON — Nigerian Green, Smooth AF */}
      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 w-12 h-12 flex items-center justify-center rounded-full bg-green-600 shadow-xl lg:hidden"
        aria-label="Open menu"
      >
        {open ? (
          <X size={32} className="text-white animate-in spin-in-90" />
        ) : (
          <div className="space-y-2">
            <span className="block w-8 h-1 bg-white rounded-full animate-in slide-in-from-top" />
            <span className="block w-8 h-1 bg-white rounded-full" />
            <span className="block w-8 h-1 bg-white rounded-full animate-in slide-in-from-bottom" />
          </div>
        )}
      </button>

      {/* FULL-SCREEN OVERLAY MENU — This is Nigeria, we go BIG */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 z-40 transition-all duration-500 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />

        <nav className="relative h-full flex flex-col justify-center items-center px-8 text-white">
          {/* Logo Top */}
          <div className="absolute top-8 left-8">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="text-5xl font-black">CARS</span>
              <span className="text-5xl font-black text-yellow-400">ABEG</span>
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-8 right-8 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition"
          >
            <X size={36} />
          </button>

          {/* MENU ITEMS — BIG, BOLD, PROUD */}
          <div className="space-y-10 text-center">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-5 text-4xl font-black hover:text-yellow-400 transition-all hover:scale-110"
            >
              <Home size={40} />
              Home
            </Link>

            <Link
              href="/inventory"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-5 text-4xl font-black hover:text-yellow-400 transition-all hover:scale-110"
            >
              <Search size={40} />
              All Cars
            </Link>

            <Link
              href="/value-my-car"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-5 text-4xl font-black text-orange-300 hover:text-orange-100 transition-all hover:scale-110"
            >
              <Zap size={44} className="animate-pulse" />
              Value My Car
            </Link>

            <Link
              href="/sell"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-5 text-5xl font-black bg-yellow-400 text-black px-12 py-8 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-300"
            >
              <DollarSign size={48} />
              SELL YOUR CAR
            </Link>

            <Link
              href="/how-it-works"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-5 text-4xl font-black hover:text-yellow-400 transition-all hover:scale-110"
            >
              <Info size={40} />
              How It Works
            </Link>
          </div>

          {/* WHATSAPP KING — The Real Star */}
          <a
            href="https://wa.me/23480022772234"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-80 bg-white text-green-600 px-10 py-8 rounded-full shadow-2xl flex items-center justify-center gap-5 text-4xl font-black hover:bg-gray-100 transform hover:scale-110 transition-all duration-300"
          >
            <MessageCircle size={48} className="animate-bounce" />
            Chat on WhatsApp
          </a>

          {/* Nigerian Pride */}
          <p className="absolute bottom-32 text-yellow-300 font-black text-2xl opacity-80">
            Made in Nigeria • For Nigerians
          </p>
        </nav>
      </div>
    </>
  );
}
