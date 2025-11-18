// src/app/admin/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { Car } from "@/types";

export default function Admin() {
  const [cars, setCars] = useState<Car[]>([]);

  // Form state — only strings (what the input gives us)
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "", // ← string from input
    price: "", // ← string from input
    mileage: "", // ← string from input
    description: "",
  });

  const addCar = () => {
    const newCar: Car = {
      id: Date.now().toString(),
      make: form.make,
      model: form.model,
      year: Number(form.year) || 2020, // ← convert to number
      price: Number(form.price) || 0, // ← convert to number
      mileage: Number(form.mileage) || 0, // ← convert to number
      transmission: "automatic",
      fuel: "petrol",
      location: "Lagos",
      condition: "foreign used",
      images: [""],
      featured: true,
      description: form.description || undefined,
    };

    const updated = [...cars, newCar];
    setCars(updated);
    localStorage.setItem("cars", JSON.stringify(updated));

    // Reset form
    setForm({
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      description: "",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Admin Panel
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-green-600">Add New Car</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            placeholder="Make"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Year (e.g. 2019)"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Price (₦)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Mileage"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: e.target.value })}
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-4 border rounded-lg md:col-span-2"
          />
        </div>

        <button
          onClick={addCar}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl"
        >
          Add Car to Inventory
        </button>

        {cars.length > 0 && (
          <p className="mt-6 text-center text-green-600 font-semibold">
            {cars.length} car{cars.length > 1 ? "s" : ""} added successfully!
          </p>
        )}
      </div>
    </div>
  );
}
