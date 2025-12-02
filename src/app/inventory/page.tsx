// src/app/inventory/page.tsx
"use client";

import { Suspense } from "react";
import InventoryClient from "./InventoryClient";
import { Car, Zap, Shield, MessageCircle } from "lucide-react";

// MAIN CONTENT WRAPPER
function InventoryContent() {
  return <InventoryClient />;
}

// EPIC LOADING SKELETON — Nigerian Power
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 flex items-center justify-center px-6">
      <div className="text-center max-w-4xl">
        {/* Animated Logo */}
        <div className="mb-16">
          <div className="flex justify-center gap-8 mb-12">
            <Car size={100} className="text-green-600 animate-bounce" />
            <Zap size={100} className="text-yellow-400 animate-pulse" />
            <Car
              size={100}
              className="text-green-600 animate-bounce delay-150"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-3xl font-black text-green-600 mb-8 leading-none">
          LOADING FRESH CARS
        </h1>
        <p className="text-3xl md:text-3xl font-black text-gray-700 mb-12">
          From Lagos to Abuja — The Best Deals Are Coming...
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center gap-6 mb-16">
          <div className="w-12 h-12 bg-green-600 rounded-full animate-ping" />
          <div className="w-12 h-12 bg-yellow-400 rounded-full animate-ping delay-150" />
          <div className="w-12 h-12 bg-green-600 rounded-full animate-ping delay-300" />
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <Shield size={60} className="mx-auto mb-4 text-green-600" />
            <p className="text-2xl font-black text-gray-800">100% Verified</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <MessageCircle size={60} className="mx-auto mb-4 text-green-600" />
            <p className="text-2xl font-black text-gray-800">
              Direct Owner Contact
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
            <Zap size={60} className="mx-auto mb-4 text-yellow-400" />
            <p className="text-2xl font-black text-gray-800">
              Fastest Deals in Nigeria
            </p>
          </div>
        </div>

        <p className="text-xl text-gray-600 mt-16 font-bold">
          Made in Nigeria • For Nigerians • With Love
        </p>
      </div>
    </div>
  );
}

// MAIN PAGE — CLEAN & POWERFUL
export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Suspense fallback={<LoadingSkeleton />}>
        <InventoryContent />
      </Suspense>
    </div>
  );
}
