import Link from "next/link";
import { Car, DollarSign, MessageCircle, Info } from "lucide-react";

export default function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-10 xl:gap-14">
      <Link
        href="/inventory"
        className="group flex items-center gap-3 text-xl font-black text-gray-800 hover:text-green-600 transition-all duration-300"
      >
        <Car size={26} className="group-hover:scale-125 transition-transform" />
        All Cars
      </Link>

      <Link
        href="/value-my-car"
        className="group flex items-center gap-3 text-xl font-black text-gray-700 hover:text-orange-600 transition-all duration-300"
      >
        <Info
          size={26}
          className="group-hover:rotate-12 transition-transform"
        />
        Value My Car
      </Link>

      <Link
        href="/sell"
        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-full font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500"
      >
        SELL YOUR CAR
      </Link>

      <a
        href="https://wa.me/2349018837909"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl flex items-center gap-4 transform hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={28} className="animate-pulse" />
        Chat Now
      </a>
    </nav>
  );
}
