// src/app/layout.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cars Abeg – Clean Cars, No Wahala",
  description: "Buy & Sell Tokunbo & Nigerian Used Cars in Nigeria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* HAMBURGER + NAV */}
        <header className="sticky top-0 z-50 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-black text-green-600"
            >
              Cars <span className="text-yellow-400">Abeg!</span>
            </Link>

            {/* Desktop Nav */}
            <DesktopNav />

            {/* Mobile Hamburger */}
            <MobileNav />
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-black text-white py-12 mt-20">
          <div className="container mx-auto px-6 text-center">
            <p className="text-2xl font-black mb-4">Cars Abeg • No Wahala</p>
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/2348123456789"
                className="text-yellow-400 font-bold"
              >
                +234 812 345 6789
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
