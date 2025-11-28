// src/app/car/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCars } from "@/services/api";
// import { Car } from "@/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import CarGallery from "@/components/CarGallery";
import SimilarCars from "@/components/SimilarCars";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const cars = await fetchCars();
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cars = await fetchCars();
  const car = cars.find((c) => c.id === id);

  if (!car) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl">
        {/* Breadcrumb – Bold & Clear */}
        <nav className="mb-8">
          <Link
            href="/"
            className="text-xl font-black text-green-600 hover:underline"
          >
            ← Home
          </Link>
          <span className="mx-3 text-gray-500 font-bold">/</span>
          <span className="text-xl font-black text-gray-900">
            {car.year} {car.make} {car.model}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Gallery */}
          <div className="order-2 lg:order-1">
            <CarGallery images={car.images} />
          </div>

          {/* Details */}
          <div className="order-1 lg:order-2">
            {/* Title & Price */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-5xl md:text-7xl font-black text-green-600 mb-8">
              ₦{(car.price / 1000000).toFixed(1)}M
            </p>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl mb-10">
              <p className="text-2xl font-black mb-4">
                Ready to Buy? Chat Now!
              </p>
              <WhatsAppButton car={car} />
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                {
                  label: "Mileage",
                  value: `${car.mileage.toLocaleString()} km`,
                },
                { label: "Condition", value: car.condition },
                {
                  label: "Transmission",
                  value: car.transmission || "Automatic",
                },
                { label: "Fuel Type", value: car.fuel || "Petrol" },
                { label: "Location", value: car.location || "Lagos" },
                { label: "Year", value: car.year },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border-2 border-gray-800 rounded-2xl p-6 shadow-lg"
                >
                  <p className="text-sm md:text-base text-gray-600 font-bold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-gray-50 rounded-3xl p-8 shadow-xl">
                <h3 className="text-3xl font-black mb-6 text-gray-900">
                  Description
                </h3>
                <p className="text-xl leading-relaxed text-gray-800 whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            {/* Extra Badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              {car.featured && (
                <span className="bg-yellow-400 text-black px-6 py-3 rounded-full text-lg font-black shadow-lg">
                  Featured
                </span>
              )}
              {car.condition === "Foreign Used" && (
                <span className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-black shadow-lg">
                  Tokunbo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        <section className="mt-32">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-gray-900">
            Similar Clean Rides
          </h2>
          <SimilarCars currentCarId={car.id} cars={cars} />
        </section>
      </div>
    </div>
  );
}
