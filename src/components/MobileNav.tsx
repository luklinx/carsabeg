// src/components/MobileNav.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden z-50 relative w-8 h-8 focus:outline-none"
      >
        <span
          className={`block absolute h-1 w-8 bg-green-600 rounded transform transition-all duration-300 ${
            open ? "rotate-45 top-3.5" : "top-1"
          }`}
        ></span>
        <span
          className={`block absolute h-1 w-8 bg-green-600 rounded top-3.5 transition-all duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block absolute h-1 w-8 bg-green-600 rounded transform transition-all duration-300 ${
            open ? "-rotate-45 top-3.5" : "top-6"
          }`}
        ></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <nav
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 pt-24">
          <h2 className="text-3xl font-black text-green-600 mb-10">Menu</h2>
          <div className="space-y-6 text-2xl font-bold">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600"
            >
              Home
            </Link>
            <Link
              href="/inventory"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600"
            >
              All Cars
            </Link>
            <Link
              href="/sell"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600 text-yellow-500"
            >
              Sell Your Car
            </Link>
            <Link
              href="/value-my-car"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600"
            >
              Value My Car
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600"
            >
              Blog
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setOpen(false)}
              className="block hover:text-green-600"
            >
              How It Works
            </Link>
          </div>
          <a
            href="https://wa.me/2348123456789"
            className="block mt-12 bg-green-600 text-white text-center py-6 rounded-full text-2xl font-black"
          >
            Chat on WhatsApp
          </a>
        </div>
      </nav>
    </>
  );
}
