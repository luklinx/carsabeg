// src/app/car/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/cars";

interface Props {
  params: {
    id: string;
  };
}

export default async function CarDetails({ params }: Props) {
  // This is the FIX — decode UUID if Next.js mangled it
  const carId = decodeURIComponent(params.id);

  if (!carId || carId === "undefined") {
    notFound();
  }

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", carId)
    .eq("approved", true)
    .single();

  if (error || !car) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-green-600 font-bold hover:underline"
        >
          ← Back to All Cars
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* MAIN IMAGE */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-screen lg:max-h-screen">
            <Image
              src={car.images[0] || "/placeholder.jpg"}
              alt={`${car.year} ${car.make} ${car.model}`}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="p-8 lg:p-12 space-y-8 overflow-y-auto max-h-screen">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-green-600">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-4xl lg:text-5xl font-black text-gray-800 mt-4">
                ₦{Number(car.price).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <span className="font-bold text-gray-600">Condition:</span>{" "}
                <span className="block text-xl">{car.condition}</span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Location:</span>{" "}
                <span className="block text-xl">{car.location}</span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Mileage:</span>{" "}
                <span className="block text-xl">
                  {car.mileage?.toLocaleString() || "N/A"} km
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Transmission:</span>{" "}
                <span className="block text-xl">
                  {car.transmission || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-600">Fuel Type:</span>{" "}
                <span className="block text-xl">{car.fuel || "N/A"}</span>
              </div>
            </div>

            {car.description && (
              <div>
                <h3 className="text-2xl font-bold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            )}

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/234${car.dealer_phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-black text-2xl shadow-xl transform hover:scale-105 transition"
            >
              Chat Seller on WhatsApp
            </a>

            <p className="text-center text-gray-600">
              Seller: <span className="font-bold">{car.dealer_name}</span> •{" "}
              {car.dealer_phone}
            </p>

            {/* Extra Images */}
            {car.images?.length > 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">More Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {car.images.slice(1).map((img: string, i: number) => (
                    <Image
                      key={i}
                      src={img}
                      alt="Extra photo"
                      width={400}
                      height={300}
                      className="rounded-xl object-cover shadow-lg hover:shadow-2xl transition cursor-pointer"
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
