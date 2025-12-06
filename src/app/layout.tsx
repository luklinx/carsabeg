// src/app/layout.tsx
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/HeaderClean";
import Footer from "@/components/Footer"; // ← Our new clean footer

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: {
    default: "CARS ABEG – Foreign Used & Nigerian Used Cars",
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
  formatDetection: {
    email: false,
    telephone: false,
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
        {/* BROWSER COMPATIBILITY & RENDERING HINTS */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PERFORMANCE & CACHING */}
        <meta httpEquiv="Cache-Control" content="public, max-age=3600" />

        {/* PRECONNECT TO EXTERNAL SERVICES */}
        <link
          rel="preconnect"
          href="https://gwoweovqllfzznmidskz.supabase.co"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* DNS PREFETCH FOR THIRD-PARTY SERVICES */}
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* FIXES FOR EDGE & CHROME */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
      // Prevent SES/Lockdown extension breaking Next.js
      if (window.chrome && window.chrome.runtime) {
        const originalSend = chrome.runtime.sendMessage;
        chrome.runtime.sendMessage = function(...args) {
          try {
            return originalSend.apply(this, args);
          } catch (e) {
            if (e.message && e.message.includes("out of scope")) return Promise.resolve();
            throw e;
          }
        };
      }
      // Ensure Tailwind classes load properly
      if (document.documentElement.style) {
        document.documentElement.style.colorScheme = 'light';
      }
    `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Header />

        {/* MAIN CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}
