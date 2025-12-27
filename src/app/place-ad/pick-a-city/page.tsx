"use client";

import Link from "next/link";
import { useState } from "react";

export default function PickCity() {
  const [city, setCity] = useState("Dubai");
  const cities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Where is your car located?</h1>
        <div className="grid grid-cols-2 gap-4">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`p-4 border rounded text-left ${city === c ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="font-bold">{c}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href={`/place-ad/pick-a-category?city=${encodeURIComponent(city)}`} className="bg-green-600 text-white px-6 py-2 rounded">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}
