// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, MessageCircle } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";

const navItems = [
  { name: "Home", href: "/" },
  { name: "All Cars", href: "/inventory" },
  { name: "Value My Car", href: "/value-my-car", highlight: true },
  { name: "Sell Car", href: "/sell", premium: true },
  { name: "How It Works", href: "/how-it-works" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MAIN HEADER — Sticky, Clean, Nigerian Power */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-green-600">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            {/* LOGO — Unmistakable */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-1">
              <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
            </Link>{" "}
            {/* DESKTOP NAV — Clean, Bold, Dubizzle Energy */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-black text-lg transition-all duration-300 ${
                    item.premium
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
                      : item.highlight
                      ? "bg-orange-500 text-white px-7 py-4 rounded-full font-black shadow-lg hover:bg-orange-600 hover:scale-105 flex items-center gap-2"
                      : pathname === item.href
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {item.highlight && <Zap size={20} className="inline" />}
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Desktop WhatsApp CTA (render once, show on lg+) */}
        <a
          href="https://wa.me/23480022772234"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition"
          aria-label="WhatsApp Chat"
        >
          <MessageCircle size={32} />
        </a>

        {/* MOBILE FULL-SCREEN MENU — Nigerian Speed */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 pt-20 px-6 overflow-y-auto">
            <div className="space-y-6 py-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-center py-6 py-6 rounded-2xl font-black text-3xl transition-all ${
                    item.premium
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl"
                      : item.highlight
                      ? "bg-orange-500 text-white shadow-2xl"
                      : pathname === item.href
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {item.highlight && "Value My Car"}
                  {item.premium && "SELL YOUR CAR"}
                  {!item.highlight && !item.premium && item.name}
                </Link>
              ))}

              {/* Mobile WhatsApp King */}
              <a
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-8 bg-green-600 text-white rounded-3xl font-black text-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 mt-10"
              >
                Chat on WhatsApp
              </a>

              <p className="text-center text-gray-500 font-bold mt-16 text-lg">
                Nigeria’s #1 Car Marketplace
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
