// src/app/sell/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getFreeCarCount, getCars } from "@/lib/cars";

export default function SellCarPage() {
  const freeSlotsLeft = Math.max(0, 3 - getFreeCarCount());
  const isFree = freeSlotsLeft > 0;

  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    condition: "Nigerian Used",
    location: "Lagos",
    description: "",
    name: "",
    phone: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.make ||
      !form.model ||
      !form.year ||
      !form.price ||
      !form.name ||
      !form.phone ||
      images.length === 0
    ) {
      alert(
        "Please complete all required fields and upload at least one photo"
      );
      return;
    }

    const newCar = {
      id: Date.now().toString(),
      make: form.make.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage) || 0,
      condition: form.condition as "Foreign Used" | "Nigerian Used",
      images: images.length > 0 ? images : ["/placeholder.jpg"],
      location: form.location,
      description: form.description.trim() || undefined,
      featured: !isFree,
      featuredPaid: !isFree,
      dealerName: form.name.trim(),
      dealerPhone: form.phone.trim(),
    };

    const current = getCars();
    localStorage.setItem("cars", JSON.stringify([...current, newCar]));

    alert(
      isFree
        ? `FREE LISTING SUCCESSFUL! ${freeSlotsLeft - 1} free slot${
            freeSlotsLeft - 1 === 1 ? "" : "s"
          } left.`
        : "₦50,000 PREMIUM LISTING ACTIVATED — Your car is now at the top!"
    );
    window.location.href = "/inventory";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dubizzle-style Top Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-green-600">Post Your Ad</h1>
          <div className="text-sm text-gray-600">
            {isFree ? (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                FREE • {freeSlotsLeft} slot{freeSlotsLeft > 1 ? "s" : ""} left
              </span>
            ) : (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-black">
                PREMIUM — ₦50,000 for 30 days
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* PHOTOS — DUBIZZLE GRID STYLE */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-black mb-6">Photos (max 10)</h2>
            <div className="grid grid-cols-4 gap-4">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-300"
                >
                  <Image src={src} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label className="aspect-square border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-600 transition">
                  <span className="text-4xl text-gray-400">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              First photo will be the main image
            </p>
          </section>

          {/* DETAILS */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
            <h2 className="text-2xl font-black">Car Details</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  required
                  value={form.make}
                  onChange={(e) => setForm({ ...form, make: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="Toyota"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="Camry"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  required
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="2018"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Price (₦) *
                </label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="8500000"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={(e) =>
                    setForm({ ...form, mileage: e.target.value })
                  }
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="85000"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    setForm({ ...form, condition: e.target.value })
                  }
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                >
                  <option>Foreign Used</option>
                  <option>Nigerian Used</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-2">
                  Location *
                </label>
                <select
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                >
                  <option value="">Select City</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Ibadan">Ibadan</option>
                  <option value="Kano">Kano</option>
                  {/* Add more */}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
                  placeholder="Clean title, accident-free, full options..."
                />
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-2xl font-black">Contact Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                required
                placeholder="Your Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
              />
              <input
                required
                placeholder="WhatsApp Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-5 py-4 border-2 border-gray-300 rounded-lg focus:border-green-600 outline-none text-lg"
              />
            </div>
          </section>

          {/* SUBMIT — DUBIZZLE GREEN BUTTON */}
          <div className="text-center">
            <button
              type="submit"
              className={`px-16 py-6 text-2xl font-black rounded-xl shadow-xl transform hover:scale-105 transition ${
                isFree
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black"
              }`}
            >
              {isFree
                ? `POST AD FOR FREE (${freeSlotsLeft} LEFT)`
                : "POST PREMIUM AD — ₦50,000"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
