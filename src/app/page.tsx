// src/app/page.tsx
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import FeaturedSection from "@/components/FeaturedSection";

export const revalidate = 60;

export default async function Home() {
  const cars: Car[] = await fetchCars();
  const featured = cars.filter((car) => car.featured);

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-28">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Cars <span className="text-yellow-400">Abeg!</span>
            <br />
            No Wahala
          </h1>
          <p className="text-2xl md:text-3xl mb-12">
            Clean Tokunbo & Nigerian Used Cars • Best Prices
          </p>
          <a
            href="https://wa.me/2348123456789?text=Hello%20Cars%20Abeg!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 text-black px-12 py-6 rounded-full text-2xl font-bold hover:bg-yellow-300 transition shadow-2xl"
          >
            Chat on WhatsApp Now
          </a>
        </div>
      </section>

      {/* FILTER BAR — Client-side only */}
      <FeaturedSection initialCars={cars} initialFeatured={featured} />
    </>
  );
}
