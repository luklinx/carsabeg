// src/app/sell/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/cars";

export default function SellCarPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("car-images") // ← CREATE THIS BUCKET IN SUPABASE
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("car-images").getPublicUrl(filePath);

      urls.push(publicUrl);
    }

    setUploading(false);
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const imageFiles = (
      e.currentTarget.elements.namedItem("images") as HTMLInputElement
    ).files;

    let uploadedImages: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      uploadedImages = await uploadImages(imageFiles);
    }

    const carData = {
      year: Number(formData.get("year")),
      make: formData.get("make"),
      model: formData.get("model"),
      price: Number(formData.get("price")),
      condition: formData.get("condition"),
      location: formData.get("location"),
      mileage: Number(formData.get("mileage")),
      transmission: formData.get("transmission"),
      fuel: formData.get("fuel"),
      description: formData.get("description") || null,
      dealer_name: formData.get("dealer_name") || null,
      dealer_phone: formData.get("dealer_phone") || null,
      images: uploadedImages,
      featured_paid: false,
      approved: false,
    };

    const { error } = await supabase.from("cars").insert(carData);

    if (error) {
      console.error("Submit error:", error);
      alert(`Error: ${error.message}`);
    } else {
      setSuccess(true);
      e.currentTarget.reset();
      setImageUrls([]);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-black text-green-600 mb-8">SUCCESS!</h1>
          <p className="text-3xl font-black text-gray-800 mb-6">
            Car submitted!
          </p>
          <p className="text-xl text-gray-600 mb-12">
            We’ll approve it in 24hrs. You’ll get a WhatsApp when live!
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-green-600 mb-4">
            SELL YOUR CAR
          </h1>
          <p className="text-2xl text-gray-700">
            List in 2 mins • First 3 FREE • Premium: ₦50,000
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-10 space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <input
              name="year"
              type="number"
              placeholder="Year"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="make"
              placeholder="Make (Toyota)"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="model"
              placeholder="Model (Camry)"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="price"
              type="number"
              placeholder="Price (₦)"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <select
              name="condition"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            >
              <option value="">Condition</option>
              <option>Foreign Used</option>
              <option>Nigerian Used</option>
            </select>
            <input
              name="location"
              placeholder="Location"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="mileage"
              type="number"
              placeholder="Mileage (km)"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="transmission"
              placeholder="Transmission"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="fuel"
              placeholder="Fuel"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="dealer_name"
              placeholder="Your Name"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
            <input
              name="dealer_phone"
              placeholder="WhatsApp Number"
              required
              className="p-5 border-2 rounded-2xl text-xl font-bold"
            />
          </div>

          <textarea
            name="description"
            rows={4}
            placeholder="Description (optional)"
            className="w-full p-6 border-2 rounded-2xl text-xl"
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-2xl font-black text-gray-800 mb-4">
              Upload Photos (up to 6)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              required
              disabled={uploading}
              className="w-full p-4 border-2 border-dashed border-gray-400 rounded-2xl text-lg file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-green-600 file:text-white file:font-black"
            />
            {uploading && (
              <p className="text-green-600 font-bold mt-4">
                Uploading images...
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-8 rounded-3xl font-black text-4xl shadow-2xl transform hover:scale-105 transition"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT CAR FOR REVIEW"}
          </button>
        </form>
      </div>
    </div>
  );
}
