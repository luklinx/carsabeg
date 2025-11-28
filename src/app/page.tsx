// src/app/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import FeaturedSection from "@/components/FeaturedSection";

export const revalidate = 60;

export default async function Home() {
  const cars: Car[] = await fetchCars();

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-20 md:py-32 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Cars <span className="text-yellow-400">Abeg!</span>
            <br className="md:hidden" /> No Wahala
          </h1>
          <p className="text-xl md:text-3xl mb-10 font-bold">
            Clean Cars • Real Prices • Instant Buyers
          </p>
          <Link
            href="https://wa.me/2348123456789"
            className="inline-block bg-yellow-400 text-black px-10 py-5 rounded-full text-2xl md:text-3xl font-black"
          >
            Chat Now
          </Link>
        </div>
      </section>

      {/* FEATURED CARS + FILTERS FILTERS – Fully client-side */}
      <Suspense
        fallback={
          <div className="py-32 text-center text-3xl font-bold">
            Loading cars...
          </div>
        }
      >
        <FeaturedSection initialCars={cars} />
      </Suspense>
    </>
  );
}
