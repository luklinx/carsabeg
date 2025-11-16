"use client";
import { useState } from "react";

export default function Admin() {
  const [cars, setCars] = useState<any[]>([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    images: [""],
  });

  const addCar = () => {
    const newCar = {
      ...form,
      id: Date.now().toString(),
      featured: true,
      transmission: "automatic",
      fuel: "petrol",
      location: "Lagos",
      condition: "foreign used",
    };
    setCars([...cars, newCar]);
    localStorage.setItem("cars", JSON.stringify([...cars, newCar]));
    setForm({
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      images: [""],
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Add New Car</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Make"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            className="p-3 border"
          />
          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="p-3 border"
          />
          <input
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="p-3 border"
          />
          <input
            placeholder="Price (₦)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-3 border"
          />
          <input
            placeholder="Mileage"
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: e.target.value })}
            className="p-3 border"
          />
          <button
            onClick={addCar}
            className="col-span-2 bg-green-600 text-white p-3 rounded"
          >
            Add Car
          </button>
        </div>
      </div>
    </div>
  );
}
