// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, DollarSign, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";
import { User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* MAIN HEADER — Sticky, modest desktop nav; mobile top shows logo + user */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="px-3 sm:px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* LOGO */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-1">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
              </Link>

              {/* DESKTOP NAV — modest */}
              <nav className="hidden lg:flex items-center gap-4">
                <Link
                  href="/"
                  className={`text-sm font-semibold transition-colors ${
                    pathname === "/"
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/inventory"
                  className={`text-sm font-semibold transition-colors ${
                    pathname === "/inventory"
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  All Cars
                </Link>
                <Link
                  href="/value-my-car"
                  className="text-sm font-semibold text-gray-700 hover:text-green-600"
                >
                  Value My Car
                </Link>
                <Link
                  href="/sell"
                  className="text-sm font-semibold text-gray-700 hover:text-green-600"
                >
                  Sell
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-sm font-semibold text-gray-700 hover:text-green-600"
                >
                  How It Works
                </Link>
              </nav>
            </div>

            {/* Right side: user nav (shows on both desktop and mobile) */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex">
                <UserNav />
              </div>
              <div className="lg:hidden">
                <UserNav />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-2 py-2">
            <Link
              href="/"
              className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/inventory"
              className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
            >
              <Car size={20} />
              <span>Cars</span>
            </Link>
            <Link
              href="/sell"
              className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
            >
              <DollarSign size={20} />
              <span>Sell</span>
            </Link>
            <Link
              href="/contact"
              className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
            >
              <MessageCircle size={20} />
              <span>Chat</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex-1 flex flex-col items-center text-center text-xs text-gray-700 hover:text-green-600"
            >
              <User size={20} />
              <span>Me</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
