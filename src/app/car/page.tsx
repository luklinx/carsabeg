// src/app/car/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/cars";

// THESE TWO LINES ARE THE KILL SWITCH FOR CACHING
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CarDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  if (!id || id === "undefined") {
    notFound();
  }

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .single();

  if (error || !car) {
    console.log("Car not found or not approved:", id, error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-green-600 font-bold mb-8 inline-block">
          ← Back to Cars
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="relative aspect-video lg:aspect-auto">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-10 space-y-8">
            <h1 className="text-5xl font-black text-green-600">
              {car.year} {car.make} {car.model}
            </h1>
            <p className="text-4xl font-bold">₦{car.price.toLocaleString()}</p>
            <p className="text-2xl">
              {car.condition} • {car.location}
            </p>

            <a
              href={`https://wa.me/234${car.dealer_phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-black text-2xl"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
