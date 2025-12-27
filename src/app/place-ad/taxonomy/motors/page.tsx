"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function MotorsTaxonomy() {
  const searchParams = useSearchParams();
  const city = searchParams?.get("city") || "Dubai";

  const subs = [
    { id: "used-cars", name: "Used Cars" },
    { id: "motorcycles", name: "Motorcycles" },
    { id: "trucks", name: "Trucks" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Motors</h1>
        <p className="text-sm text-gray-600 mb-4">City: {city}</p>

        <div className="grid grid-cols-2 gap-4">
          {subs.map((s) => (
            <Link
              key={s.id}
              href={`/place-ad/motors/${s.id}/new?city=${encodeURIComponent(city)}&tx_id=${uuidv4()}`}
              className="p-4 border rounded block"
            >
              <div className="font-bold">{s.name}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href={`/place-ad/pick-a-category?city=${encodeURIComponent(city)}`} className="px-4 py-2 border rounded mr-2">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
