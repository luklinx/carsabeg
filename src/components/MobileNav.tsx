// src/components/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Car, Zap, MessageCircle } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HAMBURGER BUTTON — ALWAYS VISIBLE ON MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden z-50 p-3 bg-white rounded-full shadow-xl border-2 border-gray-200"
        aria-label="Toggle menu"
      >
        {open ? (
          <X size={32} className="text-green-600" />
        ) : (
          <Menu size={32} className="text-green-600" />
        )}
      </button>

      {/* FULL SCREEN MENU — Nigerian Speed */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu Panel */}
          <nav className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b-4 border-green-600 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <h2 className="text-3xl font-black">CARS ABEG</h2>
              <button onClick={() => setOpen(false)} className="p-2">
                <X size={40} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center items-center gap-8 px-8">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-5 text-3xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-105"
              >
                <Home size={36} />
                Home
              </Link>

              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className="flex items-center gap-5 text-3xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-105"
              >
                <Car size={36} />
                All Cars
              </Link>

              <Link
                href="/sell"
                onClick={() => setOpen(false)}
                className="flex items-center gap-5 text-3xl font-black bg-green-600 text-white px-16 py-8 rounded-full shadow-2xl hover:bg-green-700 transform hover:scale-110 transition-all"
              >
                <Zap size={40} />
                SELL YOUR CAR
              </Link>

              <Link
                href="/value-my-car"
                onClick={() => setOpen(false)}
                className="flex items-center gap-5 text-3xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-105"
              >
                <Zap size={36} />
                Value My Car
              </Link>

              {/* WhatsApp — The Real King */}
              <a
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 flex items-center gap-6 bg-green-600 hover:bg-green-700 text-white px-20 py-10 rounded-full font-black text-2xl shadow-3xl transform hover:scale-110 transition-all duration-300"
              >
                <MessageCircle size={48} className="animate-bounce" />
                CHAT NOW
              </a>
            </div>

            <p className="text-center text-gray-500 font-bold pb-10 text-lg">
              Made in Nigeria • For Nigerians
            </p>
          </nav>
        </>
      )}
    </>
  );
}
