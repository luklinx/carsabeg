"use client";

import React, { useEffect, useState, useRef } from "react";
import type { Car } from "@/types";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { useToast } from "@/components/ui/ToastProvider";

export default function ListingModal({
  id,
  car: initialCar,
  onClose,
  onUpdated,
}: {
  id: string | null;
  car?: Car | null;
  onClose: () => void;
  onUpdated?: (car: Car) => void;
}) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  const [actioning, setActioning] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!loading && car) {
      closeBtnRef.current?.focus();
    }
  }, [loading, car]);

  const { showToast, confirm, prompt } = useToast();

  useEffect(() => {
    // If an initial car object was provided from the list, use it and skip
    // fetching to avoid backend uuid issues. Otherwise, fetch by id.
    if (initialCar) {
      setCar(initialCar);
      return;
    }

    if (!id || id === "undefined") return;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch(`/api/dashboard/cars/${id}`);
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Failed");
        setCar(j.data);
      } catch (e) {
        console.error(e);
        showToast({ message: "Failed to load listing details", type: "error" });
        onClose();
      } finally {
        setLoading(false);
      }
    })();
  }, [id, initialCar, onClose, showToast]);

  if (!id) return null;

  const doAction = async (status: string) => {
    if (!car || !car.id || car.id === "undefined") return;
    const ok = await confirm({ message: `Set status to ${status}?` });
    if (!ok) return;
    const notes = (await prompt({
      message: "Notes (optional):",
      placeholder: car.moderation_notes ?? "",
    })) as string | null;
    setActioning(true);
    try {
      const r = await fetch(`/api/dashboard/cars/${car.id}/approve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Action failed");
      const updated = j.data ?? j?.data;
      onUpdated?.(updated);
      showToast({ message: "Status updated", type: "success" });
      onClose();
    } catch (e) {
      console.error(e);
      showToast({ message: "Failed to update status", type: "error" });
    } finally {
      setActioning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white/5 rounded-2xl p-6 text-white z-10">
        {loading || !car ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="w-full h-64 bg-gray-800 rounded overflow-hidden">
                <Image
                  src={car.images?.[0] || "/placeholder.jpg"}
                  alt=""
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <strong>Status:</strong> {car.status}
                </div>
                <div>
                  <strong>Price:</strong> ₦{(car.price / 1000000).toFixed(1)}M
                </div>
                <div>
                  <strong>Created:</strong> {car.created_at?.split("T")[0]}
                </div>
                <div>
                  <strong>Approver:</strong>{" "}
                  {car.approver_email ?? car.approved_by ?? "—"}
                </div>
                <div>
                  <strong>Approved at:</strong>{" "}
                  {car.approved_at
                    ? new Date(car.approved_at).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-300 mt-2">
                    {car.city || car.state || car.location} • {car.dealer_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CustomButton
                    ref={closeBtnRef}
                    handleClick={onClose}
                    containerStyles="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </CustomButton>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-200">
                <p className="mb-4">{car.description}</p>
                <div className="mb-4">
                  <strong>Moderation notes:</strong>
                  <div className="mt-2 p-3 bg-white/5 rounded">
                    {car.moderation_notes || "—"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CustomButton
                    isDisabled={actioning}
                    handleClick={() => doAction("approved")}
                    containerStyles="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                  >
                    Approve
                  </CustomButton>

                  <CustomButton
                    isDisabled={actioning}
                    handleClick={() => doAction("rejected")}
                    containerStyles="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
                  >
                    Reject
                  </CustomButton>

                  <CustomButton
                    isDisabled={actioning}
                    handleClick={() => doAction("needs_changes")}
                    containerStyles="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold"
                  >
                    Needs changes
                  </CustomButton>

                  <CustomButton
                    isDisabled={actioning}
                    handleClick={() => doAction("flagged")}
                    containerStyles="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold"
                  >
                    Flag
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
