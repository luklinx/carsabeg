// src/components/ProfileForm.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient";
import CustomButton from "@/components/CustomButton";

// THIS IS THE ONLY THING MISSING — THE user PROP!
interface ProfileFormProps {
  user?: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    profile_photo_url?: string | null;
  } | null;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  // If `user` wasn't provided from the server, fetch it client-side as a fallback.
  const [localUser, setLocalUser] = useState(user ?? null);
  const [loading, setLoading] = useState(!user);

  // Initialize form fields from whichever user object we have
  const [fullName, setFullName] = useState<string>(localUser?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photoUrl, setPhotoUrl] = useState(localUser?.profile_photo_url || "");
  const [sellerType, setSellerType] = useState<string>(
    (localUser as any)?.seller_type || ""
  );
  const [meta, setMeta] = useState<{ seller_types?: string[] }>({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch profile client-side if server didn't provide one
  useEffect(() => {
    if (localUser || !loading) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "same-origin",
        });
        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated — prompt user to sign in
            setMessage("Not signed in. Please sign in again.");
            return;
          }
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Failed to fetch profile");
        }
        const json = await res.json();
        if (mounted) {
          setLocalUser(json.user || null);
          setFullName(json.user?.full_name || "");
          setPhone(json.user?.phone || "");
          setPhotoUrl(
            json.user?.profile_photo_url || json.user?.photo_url || ""
          );
          setSellerType(json.user?.seller_type || "");
        }
      } catch (err) {
        console.error("Failed to load profile client-side:", err);
        setMessage("Failed to load profile — please refresh.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // fetch metadata for seller types
    (async () => {
      try {
        const res = await fetch("/api/cars/metadata", {
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setMeta(json || {});
      } catch (e) {
        // ignore
      }
    })();
  }, [localUser, loading]);

  // Ensure metadata is fetched on mount even when server passed `user` prop
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/cars/metadata", {
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setMeta(json || {});
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-xl md:max-w-2xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center">
          <p className="text-lg sm:text-xl font-bold">Loading profile…</p>
        </div>
      </div>
    );
  }

  const userObj = localUser ?? user;
  if (!userObj) {
    return (
      <div className="w-full max-w-xl md:max-w-2xl mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center">
          <p className="text-lg sm:text-xl font-bold">
            Profile not found. Try refreshing.
          </p>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userObj?.id) {
      setMessage("No file selected or user not found");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `profiles/${userObj.id}/${fileName}`;

      const { error } = await supabaseBrowser.storage
        .from("carsabeg-uploads")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabaseBrowser.storage
        .from("carsabeg-uploads")
        .getPublicUrl(filePath);

      setPhotoUrl(publicUrl);
      setMessage("Photo uploaded successfully!");
    } catch (error) {
      const err = error as { message?: string };
      setMessage(`Upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          profile_photo_url: photoUrl,
          seller_type: sellerType || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed");
      setLocalUser(json.user || null);
      setMessage("Profile saved successfully!");
    } catch (err) {
      console.error("Save profile error:", err);
      setMessage("Failed to save profile");
    }
  };

  return (
    <div className="w-full max-w-xl md:max-w-2xl mx-auto space-y-8 px-2 sm:px-0">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
          Profile Settings
        </h2>

        {/* Photo Upload */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Profile Photo
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 sm:border-8 border-green-600 shadow-lg sm:shadow-2xl">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="112px"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-6xl font-black text-gray-700">
                    {userObj?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div
                  className={`px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-black text-base sm:text-xl transition-all shadow-lg inline-block ${
                    uploading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                  }`}
                >
                  {uploading ? "Uploading..." : "Change Photo"}
                </div>
              </label>
              <p className="text-sm text-gray-600 mt-4">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-center font-semibold text-base border ${
                message.includes("success")
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-red-50 text-red-700 border-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none text-base sm:text-lg"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Email
            </label>
            <input
              type="email"
              value={userObj?.email || ""}
              disabled
              className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-gray-600 text-base sm:text-lg"
            />
            <div className="mt-6">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Seller Type
              </label>
              <select
                value={sellerType}
                onChange={(e) => setSellerType(e.target.value)}
                className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none text-base sm:text-lg"
              >
                <option value="">Select seller type</option>
                {(meta.seller_types || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>{" "}
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none text-base sm:text-lg"
              placeholder="+234..."
            />
          </div>
        </div>

        <CustomButton
          handleClick={saveProfile}
          containerStyles="w-full mt-8 sm:mt-12 bg-black hover:bg-gray-900 text-white py-3 sm:py-6 rounded-2xl font-black text-lg sm:text-2xl shadow-lg sm:shadow-2xl transition-all hover:scale-105"
          title="SAVE PROFILE CHANGES"
        />
      </div>
    </div>
  );
}
