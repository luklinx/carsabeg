// src/app/inventory/page.tsx
import { Suspense } from "react";
import InventoryClient from "./InventoryClient";
import { fetchCars } from "@/services/api";

export const revalidate = 60; // Optional: revalidate every minute

export default async function InventoryPage() {
  const cars = await fetchCars();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* This Suspense is REQUIRED at page level */}
      <Suspense fallback={<LoadingSkeleton />}>
        <InventoryClient initialCars={cars} />
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-6 py-20 text-center">
      <div className="text-3xl font-bold animate-pulse">Loading cars...</div>
    </div>
  );
}
