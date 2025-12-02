"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, MessageCircle } from "lucide-react";
import { useState } from "react";
import Logo from "./logo";

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
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4 border-green-600">
        <div className="px-4 py-4 md:py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* LOGO — PROUD & UNMISTAKABLE */}
            <Link href="/" className="flex items-center">
              <Logo size="md" className="hidden sm:hidden" />
              <Logo size="lg" className="hidden sm:block" />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-black text-lg transition-all duration-300 ${
                    item.premium
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105"
                      : item.highlight
                      ? "bg-orange-500 text-white px-8 py-4 rounded-full font-black shadow-xl hover:bg-orange-600 hover:scale-105 flex items-center gap-3"
                      : pathname === item.href
                      ? "text-green-600 underline decoration-4 underline-offset-8"
                      : "text-gray-800 hover:text-green-600"
                  }`}
                >
                  {item.highlight && <Zap size={24} className="inline" />}
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              {mobileMenuOpen ? <X size={36} /> : <Menu size={36} />}
            </button>
          </div>
        </div>

        {/* MOBILE FULL-SCREEN MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 pt-24 px-6 overflow-y-auto">
            <div className="flex justify-center mb-12">
              <Logo size="xl" />
            </div>
            <div className="space-y-6 py-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-center py-8 rounded-3xl font-black text-4xl transition-all shadow-xl ${
                    item.premium
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      : item.highlight
                      ? "bg-orange-500 text-white"
                      : pathname === item.href
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {item.highlight && "Value My Car"}
                  {item.premium && "SELL YOUR CAR"}
                  {!item.highlight && !item.premium && item.name}
                </Link>
              ))}

              <a
                href="https://wa.me/2349018837909"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-10 bg-green-600 text-white rounded-3xl font-black text-5xl shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Chat on WhatsApp
              </a>

              <p className="text-center text-gray-600 font-bold mt-20 text-2xl">
                Nigeria’s #1 Car Marketplace
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Floating WhatsApp — Always Visible */}
      <a
        href="https://wa.me/2349018837909"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-600 text-white p-5 rounded-full shadow-2xl z-50 hover:scale-110 transition-all duration-300 animate-bounce"
      >
        <MessageCircle size={36} />
      </a>
    </>
  );
}
