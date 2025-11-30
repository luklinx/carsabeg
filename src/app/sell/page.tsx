// src/app/sell/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/cars";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SellCarPage() {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    for (let i = 0; i < files.length && i < 12; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setPreviewImages(previews);
  };

  // THIS IS THE ONLY UPLOAD FUNCTION YOU NEED — 100% FIXED
  const uploadImages = async (files: FileList): Promise<string[]> => {
    const urls: string[] = [];

    for (let i = 0; i < files.length && i < 12; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;

      // NO SUBFOLDER — FLAT UPLOAD (THIS WAS THE BUG)
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from("car_images") // EXACT BUCKET NAME — CHECK YOUR SUPABASE
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload failed:", error);
        alert(`Image ${i + 1} failed: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("car_images")
        .getPublicUrl(filePath);

      urls.push(urlData.publicUrl);
      console.log("Uploaded:", urlData.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const imageFiles = (
      e.currentTarget.elements.namedItem("images") as HTMLInputElement
    ).files!;

    if (imageFiles.length === 0) {
      setErrorMsg("Please select at least 1 photo");
      setSubmitting(false);
      return;
    }

    setUploading(true);
    const uploadedUrls = await uploadImages(imageFiles);
    setUploading(false);

    if (uploadedUrls.length === 0) {
      setErrorMsg(
        "All images failed to upload. Did you make the bucket PUBLIC?"
      );
      setSubmitting(false);
      return;
    }

    const carData = {
      year: Number(formData.get("year")),
      make: String(formData.get("make")).trim(),
      model: String(formData.get("model")).trim(),
      price: Number(formData.get("price")),
      condition: String(formData.get("condition")),
      location: String(formData.get("location")).trim(),
      mileage: Number(formData.get("mileage") || 0),
      transmission: String(formData.get("transmission")).trim(),
      fuel: String(formData.get("fuel")).trim(),
      description: formData.get("description")
        ? String(formData.get("description")).trim()
        : null,
      dealer_name: String(formData.get("dealer_name")).trim(),
      dealer_phone: String(formData.get("dealer_phone")).trim(),
      images: uploadedUrls, // THIS WILL NOW BE REAL URLs, NOT []
      featured_paid: false,
      approved: false,
    };

    const { error } = await supabase.from("cars").insert(carData);

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      e.currentTarget.reset();
      setPreviewImages([]);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl bg-white rounded-3xl shadow-2xl p-16">
          <CheckCircle className="w-32 h-32 text-green-600 mx-auto mb-8" />
          <h1 className="text-6xl font-black text-green-600 mb-6">
            THANK YOU!
          </h1>
          <p className="text-3xl font-bold text-gray-800 mb-4">
            Car Submitted Successfully
          </p>
          <p className="text-xl text-gray-600 mb-12">
            We’ll approve within 24hrs — WhatsApp notification coming!
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-2xl"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-green-600 mb-4">
            SELL YOUR CAR FAST
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700">
            List in 2 minutes • First 3 FREE • Thousands of buyers
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-12 space-y-10">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            {/* ALL YOUR INPUT FIELDS — SAME AS BEFORE */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <input
                required
                name="year"
                type="number"
                placeholder="Year"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="make"
                placeholder="Make"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="model"
                placeholder="Model"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="price"
                type="number"
                placeholder="Price (₦)"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <select
                required
                name="condition"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              >
                <option value="">Condition</option>
                <option>Foreign Used</option>
                <option>Nigerian Used</option>
                <option>Brand New</option>
              </select>
              <input
                required
                name="location"
                placeholder="Location"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                name="mileage"
                type="number"
                placeholder="Mileage (km)"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="transmission"
                placeholder="Transmission"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="fuel"
                placeholder="Fuel Type"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                required
                name="dealer_name"
                placeholder="Your Name"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
              <input
                required
                name="dealer_phone"
                placeholder="WhatsApp Number"
                className="p-5 border-2 border-gray-300 rounded-2xl text-lg font-semibold focus:border-green-600 outline-none"
              />
            </div>

            <textarea
              name="description"
              rows={5}
              placeholder="Extra details (optional)..."
              className="w-full p-6 border-2 border-gray-300 rounded-2xl text-lg resize-none focus:border-green-600 outline-none"
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-2xl font-black text-gray-800 mb-6">
                Upload Photos <span className="text-green-600">(up to 12)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  required
                  disabled={uploading || submitting}
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border-4 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:border-green-600 transition cursor-pointer">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-bold text-gray-700">
                    Click or drag photos here
                  </p>
                  <p className="text-gray-500 mt-2">First photo = main image</p>
                </div>
              </div>

              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
                  {previewImages.map((src, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={src}
                        alt=""
                        width={400}
                        height={300}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-black">
                          MAIN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(uploading || submitting) && (
                <div className="mt-8 text-center">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600" />
                  <p className="mt-4 text-xl font-bold text-green-600">
                    {uploading ? "Uploading photos..." : "Submitting..."}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-8 rounded-3xl font-black text-3xl md:text-4xl shadow-2xl transition flex items-center justify-center gap-3"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="animate-spin" />
                  PLEASE WAIT...
                </>
              ) : (
                "SUBMIT CAR FOR REVIEW"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
