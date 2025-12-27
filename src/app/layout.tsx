// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs"; // ← ADD THIS
import { ToastProvider } from "@/components/ui/ToastProvider";

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
    url: "https://carsabeg.ng",
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
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 viewport-fit=cover"
          />
          <meta httpEquiv="Cache-Control" content="public, max-age=3600" />
          <link
            rel="preconnect"
            href="https://gwoweovqllfzznmidskz.supabase.co"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://wa.me" />
        </head>
        <body
          className={`${inter.className} bg-white text-gray-900 antialiased overflow-x-hidden`}
        >
          <HomeHeader />
          <ToastProvider>
            <main className="min-h-screen w-full overflow-x-hidden">
              {children}
            </main>
          </ToastProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
