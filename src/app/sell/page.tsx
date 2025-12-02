// src/app/sell/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Flame,
  Zap,
  ShieldCheck,
  Phone,
  Camera,
  X,
} from "lucide-react";
// import Logo from "@/components/Logo";

export default function SellCarPage() {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImages, setPreviewImages] = useState<
    { url: string; file: File }[]
  >([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews = Array.from(files)
      .slice(0, 12)
      .map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
    setPreviewImages(newPreviews);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const filePath = fileName;

      const { error } = await supabaseBrowser.storage
        .from("car_images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Upload failed:", error);
        continue;
      }

      const { data: urlData } = supabaseBrowser.storage
        .from("car_images")
        .getPublicUrl(filePath);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const imageFiles = previewImages.map((p) => p.file);

    if (imageFiles.length === 0) {
      setErrorMsg("Please upload at least 1 photo");
      setSubmitting(false);
      return;
    }

    setUploading(true);
    const uploadedUrls = await uploadImages(imageFiles);
    setUploading(false);

    if (uploadedUrls.length === 0) {
      setErrorMsg("Image upload failed. Check your bucket permissions.");
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
      images: uploadedUrls,
      featured_paid: false,
      approved: false,
    };

    const { error } = await supabaseBrowser.from("cars").insert(carData);

    if (error) {
      console.error(error);
      setErrorMsg(error.message || "Submission failed");
    } else {
      setSuccess(true);
      e.currentTarget.reset();
      setPreviewImages([]);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-12 md:p-20 border-8 border-yellow-400">
          <Flame
            size={120}
            className="mx-auto text-orange-500 animate-pulse mb-8"
          />
          <CheckCircle className="w-40 h-40 text-green-600 mx-auto mb-8" />
          <h1 className="text-6xl md:text-3xl font-black text-green-600 mb-8">
            DONE!
          </h1>
          <p className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
            Your car is LIVE in minutes!
          </p>
          <p className="text-2xl md:text-4xl font-bold text-gray-700 mb-12">
            We’re reviewing now • WhatsApp alert coming in 1–24hrs
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition"
            >
              Back Home
            </Link>
            <a
              href="https://wa.me/23480022772234"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition"
            >
              Chat Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* HERO */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* <Logo size="xl" className="mx-auto mb-10" /> */}
          <h1 className="text-3xl md:text-3xl font-black mb-8 drop-shadow-2xl">
            SELL YOUR CAR <span className="text-yellow-400">TODAY</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-2xl md:text-4xl font-black">
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full">
              FREE Listing
            </div>
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full">
              10,000+ Buyers
            </div>
            <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-full">
              Sold in Days
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 -mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-3xl overflow-hidden border-4 border-green-600"
        >
          <div className="p-8 md:p-12 lg:p-16 space-y-12">
            {/* ERROR */}
            {errorMsg && (
              <div className="bg-red-50 border-4 border-red-500 text-red-700 px-8 py-6 rounded-3xl flex items-center gap-4 text-xl font-black">
                <AlertCircle size={48} />
                {errorMsg}
              </div>
            )}

            {/* CAR DETAILS GRID — MOBILE FRIENDLY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "year", placeholder: "Year e.g 2018", type: "number" },
                { name: "make", placeholder: "Make e.g Toyota" },
                { name: "model", placeholder: "Model e.g Camry" },
                { name: "price", placeholder: "Price (₦)", type: "number" },
                {
                  name: "condition",
                  type: "select",
                  options: ["Foreign Used", "Nigerian Used", "Brand New"],
                },
                { name: "location", placeholder: "Location e.g Lagos" },
                {
                  name: "mileage",
                  placeholder: "Mileage (optional)",
                  type: "number",
                },
                { name: "transmission", placeholder: "Transmission" },
                { name: "fuel", placeholder: "Fuel Type" },
              ].map((field) => (
                <div key={field.name}>
                  {field.type === "select" ? (
                    <select
                      required
                      name={field.name}
                      className="w-full p-6 border-4 border-gray-300 rounded-3xl text-xl font-black focus:border-green-600 outline-none transition"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required
                      name={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="w-full p-6 border-4 border-gray-300 rounded-3xl text-xl font-black placeholder-gray-500 focus:border-green-600 outline-none transition"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* CONTACT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                required
                name="dealer_name"
                placeholder="Your Full Name"
                className="p-6 border-4 border-gray-300 rounded-3xl text-xl font-black focus:border-green-600"
              />
              <input
                required
                name="dealer_phone"
                placeholder="WhatsApp Number"
                className="p-6 border-4 border-gray-300 rounded-3xl text-xl font-black focus:border-green-600"
              />
            </div>

            <textarea
              name="description"
              rows={6}
              placeholder="Extra details: accident history, upgrades, etc... (optional but helps sell faster)"
              className="w-full p-8 border-4 border-gray-300 rounded-3xl text-xl resize-none focus:border-green-600 outline-none"
            />

            {/* IMAGE UPLOAD — KILLER UX */}
            <div>
              <label className="block text-3xl md:text-4xl font-black text-gray-900 mb-8 flex items-center gap-4">
                <Camera size={48} className="text-green-600" />
                Upload Photos <span className="text-green-600">(Max 12)</span>
              </label>

              <div className="relative border-8 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-green-600 transition cursor-pointer">
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
                <Upload size={80} className="mx-auto mb-6 text-gray-400" />
                <p className="text-2xl md:text-3xl font-black text-gray-700">
                  Tap to add photos
                </p>
                <p className="text-lg text-gray-500 mt-3">
                  First photo becomes main image
                </p>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-10">
                  <p className="text-xl font-black mb-6">
                    {previewImages.length} photos selected
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {previewImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <Image
                          src={img.url}
                          alt=""
                          width={400}
                          height={300}
                          className="w-full h-40 object-cover rounded-2xl shadow-xl"
                        />
                        {i === 0 && (
                          <div className="absolute top-3 left-3 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm shadow-xl">
                            MAIN PHOTO
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-3 right-3 bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(uploading || submitting) && (
                <div className="text-center py-12">
                  <Loader2
                    size={80}
                    className="mx-auto animate-spin text-green-600"
                  />
                  <p className="text-3xl font-black text-green-600 mt-8">
                    {uploading
                      ? "Uploading your photos..."
                      : "Submitting your car..."}
                  </p>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON — IMPOSSIBLE TO MISS */}
            <button
              type="submit"
              disabled={submitting || uploading || previewImages.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 text-white py-10 rounded-3xl font-black text-4xl md:text-6xl shadow-3xl transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center gap-6"
            >
              {submitting || uploading ? (
                <>PLEASE WAIT...</>
              ) : (
                <>
                  <Zap size={64} className="animate-pulse" />
                  SUBMIT CAR NOW — FREE!
                </>
              )}
            </button>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-12 border-t-4 border-gray-200">
              <div>
                <ShieldCheck
                  size={64}
                  className="mx-auto text-green-600 mb-4"
                />
                <p className="text-2xl font-black">100% Safe</p>
              </div>
              <div>
                <Phone size={64} className="mx-auto text-green-600 mb-4" />
                <p className="text-2xl font-black">Direct Buyer Calls</p>
              </div>
              <div>
                <Flame size={64} className="mx-auto text-orange-500 mb-4" />
                <p className="text-2xl font-black">Sell in Days</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
