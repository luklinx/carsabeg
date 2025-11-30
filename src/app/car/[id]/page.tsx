// src/app/car/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/cars";
import { notFound } from "next/navigation";

export default async function CarDetails({
  params,
}: {
  params: { id: string };
}) {
  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", params.id)
    .eq("approved", true)
    .single();

  // If no car or not approved → 404
  if (!car || error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-green-600 font-bold hover:underline mb-8 inline-block"
        >
          ← Back to Homepage
        </Link>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* MAIN IMAGE */}
          <div>
            {car.images && car.images[0] ? (
              <Image
                src={car.images[0]}
                alt={`${car.year} ${car.make} ${car.model}`}
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <p className="text-gray-500 text-xl">No image</p>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="p-10 space-y-8">
            <div>
              <h1 className="text-5xl font-black text-green-600">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-4xl font-bold text-gray-800 mt-4">
                ₦{Number(car.price).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <span className="font-bold text-gray-600">Condition:</span>
                <p className="text-xl">{car.condition}</p>
              </div>
              <div>
                <span className="font-bold text-gray-600">Location:</span>
                <p className="text-xl">{car.location}</p>
              </div>
              <div>
                <span className="font-bold text-gray-600">Mileage:</span>
                <p className="text-xl">
                  {car.mileage?.toLocaleString() || "N/A"} km
                </p>
              </div>
              <div>
                <span className="font-bold text-gray-600">Transmission:</span>
                <p className="text-xl">{car.transmission || "N/A"}</p>
              </div>
              <div>
                <span className="font-bold text-gray-600">Fuel:</span>
                <p className="text-xl">{car.fuel || "N/A"}</p>
              </div>
            </div>

            {car.description && (
              <div>
                <h3 className="text-2xl font-bold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            <div className="pt-8">
              <a
                href={`https://wa.me/234${car.dealer_phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-black text-2xl transition transform hover:scale-105"
              >
                Chat Seller on WhatsApp
              </a>
              <p className="text-center mt-4 text-gray-600">
                Contact: {car.dealer_name} • {car.dealer_phone}
              </p>
            </div>

            {/* THUMBNAILS */}
            {car.images && car.images.length > 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">More Photos</h3>
                <div className="grid grid-cols-4 gap-4">
                  {car.images.slice(1).map((img: string, i: number) => (
                    <Image
                      key={i}
                      src={img}
                      alt="Extra"
                      width={300}
                      height={200}
                      className="rounded-xl object-cover shadow-md hover:shadow-xl transition cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
