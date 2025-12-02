// src/components/DesktopNav.tsx
import Link from "next/link";
import { Car, DollarSign, MessageCircle, Info } from "lucide-react";

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center space-x-10">
      {/* MAIN LINKS — Only the essentials */}
      <Link
        href="/inventory"
        className="group flex items-center gap-2 text-lg font-black text-gray-800 hover:text-green-600 transition-all duration-300"
      >
        <Car size={20} className="group-hover:scale-110 transition-transform" />
        All Cars
      </Link>

      <Link
        href="/sell"
        className="group flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-black text-lg hover:bg-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        <DollarSign size={22} />
        SELL CAR FAST
      </Link>

      <Link
        href="/value-my-car"
        className="group flex items-center gap-2 text-lg font-bold text-gray-700 hover:text-green-600 transition-all duration-300"
      >
        <Info
          size={20}
          className="group-hover:rotate-12 transition-transform"
        />
        Value My Car
      </Link>

      {/* WhatsApp Support — Desktop luxury touch */}
      <a
        href="https://wa.me/2348123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-black text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <MessageCircle size={22} className="group-hover:animate-pulse" />
        Chat Now
      </a>
    </nav>
  );
}
