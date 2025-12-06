// src/components/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Car,
  DollarSign,
  MessageCircle,
  Info,
  FileText,
  Headphones,
  ChevronRight,
} from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setExpandedMenu(null);
  };

  const toggleSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <>
      {/* HAMBURGER BUTTON — ALWAYS VISIBLE ON MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden z-50 p-2 rounded-lg transition-all"
        aria-label="Toggle menu"
      >
        {open ? (
          <X size={28} className="text-green-600" />
        ) : (
          <Menu size={28} className="text-green-600" />
        )}
      </button>

      {/* FULL SCREEN MENU */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />

          {/* Menu Panel */}
          <nav className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 flex flex-col shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-green-600">CARS ABEG</h2>
              <button
                onClick={closeMenu}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={28} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-3 text-lg font-bold text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all border-l-4 border-transparent hover:border-green-600"
              >
                <Home size={22} />
                Home
              </Link>

              {/* Browse Cars */}
              <Link
                href="/inventory"
                onClick={closeMenu}
                className="flex items-center gap-4 px-6 py-3 text-lg font-bold text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all border-l-4 border-transparent hover:border-green-600"
              >
                <Car size={22} />
                Browse Cars
              </Link>

              {/* Sell Menu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("sell")}
                  className="w-full flex items-center justify-between gap-4 px-6 py-3 text-lg font-bold text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all border-l-4 border-transparent hover:border-green-600"
                >
                  <div className="flex items-center gap-4">
                    <DollarSign size={22} />
                    Sell
                  </div>
                  <ChevronRight
                    size={20}
                    className={`transition-transform ${
                      expandedMenu === "sell" ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "sell" && (
                  <div className="bg-gray-50 border-l-4 border-green-600">
                    <Link
                      href="/sell"
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <DollarSign size={18} className="text-green-600" />
                      Sell Your Car
                    </Link>
                    <Link
                      href="/value-my-car"
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <Info size={18} className="text-green-600" />
                      Value My Car
                    </Link>
                  </div>
                )}
              </div>

              {/* Learn Menu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("learn")}
                  className="w-full flex items-center justify-between gap-4 px-6 py-3 text-lg font-bold text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all border-l-4 border-transparent hover:border-green-600"
                >
                  <div className="flex items-center gap-4">
                    <FileText size={22} />
                    Learn
                  </div>
                  <ChevronRight
                    size={20}
                    className={`transition-transform ${
                      expandedMenu === "learn" ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "learn" && (
                  <div className="bg-gray-50 border-l-4 border-green-600">
                    <Link
                      href="/blog"
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <FileText size={18} className="text-green-600" />
                      Blog
                    </Link>
                    <Link
                      href="/how-it-works"
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <Info size={18} className="text-green-600" />
                      How It Works
                    </Link>
                  </div>
                )}
              </div>

              {/* Support Menu */}
              <div>
                <button
                  onClick={() => toggleSubmenu("support")}
                  className="w-full flex items-center justify-between gap-4 px-6 py-3 text-lg font-bold text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all border-l-4 border-transparent hover:border-green-600"
                >
                  <div className="flex items-center gap-4">
                    <Headphones size={22} />
                    Support
                  </div>
                  <ChevronRight
                    size={20}
                    className={`transition-transform ${
                      expandedMenu === "support" ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedMenu === "support" && (
                  <div className="bg-gray-50 border-l-4 border-green-600">
                    <a
                      href="https://wa.me/2348123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <MessageCircle size={18} className="text-green-600" />
                      WhatsApp
                    </a>
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="flex items-center gap-4 px-10 py-3 text-base font-semibold text-gray-700 hover:text-green-600 transition-all"
                    >
                      <Headphones size={18} className="text-green-600" />
                      Contact Us
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white">
              <Link
                href="/sell"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg"
              >
                <DollarSign size={20} />
                Sell Now
              </Link>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 font-semibold text-xs pb-4 px-4">
              Made in Nigeria • For Nigerians
            </p>
          </nav>
        </>
      )}
    </>
  );
}
