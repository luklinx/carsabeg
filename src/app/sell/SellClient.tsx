// src/app/sell/SellClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Flame, X } from "lucide-react";
import MakeSelect from "@/components/MakeSelect";
import ModelSelect from "@/components/ModelSelect";
import FloatingInput from "@/components/ui/FloatingInput";
import { manufacturers as MAKES } from "@/constant";
import CustomButton from "@/components/CustomButton";

// uses manufacturers list from src/constant

interface SellStepperProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImages?: { url: string; file: File }[];
  removeImage?: (index: number) => void;
  initialValues?: {
    make?: string;
    model?: string;
    year?: number;
    transmission?: string;
    fuel?: string;
    mileage?: number;
    price?: number;
    condition?: string;
    location?: string;
    dealer_name?: string;
    dealer_phone?: string;
    features?: string[];
    description?: string;
    negotiable?: boolean;
  };
}

function SellStepper({
  onSubmit,
  onImageChange,
  removeImage: removeImageFromProps,
  initialValues,
}: SellStepperProps) {
  const [step, setStep] = useState(1);
  const [selectedMake, setSelectedMake] = useState(initialValues?.make ?? "");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImages, setPreviewImages] = useState<
    { url: string; file: File }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCityParam = searchParams?.get("city") || "";
  const initialStateParam = searchParams?.get("state") || "";

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleLocalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step < 4) {
      e.preventDefault();
      next();
      return;
    }
    if (onSubmit) {
      onSubmit(e);
    }
  };

  useEffect(() => {
    const form = formRef.current || document.querySelector("#sell-form");
    if (!form) return;

    function updateFilled(
      el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    ) {
      const parent = el.closest(".field");
      if (!parent) return;
      if (el.value && el.value.length > 0) parent.classList.add("filled");
      else parent.classList.remove("filled");
    }

    const inputs = Array.from(
      form.querySelectorAll("input, textarea, select")
    ) as Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    const listeners: Array<() => void> = [];
    inputs.forEach((el) => {
      const focus = () => el.closest(".field")?.classList.add("focused");
      const blur = () => el.closest(".field")?.classList.remove("focused");
      const input = () => updateFilled(el);
      el.addEventListener("focus", focus);
      el.addEventListener("blur", blur);
      el.addEventListener("input", input);
      updateFilled(el);
      listeners.push(() => {
        el.removeEventListener("focus", focus);
        el.removeEventListener("blur", blur);
        el.removeEventListener("input", input);
      });
    });

    return () => listeners.forEach((fn) => fn());
  }, [step, initialValues]);

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-xl font-bold mb-4">List your car</h2>
      <form
        id="sell-form"
        ref={formRef}
        onSubmit={handleLocalSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="city" value={initialCityParam} />
        <input type="hidden" name="state" value={initialStateParam} />
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <div className="field">
            <MakeSelect
              name="make"
              defaultValue={initialValues?.make ?? ""}
              options={MAKES}
              onChange={(v) => setSelectedMake(v)}
              placeholder="Make"
            />
          </div>

          <div className="field mt-4">
            <ModelSelect
              name="model"
              make={selectedMake || initialValues?.make || ""}
              defaultValue={initialValues?.model ?? ""}
              placeholder="Model"
            />
          </div>

          <div className="field mt-4">
            <FloatingInput
              name="year"
              label="Year"
              type="number"
              defaultValue={initialValues?.year ?? undefined}
              placeholder="Year"
            />
          </div>
        </div>

        <div style={{ display: step === 2 ? "block" : "none" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <FloatingInput
                name="transmission"
                label="Transmission"
                as="select"
                defaultValue={initialValues?.transmission ?? ""}
                options={[
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                ]}
              />
            </div>

            <div className="field">
              <FloatingInput
                name="fuel"
                label="Fuel"
                as="select"
                defaultValue={initialValues?.fuel ?? ""}
                options={[
                  { value: "petrol", label: "Petrol" },
                  { value: "diesel", label: "Diesel" },
                  { value: "hybrid", label: "Hybrid" },
                  { value: "electric", label: "Electric" },
                ]}
              />
            </div>
          </div>

          <div className="field mt-4">
            <FloatingInput
              name="mileage"
              label="Mileage"
              type="number"
              min={0}
              defaultValue={initialValues?.mileage ?? undefined}
              placeholder=" "
            />
          </div>
        </div>

        <div style={{ display: step === 3 ? "block" : "none" }}>
          <label className="block text-sm font-medium text-gray-700">
            Photos & Videos
          </label>
          <input
            name="images"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={onImageChange}
            className="mt-2"
          />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {previewImages.map((p, i) => (
              <div key={i} className="relative">
                {p.file.type && p.file.type.startsWith("video") ? (
                  <video
                    src={p.url}
                    className="w-full h-24 object-cover rounded"
                    controls
                  />
                ) : (
                  <Image
                    src={p.url}
                    alt={`Car preview ${i + 1}`}
                    className="w-full h-24 object-cover rounded"
                    width={96}
                    height={96}
                  />
                )}
                <CustomButton
                  btnType="button"
                  onClick={() => removeImageFromProps?.(i)}
                  containerStyles="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                  aria-label={`Remove preview ${i + 1}`}
                >
                  <X size={16} />
                </CustomButton>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: step === 4 ? "block" : "none" }}>
          <h3 className="font-bold mb-4 text-lg">Listing Details</h3>

          <p className="text-sm text-gray-600 mb-4">
            Provide accurate information — required fields are marked{" "}
            <span className="text-red-500">*</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                Price <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 bg-gray-50 text-gray-700">
                  ₦
                </span>
                <div className="flex-1">
                  <FloatingInput
                    name="price"
                    label="Price"
                    type="number"
                    defaultValue={initialValues?.price ?? undefined}
                    inputClassName="block w-full border rounded-r p-2 placeholder-gray-400"
                    inputProps={{
                      inputMode: "numeric",
                      min: 0,
                      "aria-required": true,
                      placeholder: "1,500,000",
                    }}
                  />
                </div>
              </div>
              <label className="flex items-center text-sm mt-2">
                <input
                  type="checkbox"
                  name="negotiable"
                  defaultChecked={initialValues?.negotiable}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Price negotiable</span>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                defaultValue={initialValues?.condition ?? "local-used"}
                className="mt-1 block w-full border rounded p-2 placeholder-gray-400"
                aria-required="true"
              >
                <option value="foreign-used">Foreign used</option>
                <option value="local-used">Local used</option>
                <option value="brand-new">Brand new</option>
              </select>
            </div>

            <div>
              <FloatingInput
                name="location"
                label="Location"
                defaultValue={initialValues?.location ?? ""}
                placeholder="City, area"
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">
                Dealer / Seller
              </label>
              <div className="mt-1 grid grid-cols-1 gap-2">
                <FloatingInput
                  name="dealer_name"
                  label="Full name"
                  defaultValue={initialValues?.dealer_name ?? ""}
                />
                <FloatingInput
                  name="dealer_phone"
                  label="Phone number"
                  defaultValue={initialValues?.dealer_phone ?? ""}
                />
              </div>

              <FloatingInput
                name="features"
                label="Features (comma separated)"
                defaultValue={initialValues?.features?.join(", ") ?? ""}
                placeholder="Air Conditioning, Sunroof"
              />
            </div>
          </div>

          <div className="mt-6">
            <FloatingInput
              name="description"
              label="Description"
              as="textarea"
              defaultValue={initialValues?.description ?? ""}
            />
          </div>

          <p className="text-xs text-gray-600 mt-2">
            Tip: include service history, recent repairs, and any warranty
            information to improve buyer confidence.
          </p>
        </div>

        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <CustomButton
                btnType="button"
                handleClick={back}
                containerStyles="px-4 py-2 rounded border"
                title="Back"
              />
            )}
          </div>

          <div>
            {step < 4 ? (
              <CustomButton
                btnType="submit"
                containerStyles="bg-green-600 text-white px-4 py-2 rounded"
                title="Continue"
              />
            ) : (
              <CustomButton
                btnType="submit"
                containerStyles="bg-green-600 text-white px-4 py-2 rounded"
                title="Submit Listing"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function SellClient() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const uploadImages = async (
    files: File[],
    onProgress?: (p: number) => void
  ): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      try {
        const form = new FormData();
        files.forEach((f) => form.append("files", f, f.name));

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/sell/upload");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress?.(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json.urls || []);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(
              new Error(xhr.responseText || `Upload failed (${xhr.status})`)
            );
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(form);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const formEl = e.currentTarget as HTMLFormElement;
    const formData = new FormData(formEl);
    // Separate images and videos so we can persist `images` and `video_urls` separately
    const imageFiles = previewImages
      .filter((p) => p.file.type && p.file.type.startsWith("image"))
      .map((p) => p.file);
    const videoFiles = previewImages
      .filter((p) => p.file.type && p.file.type.startsWith("video"))
      .map((p) => p.file);

    const getRaw = (k: string) => {
      const v = formData.get(k);
      if (v === null || v === undefined) return null;
      const s = String(v).trim();
      if (s === "" || s.toLowerCase() === "null") return null;
      return s;
    };
    const getNumber = (k: string) => {
      const raw = getRaw(k);
      if (raw === null) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };

    const errors: string[] = [];
    const make = getRaw("make");
    const model = getRaw("model");
    const year = getNumber("year");
    const price = getNumber("price");
    // dealer info will be pulled from the user's profile server-side

    if (!make) errors.push("Make is required");
    if (!model) errors.push("Model is required");
    const currentYear = new Date().getFullYear();
    if (
      year === null ||
      !Number.isInteger(year) ||
      year < 1900 ||
      year > currentYear + 1
    ) {
      errors.push("Year is required and must be valid");
    }
    if (price === null || price < 0)
      errors.push("Price is required and must be >= 0");
    // seller contact is optional on the client; server will fill from profile when missing
    if (imageFiles.length === 0) errors.push("Please upload at least 1 photo");

    if (errors.length > 0) {
      setErrorMsg(errors.join("; "));
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let uploadedImageUrls: string[] = [];
    let uploadedVideoUrls: string[] = [];
    try {
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(imageFiles, (p) =>
          setUploadProgress(p)
        );
      }
      if (videoFiles.length > 0) {
        // Use a separate upload call for videos; progress will be coarse (image upload progress used)
        const vs = await uploadImages(videoFiles, (p) => setUploadProgress(p));
        uploadedVideoUrls = vs;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Server upload failed", errorMessage);
    }
    setUploading(false);
    setUploadProgress(0);

    // If the client provided image files but none uploaded, fail fast
    if (imageFiles.length > 0 && uploadedImageUrls.length === 0) {
      setErrorMsg("Image upload failed. Check your bucket permissions.");
      return;
    }

    const dealer_name = getRaw("dealer_name") || "";
    const dealer_phone = getRaw("dealer_phone") || "";

    const carData = {
      year,
      make,
      model,
      price,
      condition: getRaw("condition"),
      location: getRaw("location"),
      state: getRaw("state"),
      city: getRaw("city"),
      mileage: getNumber("mileage"),
      transmission: getRaw("transmission"),
      fuel: getRaw("fuel"),
      description: getRaw("description"),
      dealer_name,
      dealer_phone,
      images: uploadedImageUrls,
      video_urls: uploadedVideoUrls,
      featured_paid: false,
      approved: false,
    };

    try {
      const res = await fetch("/api/sell/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: carData }),
      });

      const text = await res.text();
      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        const detailsText =
          text && text.length > 0
            ? text
            : json && typeof json === "object"
            ? JSON.stringify(json)
            : "";
        let message = "";
        if (detailsText && detailsText.length > 0) {
          message = detailsText;
        } else if (json && typeof json === "object") {
          const maybe = json as Record<string, unknown>;
          if (typeof maybe.error === "string" && maybe.error)
            message = maybe.error;
          else if (typeof maybe.details === "string" && maybe.details)
            message = maybe.details;
          else {
            try {
              message = JSON.stringify(maybe);
            } catch {
              message = `Submission failed (${res.status})`;
            }
          }
        } else {
          message = `Submission failed (${res.status})`;
        }

        setErrorMsg(message);
      } else {
        setSuccess(true);
        formEl.reset();
        setPreviewImages([]);
        router.push("/dashboard/inventory");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Submit error:", error);
      setErrorMsg(error?.message || "Submission failed");
    }
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
          <h1 className="text-3xl md:text-3xl font-black text-green-600 mb-8">
            DONE!
          </h1>
          <p className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
            Your car is LIVE in minutes!
          </p>
          <p className="text-2xl md:text-2xl font-bold text-gray-700 mb-12">
            We&apos;re reviewing now • WhatsApp alert coming in 1–24hrs
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition"
            >
              Back Home
            </Link>
            <a
              href="https://wa.me/2349018837909"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition"
            >
              Chat Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-3xl font-black mb-8 drop-shadow-2xl">
            SELL YOUR CAR <span className="text-yellow-400">TODAY</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-2xl md:text-2xl font-black">
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
        <div className="p-8 md:p-12 lg:p-16">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {errorMsg}
            </div>
          )}
          {uploading && (
            <div className="mb-6">
              <div className="h-3 bg-gray-200 rounded overflow-hidden">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="h-3 bg-green-600 rounded transition-all"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading images: {uploadProgress}%
              </p>
            </div>
          )}
          <SellStepper
            onSubmit={handleSubmit}
            onImageChange={handleImageChange}
            previewImages={previewImages}
            removeImage={removeImage}
          />
        </div>
      </div>
    </div>
  );
}
