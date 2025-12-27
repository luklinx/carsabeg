"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PickCategory() {
  const searchParams = useSearchParams();
  const city = searchParams?.get("city") || "Dubai";
  const categories = [
    { id: "motors", name: "Motors" },
    { id: "properties", name: "Properties" },
    { id: "jobs", name: "Jobs" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Pick a category</h1>
        <p className="text-sm text-gray-600 mb-4">City: {city}</p>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/place-ad/taxonomy/${c.id}?city=${encodeURIComponent(city)}`}
              className="p-4 border rounded block"
            >
              <div className="font-bold">{c.name}</div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href={`/place-ad/pick-a-city`} className="px-4 py-2 border rounded mr-2">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
