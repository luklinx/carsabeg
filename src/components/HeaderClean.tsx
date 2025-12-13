// src/components/HeaderClean.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Car,
  DollarSign,
  MessageCircle,
  Search,
  MapPin,
  User as UserIcon,
  Phone,
  MessageCircle as WhatsAppIcon,
  ArrowLeft,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";

export default function HeaderClean() {
  const pathname = usePathname();
  const isCarPage = pathname?.startsWith("/car/") ?? false;

  const [scrollY, setScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomNav(false);
      } else if (currentScrollY < lastScrollY) {
        setShowBottomNav(true);
      }
      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isScrolled = scrollY > 80;

  // Placeholder car info — you can enhance with real data later
  const carTitle = isCarPage && isScrolled ? "2023 Toyota Camry XSE" : null;
  const carPrice = isCarPage && isScrolled ? "₦32.5M" : null;

  return (
    <>
      {/* VERIFICATION BAR */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 text-center font-black text-sm shadow-lg">
        <Link href="/auth/signup" className="hover:underline">
          Join us in building a safer community. Get verified to boost your credibility!
          <span className="ml-2 bg-black text-yellow-400 px-3 py-1 rounded-full text-xs animate-pulse">
            VERY NOW
          </span>
        </Link>
      </div>

      {/* MAIN HEADER */}
      <header
        className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${
          isScrolled && isCarPage ? "bg-white/95 backdrop-blur-md shadow-md" : ""
        }`}
      >
        <div className="px-3 sm:px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* LEFT: Back Arrow or Logo */}
            {isCarPage && isScrolled ? (
              <Link href="/" className="text-gray-800">
                <ArrowLeft size={28} />
              </Link>
            ) : (
              <Link href="/">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
              </Link>
            )}

            {/* CENTER: Car Info on scroll (Car Page Only) */}
            {isCarPage && isScrolled && (
              <div className="hidden md:block text-center flex-1">
                <h2 className="font-black text-lg truncate">
                  {carTitle || "Loading..."}
                </h2>
                <p className="text-green-600 font-black text-xl">
                  {carPrice || ""}
                </p>
              </div>
            )}

            {/* RIGHT: Search + Sell + User */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex flex-1 max-w-md">
                <form action="/inventory" className="flex items-center w-full">
                  <div className="flex items-center bg-gray-100 rounded-l-lg px-3 py-2">
                    <MapPin size={16} className="text-gray-500" />
                    <select name="location" className="bg-transparent text-sm outline-none">
                      <option value="">All</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                    </select>
                  </div>
                  <div className="flex flex-1 items-center bg-white border border-gray-200 rounded-r-lg shadow-sm">
                    <Search size={18} className="mx-3 text-gray-500" />
                    <input
                      name="q"
                      className="w-full py-2 pr-3 text-sm outline-none"
                      placeholder="Search cars..."
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg font-bold">
                      Go
                    </button>
                  </div>
                </form>
              </div>

              <Link
                href="/sell"
                className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md"
              >
                <DollarSign size={16} />
                Sell
              </Link>

              {/* CLEAN USER ICON */}
              <div className="p-1">
                <UserNav />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BOTTOM NAV — HIDE ON SCROLL UP */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* NORMAL BOTTOM NAV */}
        {!isCarPage && (
          <div className="grid grid-cols-5 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center text-green-600 font-bold">
              <Home size={24} />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/inventory" className="flex flex-col items-center text-gray-700 font-bold">
              <Car size={24} />
              <span className="text-xs">Cars</span>
            </Link>
            <Link href="/sell" className="flex flex-col items-center">
              <div className="bg-green-600 text-white p-4 rounded-full shadow-2xl -mt-8">
                <DollarSign size={32} />
              </div>
              <span className="text-xs font-black">Sell</span>
            </Link>
            <Link href="/contact" className="flex flex-col items-center text-gray-700 font-bold">
              <MessageCircle size={24} />
              <span className="text-xs">Chat</span>
            </Link>
            <div className="flex flex-col items-center text-gray-700 font-bold">
              <UserIcon size={24} />
              <span className="text-xs">Me</span>
            </div>
          </div>
        )}

        {/* CAR PAGE BOTTOM NAV */}
        {isCarPage && (
          <div className="grid grid-cols-3 gap-4 py-3 px-6">
            <button className="flex flex-col items-center bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">
              <Phone size={28} />
              <span className="text-sm mt-1">Call</span>
            </button>
            <button className="flex flex-col items-center bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg">
              <WhatsAppIcon size={28} />
              <span className="text-sm mt-1">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center bg-gray-700 text-white py-4 rounded-2xl font-black shadow-lg">
              <MessageCircle size={28} />
              <span className="text-sm mt-1">SMS</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}