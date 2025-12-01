// src/components/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Home, Car, MessageCircle, Zap } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger — Small, Clean, Always Visible */}
      <button className="lg:hidden z-50 p-2">
        <div className="space-y-1.5">
          <span
            className={`block w-7 h-1 bg-green-600 rounded-full transition-all ${
              open ? "rotate-45 translate-y-2.5" : ""
            }`}
          />
          <span
            className={`block w-7 h-1 bg-green-600 rounded-full transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-1 bg-green-600 rounded-full transition-all ${
              open ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </div>
      </button>

      {/* FULL SCREEN MENU — Fast, Direct, Nigerian */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-3xl font-black text-green-600">CARS ABEG</h2>
              <button onClick={() => setOpen(false)} className="p-2">
                <X size={36} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-8 px-8">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-2xl font-black py-4 w-full text-center hover:bg-green-50 rounded-2xl transition"
              >
                <Home size={32} /> Home
              </Link>
              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-2xl font-black py-4 w-full text-center hover:bg-green-50 rounded-2xl transition"
              >
                <Car size={32} /> All Cars
              </Link>
              <Link
                href="/sell"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-2xl font-black py-4 w-full text-center bg-green-600 text-white rounded-2xl shadow-xl hover:bg-green-700 transition"
              >
                <Zap size={32} /> Sell Your Car
              </Link>
              <Link
                href="/value-my-car"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-2xl font-black py-4 w-full text-center hover:bg-green-50 rounded-2xl transition"
              >
                <Zap size={32} /> Value My Car
              </Link>

              {/* WhatsApp — King of Mobile */}
              <a
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex items-center gap-5 bg-green-600 text-white px-16 py-8 rounded-full font-black text-3xl shadow-2xl hover:bg-green-700 transform hover:scale-105 transition"
              >
                <MessageCircle size={40} />
                Chat Now
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
