// src/app/car/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import CarGallery from "@/components/CarGallery";
import SimilarCars from "@/components/SimilarCars";

export const dynamicParams = true;
export const revalidate = 60;

// Keep this — pre-renders known IDs
export async function generateStaticParams() {
  const cars = await fetchCars();
  return cars.map((car) => ({ id: car.id }));
}

// THIS IS THE ONLY CHANGE THAT MATTERS
export default async function CarDetail({
  params,
}: {
  params: Promise<{ id: string }>; // ← params is now a Promise!
}) {
  // MUST AWAIT params
  const { id } = await params;

  const cars = await fetchCars();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>{" "}
        →
        <span className="ml-2">
          {car.year} {car.make} {car.model}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <CarGallery images={car.images} />
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-4">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-5xl font-bold text-green-600 mb-8">
            ₦{(car.price / 1000000).toFixed(1)}M
          </p>

          <div className="bg-green-50 p-6 rounded-2xl mb-8">
            <p className="text-xl font-bold mb-2">Verified Dealer • Lagos</p>
            <WhatsAppButton car={car} />
          </div>

          <div className="grid grid-cols-2 gap-6 text-lg">
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-gray-500">Mileage</span>
              <p className="font-bold">{car.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-gray-500">Condition</span>
              <p className="font-bold">{car.condition}</p>
            </div>
          </div>

          {car.description && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-4xl font-bold text-center mb-12">Similar Cars</h2>
        <SimilarCars currentCarId={car.id} cars={cars} />
      </div>
    </div>
  );
}
