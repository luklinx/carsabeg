"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Car, Zap, MessageCircle } from "lucide-react";
import Logo from "./logo";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-20 right-4 z-50 p-4 bg-white rounded-full shadow-2xl border-4 border-green-600"
      >
        {open ? (
          <X size={36} className="text-green-600" />
        ) : (
          <Menu size={36} className="text-green-600" />
        )}
      </button>

      {/* FULL SCREEN MENU */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="p-8 border-b-8 border-green-600 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
              <div className="flex justify-between items-center">
                <Logo size="xl" />
                <button onClick={() => setOpen(false)} className="p-3">
                  <X size={48} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-10 px-8">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-6 text-4xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-110"
              >
                <Home size={48} /> Home
              </Link>
              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className="flex items-center gap-6 text-4xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-110"
              >
                <Car size={48} /> All Cars
              </Link>
              <Link
                href="/value-my-car"
                onClick={() => setOpen(false)}
                className="flex items-center gap-6 text-4xl font-black text-gray-800 hover:text-green-600 transition-all hover:scale-110"
              >
                <Zap size={48} /> Value My Car
              </Link>
              <Link
                href="/sell"
                onClick={() => setOpen(false)}
                className="flex items-center gap-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-24 py-12 rounded-full font-black text-5xl shadow-3xl hover:shadow-4xl transform hover:scale-110 transition-all duration-300"
              >
                <Zap size={56} /> SELL CAR
              </Link>

              <a
                href="https://wa.me/2349018837909"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-16 flex items-center gap-8 bg-green-600 hover:bg-green-700 text-white px-32 py-14 rounded-full font-black text-6xl shadow-3xl transform hover:scale-115 transition-all duration-500"
              >
                <MessageCircle size={64} className="animate-bounce" />
                CHAT NOW
              </a>
            </div>

            <p className="text-center text-gray-600 font-bold pb-12 text-2xl">
              Made in Nigeria • For Nigerians • With Love
            </p>
          </nav>
        </>
      )}
    </>
  );
}
