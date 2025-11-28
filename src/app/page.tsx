// src/app/page.tsx
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
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-28">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Cars <span className="text-yellow-400">Abeg!</span>
            <br />
            No Wahala
          </h1>
          <p className="text-2xl md:text-3xl mb-12 font-bold">
            Clean Tokunbo & Nigerian Used Cars • Best Prices in Nigeria
          </p>
          <a
            href="https://wa.me/2348123456789?text=Hello%20Cars%20Abeg!%20I%20saw%20your%20site%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-14 py-7 rounded-full text-3xl font-black transition shadow-2xl transform hover:scale-105"
          >
            Chat on WhatsApp Now
          </a>
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
