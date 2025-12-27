"use client";

import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient";
import CustomButton from "@/components/CustomButton";

type Draft = {
  id?: string;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  price?: number | null;
  condition?: string | null;
  location?: string | null;
  mileage?: number | null;
  transmission?: string | null;
  fuel?: string | null;
  description?: string | null;
  dealer_name?: string | null;
  dealer_phone?: string | null;
  images?: string[] | null; // public URLs
  video_urls?: string[] | null; // public URLs for uploaded videos
  seller_type?: string | null;
  body_type?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  market?: string | null;
  specs?: Record<string, unknown> | string | null; // JSON string or parsed object
};

type ProfileUser = {
  id?: string;
  full_name?: string | null;
  phone?: string | null;
  seller_type?: string | null;
};

export default function SellStepper() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [editingDealer, setEditingDealer] = useState(false);
  const [meta, setMeta] = useState<{
    seller_types?: string[];
    body_types?: string[];
    exterior_colors?: string[];
    interior_colors?: string[];
    markets?: string[];
  }>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [clickLog, setClickLog] = useState<string | null>(null);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [previews]);

  // Fetch logged-in user's profile to prefill dealer info
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/users/profile", {
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const user = json?.user;
        if (user) {
          setProfileUser(user);
          setDraft(
            (d) =>
              ({
                ...d,
                dealer_name: d.dealer_name ?? user.full_name ?? null,
                dealer_phone: d.dealer_phone ?? user.phone ?? null,
                seller_type: d.seller_type ?? user.seller_type ?? null,
              } as Draft)
          );
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch metadata for selects (seller types, colors, body types, markets)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/cars/metadata", {
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setMeta(json || {});
      } catch (e) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (!f) return;
    const arr = Array.from(f).slice(0, 12);
    setFiles(arr);
    const urls = arr.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const parseNumber = (s: string) => {
    const v = (s ?? "").toString().trim();
    if (v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const saveDraft = async (): Promise<boolean> => {
    setSaving(true);
    setMessage(null);
    try {
      // Validate specs (if provided as JSON string)
      if (typeof draft.specs === "string" && draft.specs.trim() !== "") {
        try {
          const parsed: unknown = JSON.parse(draft.specs as string);
          if (typeof parsed === "object" && parsed !== null) {
            (draft as Draft).specs = parsed as Record<string, unknown>;
          } else {
            setMessage("Specs must be a JSON object");
            setSaving(false);
            return false;
          }
        } catch (e) {
          setMessage("Specs must be valid JSON");
          setSaving(false);
          return false;
        }
      }

      const payload: Draft = { ...draft };

      // If there are local files selected, upload them first and attach URLs
      if (files && files.length > 0) {
        const uploadedImageUrls: string[] = [];
        const uploadedVideoUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}.${fileExt}`;
          const filePath = `listings/${fileName}`;

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

          // classify by MIME type
          if (file.type && file.type.startsWith("video")) {
            uploadedVideoUrls.push(urlData.publicUrl);
          } else {
            uploadedImageUrls.push(urlData.publicUrl);
          }
        }

        // Merge with existing images/videos (if any)
        payload.images = Array.isArray(payload.images)
          ? [...payload.images, ...uploadedImageUrls]
          : uploadedImageUrls;
        payload.video_urls = Array.isArray(payload.video_urls)
          ? [...payload.video_urls, ...uploadedVideoUrls]
          : uploadedVideoUrls;
      }

      const res = await fetch("/api/sell/draft", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ draft: payload }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save draft");
      setMessage("Draft saved");
      // Use server returned draft (includes id) when available
      const serverDraft = json?.data ?? json?.data ?? null;
      setDraft(serverDraft || payload);
      if (files && files.length > 0) {
        setFiles([]);
        setPreviews([]);
      }
      return true;
    } catch (err) {
      console.error("Save draft error:", err);
      setMessage("Failed to save draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const router = useRouter();

  const submitListing = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Ensure latest draft saved and get server id; abort if validation fails
      const ok = await saveDraft();
      if (!ok) return;

      const id = draft?.id;
      const payload = id ? { id } : { draft };

      const res = await fetch("/api/sell/submit", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Submit failed");
      // Redirect to inventory to show submitted listing
      router.push("/dashboard/inventory");
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Failed to submit listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 p-6 sm:p-8 relative">
      <div className="hidden sm:block mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Create Listing</h2>
          <div className="flex items-center gap-4">
            <CustomButton
              handleClick={saveDraft}
              containerStyles="px-4 py-2 bg-gray-100 rounded-lg"
              title={saving ? "Saving..." : "Save Draft"}
            />
            {message && <div className="text-sm text-gray-600">{message}</div>}
          </div>
        </div>

        <div className="mt-4 flex gap-3 items-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  s === step
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : s < step
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`h-1 flex-1 rounded ${
                    s < step ? "bg-green-600" : "bg-gray-200"
                  } transition-all`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile header */}
      <div className="sm:hidden mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Step {step} / 4</h3>
        <div className="flex items-center gap-2">
          <CustomButton
            handleClick={saveDraft}
            containerStyles="px-3 py-2 bg-gray-100 rounded"
            title={saving ? "Saving..." : "Save"}
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">
            Create Listing — Step {step}/4
          </h2>
          <div className="flex items-center gap-4">
            <CustomButton
              handleClick={saveDraft}
              containerStyles="px-4 py-2 bg-gray-100 rounded-lg"
              title={saving ? "Saving..." : "Save Draft"}
            />
            {message && <div className="text-sm text-gray-600">{message}</div>}
            {clickLog && (
              <div className="text-sm text-pink-600 ml-4">{clickLog}</div>
            )}
          </div>
        </div>
      </div>

      <section
        aria-hidden={step !== 1}
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          step === 1
            ? "opacity-100 translate-y-0 max-h-screen"
            : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            placeholder="Year"
            value={draft.year ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, year: parseNumber(e.target.value) ?? null })
            }
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Make"
            value={draft.make ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, make: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Model"
            value={draft.model ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, model: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Price"
            value={draft.price ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, price: parseNumber(e.target.value) ?? null })
            }
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Location"
            value={draft.location ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, location: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={draft.market ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, market: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          >
            <option value="">Market</option>
            {(meta.markets || []).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section
        aria-hidden={step !== 2}
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          step === 2
            ? "opacity-100 translate-y-0 max-h-screen"
            : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            placeholder="Mileage"
            value={draft.mileage ?? ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                mileage: parseNumber(e.target.value) ?? null,
              })
            }
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Transmission"
            value={draft.transmission ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, transmission: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          />
          <input
            placeholder="Fuel"
            value={draft.fuel ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, fuel: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          />
        </div>
        <select
          value={draft.condition ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, condition: e.target.value || null })
          }
          className="p-4 border rounded-lg"
        >
          <option value="">Condition</option>
          <option>Foreign Used</option>
          <option>Nigerian Used</option>
          <option>Brand New</option>
        </select>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <select
            value={draft.body_type ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, body_type: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          >
            <option value="">Body type</option>
            {(meta.body_types || []).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={draft.exterior_color ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, exterior_color: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          >
            <option value="">Exterior color</option>
            {(meta.exterior_colors || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={draft.interior_color ?? ""}
            onChange={(e) =>
              setDraft({ ...draft, interior_color: e.target.value || null })
            }
            className="p-4 border rounded-lg"
          >
            <option value="">Interior color</option>
            {(meta.interior_colors || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <label className="block mt-2">Specs (JSON)</label>
        <textarea
          placeholder='e.g. {"engine":"2.0L","doors":4}'
          value={
            typeof draft.specs === "string"
              ? draft.specs
              : JSON.stringify(draft.specs ?? "", null, 2)
          }
          onChange={(e) =>
            setDraft({ ...draft, specs: e.target.value || null })
          }
          className="p-3 border rounded-lg w-full"
          rows={4}
        />
      </section>

      <section
        aria-hidden={step !== 3}
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          step === 3
            ? "opacity-100 translate-y-0 max-h-screen"
            : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
        }`}
      >
        <label className="block">Photos & Videos (max 12)</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {files.map((file, i) => (
            <div
              key={i}
              className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden"
            >
              {file.type && file.type.startsWith("video") ? (
                <video
                  src={previews[i]}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <Image
                  src={previews[i]}
                  alt={`preview-${i}`}
                  fill
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        aria-hidden={step !== 4}
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          step === 4
            ? "opacity-100 translate-y-0 max-h-screen"
            : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
        }`}
      >
        {profileUser && !editingDealer ? (
          <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">
                {draft.dealer_name || profileUser.full_name}
              </div>
              <div className="text-sm text-gray-600">
                {draft.dealer_phone || profileUser.phone}
              </div>
              {profileUser.seller_type ? (
                <div className="text-sm text-gray-600 mt-1">
                  Seller type:{" "}
                  <span className="font-medium">{profileUser.seller_type}</span>
                </div>
              ) : null}
              <div className="text-xs text-gray-600 mt-1">
                Using info from your profile
              </div>
            </div>
            <div>
              <CustomButton
                btnType="button"
                handleClick={() => setEditingDealer(true)}
                containerStyles="px-3 py-2 bg-white border rounded"
              >
                Edit
              </CustomButton>
            </div>
          </div>
        ) : (
          <>
            <input
              placeholder="Your full name"
              value={draft.dealer_name ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, dealer_name: e.target.value || null })
              }
              className="p-4 border rounded-lg"
            />
            <input
              placeholder="WhatsApp number"
              value={draft.dealer_phone ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, dealer_phone: e.target.value || null })
              }
              className="p-4 border rounded-lg"
            />
            <select
              value={draft.seller_type ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, seller_type: e.target.value || null })
              }
              className="p-4 border rounded-lg mt-2"
            >
              <option value="">Seller type</option>
              {(meta.seller_types || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </>
        )}
        <textarea
          placeholder="Description"
          value={draft.description ?? ""}
          onChange={(e) =>
            setDraft({ ...draft, description: e.target.value || null })
          }
          className="p-4 border rounded-lg"
        />
      </section>

      <div className="mt-8 flex items-center justify-between">
        <div>
          {step > 1 && (
            <CustomButton
              btnType="button"
              handleClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                console.log("SellStepper: back clicked", { step });
                prev();
              }}
              containerStyles="px-6 py-3 bg-gray-100 rounded-lg mr-2 relative z-20 pointer-events-auto"
              title="Back"
            />
          )}
          {step < 4 && (
            <CustomButton
              btnType="button"
              handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                console.log("SellStepper: next clicked", { step });
                next();
              }}
              containerStyles="px-6 py-3 bg-green-600 text-white rounded-lg relative z-20 pointer-events-auto"
              title="Next"
            />
          )}
        </div>
        <div className="flex items-center gap-4">
          <CustomButton
            btnType="button"
            handleClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              saveDraft();
            }}
            containerStyles="px-6 py-3 bg-gray-100 rounded-lg relative z-20 pointer-events-auto"
            title="Save Draft"
          />
          <CustomButton
            btnType="button"
            handleClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              submitListing();
            }}
            containerStyles="px-6 py-3 bg-yellow-400 rounded-lg relative z-20 pointer-events-auto"
            title="Submit Listing"
          />
        </div>
      </div>
    </div>
  );
}
