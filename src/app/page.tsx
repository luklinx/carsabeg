// src/app/page.tsx
import CarCard from "@/components/CarCard";
import { fetchCars } from "@/services/api";

export const revalidate = 60;

export default async function Home() {
  // 1. FETCH CARS FIRST
  const cars = await fetchCars();

  // 2. THEN DO FILTERING
  const searchParams = new URLSearchParams();
  const make = searchParams.get("make") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const filtered = cars.filter((car: any) => {
    if (make && car.make.toLowerCase() !== make.toLowerCase()) return false;
    if (minPrice && car.price < Number(minPrice)) return false;
    if (maxPrice && car.price > Number(maxPrice)) return false;
    return true;
  });

  const featured = filtered.filter((car: any) => car.featured);

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cars <span className="text-yellow-400">Abeg!</span> No Wahala
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Clean foreign used & Nigerian used cars at the best prices
          </p>
          <a
            href="https://wa.me/2348123456789?text=Hello%20Cars%20Abeg!"
            className="bg-yellow-400 text-black px-10 py-5 rounded-full text-xl font-bold hover:bg-yellow-300 transition inline-flex items-center gap-3"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="make" className="p-3 border rounded-lg">
              <option value="">All Makes</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Mercedes</option>
            </select>
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₦)"
              className="p-3 border rounded-lg"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₦)"
              className="p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-green-600 text-white p-3 rounded-lg font-bold"
            >
              Filter
            </button>
          </form>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Rides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.length > 0 ? (
              featured.map((car: any) => <CarCard key={car.id} car={car} />)
            ) : (
              <p className="text-center col-span-full text-gray-600">
                No cars match your filter.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
