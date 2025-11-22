// src/app/sell/page.tsx
"use client";
import { useState } from "react";
import { Car } from "@/types";

export default function SellYourCar() {
  const [form, setForm] = useState<Partial<Car>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit — in real, POST to API
    alert(
      "Ad posted! Share link: https://carsabeg.vercel.app/car/" + Date.now()
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800/70 mb-8 text-center">
        Sell Your Car
      </h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <input
          placeholder="Make"
          value={form.make || ""}
          onChange={(e) => setForm({ ...form, make: e.target.value })}
          className="w-full p-4 border rounded-lg"
        />
        <input
          placeholder="Model"
          value={form.model || ""}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          className="w-full p-4 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year || ""}
          onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          className="w-full p-4 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full p-4 border rounded-lg"
        />
        <input
          type="number"
          placeholder="Mileage"
          value={form.mileage || ""}
          onChange={(e) =>
            setForm({ ...form, mileage: Number(e.target.value) })
          }
          className="w-full p-4 border rounded-lg"
        />
        <textarea
          placeholder="Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-4 border rounded-lg h-32"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setForm({
              ...form,
              images: Array.from(e.target.files || []).map((f) =>
                URL.createObjectURL(f)
              ),
            })
          }
          className="w-full p-4 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-xl"
        >
          Post Ad for Free
        </button>
      </form>
    </div>
  );
}
