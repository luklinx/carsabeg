// src/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs"; // Already correct
import Image from "next/image";

export default function ProfileForm() {
  const { user } = useUser(); // Now works with ClerkProvider
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      setMessage("No file or user not logged in");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;
      const filePath = `profiles/${user.id}/${fileName}`;

      const { data, error } = await supabaseBrowser.storage
        .from("carsabeg-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabaseBrowser.storage
        .from("carsabeg-uploads")
        .getPublicUrl(filePath);

      setPhotoUrl(publicUrl);
      setMessage("Profile photo uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-black text-gray-900 mb-8">
        Profile Settings
      </h2>
      <div className="mb-8">
        <p className="text-lg font-bold text-gray-700 mb-4">Profile Photo</p>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-600 shadow-xl">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-4xl">?</span>
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                disabled={uploading}
                className="hidden"
              />
              <div className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all hover:scale-105 shadow-lg">
                {uploading ? "Uploading..." : "Choose Photo"}
              </div>
            </label>
            <p className="text-sm text-gray-600 mt-3">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>
      {message && (
        <div
          className={`p-4 rounded-xl text-center font-bold text-lg ${
            message.includes("success")
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}
      <div className="mt-12">
        <button className="w-full bg-black hover:bg-gray-900 text-white py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:scale-105">
          SAVE PROFILE
        </button>
      </div>
    </div>
  );
}
