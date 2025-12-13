// src/components/HeaderClean.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  MessageCircle as WhatsAppIcon,
  MessageCircle,
  Home,
  Car,
  DollarSign,
  Search,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";

export default function HeaderClean() {
  const pathname = usePathname();
<<<<<<< HEAD
  const isCarPage = pathname ? pathname.startsWith("/car/") : false;
=======
  const isCarPage = pathname?.startsWith("/car/") ?? false;
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showTopNav, setShowTopNav] = useState(!isCarPage);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

<<<<<<< HEAD
=======
      // Car page: show top nav only after scrolling past images (~500px)
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
      if (isCarPage) {
        setShowTopNav(currentScrollY > 500);
      }

<<<<<<< HEAD
=======
      // Normal pages: hide bottom nav on scroll down
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
      if (!isCarPage) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowBottomNav(false);
        } else if (currentScrollY < lastScrollY) {
          setShowBottomNav(true);
        }
      }

      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isCarPage]);

<<<<<<< HEAD
  // Placeholder car info
=======
  // Placeholder dynamic car info — replace with real data if you have a way
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
  const carTitle = isCarPage && showTopNav ? "2023 Toyota Camry XSE" : null;
  const carPrice = isCarPage && showTopNav ? "₦32.5M" : null;
  const carLocation = isCarPage && showTopNav ? "Lagos" : null;
  const carCondition = isCarPage && showTopNav ? "Tokunbo" : null;

  return (
    <>
      {/* VERIFICATION BAR */}
<<<<<<< HEAD
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-2 text-center font-black text-sm shadow-lg">
        <Link href="/auth/signup" className="hover:underline">
          Get verified to boost credibility!
          <span className="ml-2 bg-black text-yellow-400 px-2 py-0.5 rounded text-sm animate-pulse">
=======
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-2 text-center font-black text-xs shadow-lg">
        <Link href="/auth/signup" className="hover:underline">
          Get verified to boost credibility!
          <span className="ml-2 bg-black text-yellow-400 px-2 py-0.5 rounded text-xs animate-pulse">
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
            VERY NOW
          </span>
        </Link>
      </div>

      {/* MAIN HEADER */}
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          showTopNav ? "translate-y-0 shadow-md" : "-translate-y-full"
        }`}
      >
        <div className="px-3 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* LEFT */}
            {isCarPage ? (
              <Link href="/" className="text-gray-800">
                <ArrowLeft size={24} />
              </Link>
            ) : (
              <Link href="/">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
              </Link>
            )}

            {/* CENTER: Car Info */}
            {isCarPage && showTopNav && (
              <div className="flex-1 text-center px-2">
                <h2 className="font-black text-sm truncate">
                  {carTitle || "Loading..."}
                </h2>
<<<<<<< HEAD
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-1">
=======
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mt-1">
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
                  <span className="text-green-600 font-black">{carPrice}</span>
                  <span>•</span>
                  <span>{carLocation}</span>
                  <span>•</span>
<<<<<<< HEAD
                  <span className="text-yellow-600 font-bold">
                    {carCondition}
                  </span>
=======
                  <span className="text-yellow-600 font-bold">{carCondition}</span>
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
                </div>
              </div>
            )}

            {/* RIGHT */}
            {isCarPage ? (
              <div className="flex items-center gap-3">
                <button className="text-gray-700 hover:text-green-600">
                  <Share2 size={20} />
                </button>
                <button className="text-gray-700 hover:text-green-600">
                  <Heart size={20} />
                </button>
                <div className="p-1">
                  <UserNav />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sell"
                  className="hidden sm:flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm"
                >
                  <DollarSign size={14} />
                  Sell
                </Link>
                <div className="p-1">
                  <UserNav />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BOTTOM NAV */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {!isCarPage ? (
          <div className="grid grid-cols-5 gap-1 py-2">
<<<<<<< HEAD
            <Link
              href="/"
              className="flex flex-col items-center text-green-600 font-bold"
            >
              <Home size={22} />
              <span className="text-sm">Home</span>
            </Link>
            <Link
              href="/inventory"
              className="flex flex-col items-center text-gray-700 font-bold"
            >
              <Car size={22} />
              <span className="text-sm">Cars</span>
=======
            <Link href="/" className="flex flex-col items-center text-green-600 font-bold">
              <Home size={22} />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/inventory" className="flex flex-col items-center text-gray-700 font-bold">
              <Car size={22} />
              <span className="text-xs">Cars</span>
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
            </Link>
            <Link href="/sell" className="flex flex-col items-center">
              <div className="bg-green-600 text-white p-3.5 rounded-full shadow-2xl -mt-6">
                <DollarSign size={28} />
              </div>
<<<<<<< HEAD
              <span className="text-sm font-black">Sell</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center text-gray-700 font-bold"
            >
              <MessageCircle size={22} />
              <span className="text-sm">Chat</span>
            </Link>
            <div className="flex flex-col items-center text-gray-700 font-bold">
              <UserIcon size={22} />
              <span className="text-sm">Me</span>
=======
              <span className="text-xs font-black">Sell</span>
            </Link>
            <Link href="/contact" className="flex flex-col items-center text-gray-700 font-bold">
              <MessageCircle size={22} />
              <span className="text-xs">Chat</span>
            </Link>
            <div className="flex flex-col items-center text-gray-700 font-bold">
              <UserIcon size={22} />
              <span className="text-xs">Me</span>
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 py-2 px-4">
<<<<<<< HEAD
            <button className="flex flex-col items-center bg-green-600 text-white py-3 rounded-xl font-black text-sm shadow-lg">
              <Phone size={22} />
              <span className="mt-1">Call</span>
            </button>
            <button className="flex flex-col items-center bg-green-600 text-white py-3 rounded-xl font-black text-sm shadow-lg">
              <WhatsAppIcon size={22} />
              <span className="mt-1">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center bg-yellow-400 text-black py-3 rounded-xl font-black text-sm shadow-lg">
=======
            <button className="flex flex-col items-center bg-green-600 text-white py-3 rounded-xl font-black text-xs shadow-lg">
              <Phone size={22} />
              <span className="mt-1">Call</span>
            </button>
            <button className="flex flex-col items-center bg-green-600 text-white py-3 rounded-xl font-black text-xs shadow-lg">
              <WhatsAppIcon size={22} />
              <span className="mt-1">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center bg-yellow-400 text-black py-3 rounded-xl font-black text-xs shadow-lg">
>>>>>>> 32e8aeb2612b11c879a39370e4b1a48995e1794f
              <MessageCircle size={22} />
              <span className="mt-1">SMS</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
}