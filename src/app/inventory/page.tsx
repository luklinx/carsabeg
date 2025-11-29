// src/app/inventory/page.tsx
"use client";

import { Suspense } from "react";
import InventoryClient from "./InventoryClient"; // ← We'll move the logic here

// This tiny wrapper satisfies Next.js
function InventoryContent() {
  return <InventoryClient />;
}

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* THIS SUSPENSE IS REQUIRED — FIXES THE ERROR */}
      <Suspense fallback={<LoadingSkeleton />}>
        <InventoryContent />
      </Suspense>
    </div>
  );
}

// Beautiful loading state
function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-6 py-32 text-center">
      <div className="text-5xl font-black text-green-600 animate-pulse">
        LOADING INVENTORY...
      </div>
      <p className="text-xl text-gray-600 mt-6">Fetching the latest cars</p>
    </div>
  );
}
