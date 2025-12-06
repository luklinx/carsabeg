"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Camera, Loader2, LogOut } from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    profile_photo_url?: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.full_name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [photoUrl, setPhotoUrl] = useState(user.profile_photo_url || "");
  const [photoPreview, setPhotoPreview] = useState(
    user.profile_photo_url || ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be less than 5MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploadingPhoto(true);
    setError("");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/users/upload-photo", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error(
          "Failed to parse response JSON:",
          parseErr,
          "Response text:",
          await response.text()
        );
        data = {};
      }

      if (!response.ok) {
        const errorMsg = data?.error || "Failed to upload photo";
        const details = data?.details ? ` (${data.details})` : "";
        console.error("Upload failed:", {
          status: response.status,
          error: errorMsg,
          details: data?.details,
          fullResponse: data,
        });
        setError(errorMsg + details);
        setPhotoPreview(photoUrl); // Reset preview to previous
        return;
      }

      setPhotoUrl(data.url);
      setSuccess("Photo uploaded successfully!");
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Failed to upload photo");
      setPhotoPreview(photoUrl); // Reset preview to previous
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          profile_photo_url: photoUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Photo Upload Section */}
      <div className="space-y-4">
        <label className="block text-sm sm:text-base font-semibold text-slate-700">
          Profile Photo
        </label>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Photo Preview */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Profile preview"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={40} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Photo Upload Button */}
          <div className="flex flex-col justify-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              disabled={uploadingPhoto}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 text-sm sm:text-base"
            >
              {uploadingPhoto ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  Upload Photo
                </>
              )}
            </button>
            <p className="text-xs sm:text-sm text-slate-500">
              JPG, PNG or WebP • Max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Full Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="block text-sm sm:text-base font-semibold text-slate-700"
        >
          Full Name
        </label>
        <div className="relative">
          <User
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Email Field (Read-only) */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm sm:text-base font-semibold text-slate-700"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 text-sm sm:text-base cursor-not-allowed"
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Email cannot be changed
        </p>
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm sm:text-base font-semibold text-slate-700"
        >
          Phone Number
        </label>
        <div className="relative">
          <Phone
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 sm:p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-700 text-sm sm:text-base">{success}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        {loading && <Loader2 size={20} className="animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2 sm:py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <LogOut size={20} />
        Logout
      </button>
    </form>
  );
}
