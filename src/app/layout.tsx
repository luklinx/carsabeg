// src/app/layout.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer"; // ← Our new clean footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CARS ABEG – Tokunbo & Nigerian Used Cars",
    template: "%s | CARS ABEG",
  },
  description:
    "No Wahala. Just Quality Cars. Buy & Sell verified cars in Nigeria.",
  keywords:
    "tokunbo cars, nigerian used cars, buy car nigeria, sell car lagos, cars abeg",
  openGraph: {
    title: "CARS ABEG – Nigeria's #1 Car Marketplace",
    description: "Clean cars. Trusted sellers. Instant WhatsApp chat.",
    url: "https://carsabeg.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      // Fix for SES/Lockdown extension breaking Next.js
      if (window.chrome && window.chrome.runtime) {
        const originalSend = chrome.runtime.sendMessage;
        chrome.runtime.sendMessage = function(...args) {
          try {
            return originalSend.apply(this, args);
          } catch (e) {
            if (e.message.includes("out of scope")) return Promise.resolve();
            throw e;
          }
        };
      }
    `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        {/* STICKY HEADER */}
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="text-3xl md:text-2xl font-black tracking-tight"
            >
              CARS <span className="text-green-600">ABEG</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <DesktopNav />
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* CLEAN LIGHT FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
