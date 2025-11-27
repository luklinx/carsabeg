// src/app/sell/page.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface UploadedImage {
  file: File;
  preview: string;
}

export default function SellYourCar() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    price: "",
    condition: "Nigerian Used",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 8) return alert("Max 8 photos");
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert("Upload at least 1 photo");

    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));

    const newCar = {
      id: Date.now().toString(),
      ...form,
      price: Number(form.price.replace(/[^0-9]/g, "")),
      images: images.map((i) => i.preview),
      featured: true,
      dateAdded: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("userListedCars") || "[]");
    existing.unshift(newCar);
    localStorage.setItem("userListedCars", JSON.stringify(existing));

    setSuccess(true);
    setSubmitting(false);

    const msg = `NEW LISTING!\n${form.name}\n${form.phone}\n${form.year} ${form.make} ${form.model} - ₦${form.price}`;
    window.open(
      `https://wa.me/2348123456789?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <h1 className="text-6xl font-black text-green-700 mb-6">
            Car Posted Successfully!
          </h1>
          <p className="text-3xl text-gray-800 mb-8">Buyers can see it now</p>
          <Link
            href="/"
            className="bg-green-600 text-white px-12 py-6 rounded-full text-2xl font-bold hover:bg-green-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Sell Your Car in 60 Seconds
          </h1>
          <p className="text-2xl text-gray-800 font-semibold">
            Free • Instant • Photos Required
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-10"
        >
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-2xl font-black text-gray-900 mb-6">
              Upload Car Photos <span className="text-red-600">*</span> (max 8)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <Image
                    src={img.preview}
                    alt="preview"
                    width={200}
                    height={200}
                    className="rounded-xl object-cover h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition font-bold"
                  >
                    X
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <label className="border-4 border-dashed border-gray-400 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition bg-gray-50">
                  <span className="text-5xl font-bold text-gray-600">+</span>
                  <span className="text-lg font-bold text-gray-700">
                    Add Photos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* FORM INPUTS — DARK, BOLD, UNMISSABLE */}
          <div className="grid md:grid-cols-2 gap-8 text-xl">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp Number *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
            <input
              type="text"
              required
              placeholder="Make (e.g. Toyota) *"
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
            <input
              type="text"
              required
              placeholder="Model (e.g. Camry) *"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
            <input
              type="text"
              required
              placeholder="Year *"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
            <input
              type="text"
              required
              placeholder="Asking Price (₦) *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl font-bold text-gray-900 placeholder-gray-600 focus:border-green-600 focus:outline-none transition"
            />
          </div>

          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="w-full px-6 py-5 border-2 border-gray-800 rounded-2xl text-xl font-bold text-gray-900 focus:border-green-600 focus:outline-none"
          >
            <option>Nigerian Used</option>
            <option>Foreign Used</option>
          </select>

          <button
            type="submit"
            disabled={submitting || images.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-black text-3xl py-7 rounded-2xl transition shadow-2xl"
          >
            {submitting ? "Posting Your Car..." : "POST CAR & GO LIVE NOW"}
          </button>
        </form>
      </div>
    </div>
  );
}
