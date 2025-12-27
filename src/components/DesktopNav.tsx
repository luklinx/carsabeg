// src/components/DesktopNav.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  DollarSign,
  MessageCircle,
  Info,
  ChevronDown,
  Home,
  FileText,
  Headphones,
} from "lucide-react";

export default function DesktopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="hidden lg:flex items-center gap-8 px-4">
      {/* HOME */}
      <Link
        href="/"
        className="group flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-all duration-300"
      >
        <Home
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        Home
      </Link>

      {/* BROWSE CARS */}
      <Link
        href="/inventory"
        className="group flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-all duration-300"
      >
        <Car size={18} className="group-hover:scale-110 transition-transform" />
        Browse Cars
      </Link>

      {/* SELL/VALUE DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => toggleDropdown("sell")}
          className="group flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-all duration-300 py-2"
        >
          <DollarSign
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          Sell
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openDropdown === "sell" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openDropdown === "sell" && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
            <Link
              href="/sell"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 border-b border-gray-100 transition-all"
            >
              <DollarSign size={18} className="text-green-600" />
              <div>
                <p className="font-bold">Sell Your Car</p>
                <p className="text-xs text-gray-600">List and sell quickly</p>
              </div>
            </Link>
            <Link
              href="/value-my-car"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all"
            >
              <Info size={18} className="text-green-600" />
              <div>
                <p className="font-bold">Value My Car</p>
                <p className="text-xs text-gray-600">Get instant valuation</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* RESOURCES DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => toggleDropdown("resources")}
          className="group flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-all duration-300 py-2"
        >
          <FileText
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          Learn
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openDropdown === "resources" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openDropdown === "resources" && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
            <Link
              href="/blog"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 border-b border-gray-100 transition-all"
            >
              <FileText size={18} className="text-green-600" />
              <div>
                <p className="font-bold">Blog</p>
                <p className="text-xs text-gray-600">Car tips & insights</p>
              </div>
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all"
            >
              <Info size={18} className="text-green-600" />
              <div>
                <p className="font-bold">How It Works</p>
                <p className="text-xs text-gray-600">Our process explained</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* CONTACT DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => toggleDropdown("contact")}
          className="group flex items-center gap-2 text-base font-bold text-gray-800 hover:text-green-600 transition-all duration-300 py-2"
        >
          <Headphones
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          Support
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              openDropdown === "contact" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openDropdown === "contact" && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 border-b border-gray-100 transition-all"
            >
              <MessageCircle size={18} className="text-green-600" />
              <div>
                <p className="font-bold">WhatsApp</p>
                <p className="text-xs text-gray-600">Instant messaging</p>
              </div>
            </a>
            <Link
              href="/contact"
              onClick={() => setOpenDropdown(null)}
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-green-50 hover:text-green-600 transition-all"
            >
              <Headphones size={18} className="text-green-600" />
              <div>
                <p className="font-bold">Contact Us</p>
                <p className="text-xs text-gray-600">Get in touch</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* PRIMARY CTA */}
      <div className="ml-auto">
        <Link
          href="/sell"
          className="group flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <DollarSign size={18} />
          Sell Now
        </Link>
      </div>
    </nav>
  );
}
