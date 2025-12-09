// src/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient"; // ← THIS WAS MISSING

interface ProfileFormProps {
  user: {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    photo_url?: string | null;
    [key: string]: any;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [photoUrl, setPhotoUrl] = useState(user.photo_url || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) {
      setMessage("No file selected or user not found");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `profiles/${user.id}/${fileName}`;

      const { data, error } = await supabaseBrowser.storage
        .from("carsabeg-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabaseBrowser.storage
        .from("carsabeg-uploads")
        .getPublicUrl(filePath);

      const newPhotoUrl = urlData.publicUrl;
      setPhotoUrl(newPhotoUrl);
      setMessage("Profile photo updated successfully!");

      // Optional: Update user's photo_url in DB
      // await supabaseBrowser.from("users").update({ photo_url: newPhotoUrl }).eq("id", user.id);
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Profile Settings</h2>

        {/* Profile Photo */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Photo</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-8 border-green-600 shadow-2xl">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-6xl font-black text-gray-500">
                    {user.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className={`inline-block px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
                  uploading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                }`}>
                  {uploading ? "Uploading..." : "Change Photo"}
                </div>
              </label>
              <p className="text-sm text-gray-600 mt-4">
                JPG, PNG, GIF up to 5MB · Recommended: 400×400px
              </p>
            </div>
          </div>

          {/* Upload Status */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg border ${
              message.includes("success")
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none text-lg"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Email Address</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-600 text-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none text-lg"
              placeholder="+234 901 883 7909"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-12">
          <button className="w-full bg-black hover:bg-gray-900 text-white py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:scale-105">
            SAVE PROFILE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}