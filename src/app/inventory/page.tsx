// src/app/inventory/page.tsx
import { Suspense } from "react";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import InventoryFilters from "@/components/InventoryFilters";

export const revalidate = 60;

export default async function Inventory() {
  const cars: Car[] = await fetchCars();

  return (
    <>
      <Suspense
        fallback={
          <div className="py-20 text-center text-xl">Loading filters...</div>
        }
      >
        <InventoryFilters initialCars={cars} />
      </Suspense>
    </>
  );
}
