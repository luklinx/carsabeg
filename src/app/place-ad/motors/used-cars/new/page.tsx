"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewUsedCar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const city = searchParams?.get("city") || "Dubai";
  const tx_id = searchParams?.get("tx_id") || "";
  const [condition, setCondition] = useState("used");

  const handleContinue = () => {
    // Redirect to the main /sell page with initial params
    const params = new URLSearchParams();
    params.set("city", city);
    params.set("tx_id", tx_id);
    params.set("condition", condition);
    router.push(`/sell?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">New Listing — Used Cars</h1>
        <p className="text-sm text-gray-600 mb-4">City: {city}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1 block w-full border rounded p-2">
            <option value="used">Used</option>
            <option value="new">New</option>
            <option value="certified">Certified</option>
          </select>
        </div>

        <div className="flex justify-between">
          <Link href={`/place-ad/taxonomy/motors?city=${encodeURIComponent(city)}`} className="px-4 py-2 border rounded">Back</Link>
          <button type="button" onClick={handleContinue} className="bg-green-600 text-white px-6 py-2 rounded">Create Listing</button>
        </div>
      </div>
    </div>
  );
}
