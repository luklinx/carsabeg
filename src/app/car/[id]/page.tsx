// src/app/car/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import WhatsAppButton from "@/components/WhatsAppButton";
import CarGallery from "@/components/CarGallery";
import SimilarCars from "@/components/SimilarCars";

// This removes the source map bug completely
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const cars: Car[] = await fetchCars();
    return cars.map((car) => ({
      id: car.id,
    }));
  } catch (error) {
    return [];
  }
}

export default async function CarDetail({
  params,
}: {
  params: { id: string };
}) {
  const cars: Car[] = await fetchCars();
  const car = cars.find((c) => c.id === params.id);

  if (!car) {
    notFound(); // This is the correct way instead of manual return
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/inventory" className="hover:text-green-600">
          Cars for Sale
        </a>{" "}
        / {car.make} {car.model}
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <CarGallery images={car.images} />

        <div>
          <h1 className="text-4xl font-bold mb-2">
            {car.year} {car.make} {car.model}
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-4xl font-bold text-green-600">
              ₦{(car.price / 1000000).toFixed(1)}M
            </p>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Negotiable
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Seller: Verified Dealer</h3>
            <p className="text-sm text-gray-600">Rating: 4.8/5 • Lagos</p>
            <WhatsAppButton car={car} />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800/70">
              Quick Specs
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Mileage</td>
                  <td className="py-2">{car.mileage.toLocaleString()} km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Transmission</td>
                  <td className="py-2">{car.transmission}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Fuel</td>
                  <td className="py-2">{car.fuel}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Condition</td>
                  <td className="py-2">{car.condition}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Location</td>
                  <td className="py-2">{car.location}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {car.description && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800/70">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>
          )}
        </div>
      </div>

      <SimilarCars currentCarId={car.id} cars={cars} />
    </div>
  );
}
