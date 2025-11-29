// src/lib/cars.ts
import { Car } from "@/types";

let cache: Car[] | null = null;
let cacheTime = 0;

function loadCars(): Car[] {
  if (typeof window === "undefined") return [];

  if (cache && Date.now() - cacheTime < 1000) return cache;

  try {
    const saved = localStorage.getItem("cars");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cache = parsed as Car[];
        cacheTime = Date.now();
        return cache;
      }
    }
  } catch (e) {
    console.error("Load cars failed", e);
  }

  cache = [];
  cacheTime = Date.now();
  return [];
}

// ALL CARS — PAID FIRST → LATEST FIRST
export function getCars(): Car[] {
  const cars = loadCars();

  return [...cars].sort((a, b) => {
    // 1. PAID = always on top
    if (a.featuredPaid && !b.featuredPaid) return -1;
    if (!a.featuredPaid && b.featuredPaid) return 1;

    // 2. Newest first (higher ID = newer)
    return Number(b.id) - Number(a.id);
  });
}

// ONLY PAID CARS — for Featured section
export function getPaidFeaturedCars(): Car[] {
  return loadCars()
    .filter((car) => car.featuredPaid)
    .sort((a, b) => Number(b.id) - Number(a.id)); // newest paid first
}

// Count free (non-paid) listings — for 3 free slots
export function getFreeCarCount(): number {
  return loadCars().filter((car) => !car.featuredPaid).length;
}
