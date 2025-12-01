// src/app/car/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/cars";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export default async function CarDetails({
  params,
}: {
  params: { id: string };
}) {
  let id = params.id;

  // CRITICAL: Decode URL-encoded ID
  try {
    id = decodeURIComponent(id);
  } catch (e) {
    console.log("Failed to decode ID:", params.id);
    notFound();
  }

  // Log for debugging
  console.log("Attempting to fetch car with ID:", id, "Length:", id.length);

  if (!id || id.length < 10) {
    console.log("ID too short or missing:", id);
    notFound();
  }

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .single();

  if (!car || error) {
    console.log("Car not found →", {
      requestedId: id,
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details,
    });
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/"
          className="text-green-600 font-bold text-lg mb-8 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto">
            <Image
              src={car.images[0]}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-green-600">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-4xl md:text-5xl font-bold mt-4">
                ₦{Number(car.price).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                <span className="font-bold">Condition:</span> {car.condition}
              </div>
              <div>
                <span className="font-bold">Location:</span> {car.location}
              </div>
              <div>
                <span className="font-bold">Mileage:</span>{" "}
                {(car.mileage || 0).toLocaleString()} km
              </div>
              <div>
                <span className="font-bold">Transmission:</span>{" "}
                {car.transmission || "N/A"}
              </div>
            </div>

            <a
              href={`https://wa.me/234${car.dealer_phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white font-black text-2xl py-6 rounded-2xl shadow-xl"
            >
              Chat Seller on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
