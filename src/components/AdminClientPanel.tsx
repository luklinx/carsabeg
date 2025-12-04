// src/components/AdminClientPanel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { Car } from "@/types";

interface Props {
  initialCars: Car[];
  initialPaidCars: Car[];
}

export default function AdminClientPanel({
  initialCars,
  initialPaidCars,
}: Props) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [paidCars, setPaidCars] = useState<Car[]>(initialPaidCars);
  const [processing, setProcessing] = useState<string | null>(null);

  const approveCar = async (id: string) => {
    if (
      processing ||
      !confirm("Approve this car? It will go live immediately.")
    )
      return;
    setProcessing(id);
    const { error } = await supabaseBrowser
      .from("cars")
      .update({ approved: true })
      .eq("id", id);
    if (!error) {
      setCars(cars.map((c) => (c.id === id ? { ...c, approved: true } : c)));
      alert("Car approved & live!");
    }
    setProcessing(null);
  };

  const makePremium = async (id: string) => {
    if (processing || !confirm("Mark as PREMIUM (₦50,000 paid)?")) return;
    setProcessing(id);
    const today = new Date();
    const expiry = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0];

    const { error } = await supabaseBrowser
      .from("cars")
      .update({ featured_paid: true, featured_until: expiry, approved: true })
      .eq("id", id);

    if (!error) {
      setCars(
        cars.map((c) =>
          c.id === id
            ? {
                ...c,
                featured_paid: true,
                featured_until: expiry,
                approved: true,
              }
            : c
        )
      );
      const updated = cars.find((c) => c.id === id)!;
      setPaidCars([
        ...paidCars.filter((c) => c.id !== id),
        { ...updated, featured_paid: true, featured_until: expiry },
      ]);
      alert("Now PREMIUM for 30 days!");
    }
    setProcessing(null);
  };

  const deleteCar = async (id: string) => {
    if (processing || !confirm("DELETE this car permanently? Cannot undo."))
      return;
    setProcessing(id);
    const { error } = await supabaseBrowser.from("cars").delete().eq("id", id);
    if (!error) {
      setCars(cars.filter((c) => c.id !== id));
      setPaidCars(paidCars.filter((c) => c.id !== id));
      alert("Car deleted forever.");
    }
    setProcessing(null);
  };

  const totalRevenue = paidCars.length * 50000;
  const pendingCars = cars.filter((c) => !c.approved);
  const approvedCars = cars.filter((c) => c.approved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your entire beautiful UI from before — unchanged */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-green-600">
              CARS ABEG ADMIN
            </h1>
            <p className="text-gray-600 mt-1">
              You control Nigeria&apos;s #1 car marketplace
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Revenue Earned</p>
            <p className="text-3xl font-black text-green-600">
              ₦{totalRevenue.toLocaleString()}
            </p>
            <p className="text-lg text-gray-500">{paidCars.length} × ₦50,000</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <p className="text-gray-600">Total Cars</p>
            <p className="text-2xl font-black text-gray-900 mt-2">
              {cars.length}
            </p>
          </div>
          <div className="bg-orange-50 p-6 rounded-2xl shadow text-center border border-orange-200">
            <p className="text-orange-700">Pending</p>
            <p className="text-2xl font-black text-orange-600 mt-2">
              {pendingCars.length}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl shadow text-center border border-green-200">
            <p className="text-green-700">Live</p>
            <p className="text-2xl font-black text-green-600 mt-2">
              {approvedCars.length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow text-center border border-yellow-300">
            <p className="text-yellow-700">Premium</p>
            <p className="text-2xl font-black text-yellow-600 mt-2">
              {paidCars.length}
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-2xl shadow text-center border border-purple-200">
            <p className="text-purple-700">Revenue</p>
            <p className="text-2xl font-black text-purple-600 mt-2">
              ₦{totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending & Live Sections — same as your original */}
        {pendingCars.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-6 text-orange-600">
              Pending Approval ({pendingCars.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden"
                >
                  <Image
                    src={car.images[0] || "/placeholder.jpg"}
                    alt={car.model}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-black text-xl">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      ₦{(car.price / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => approveCar(car.id)}
                        disabled={processing === car.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-black"
                      >
                        {processing === car.id ? "..." : "APPROVE"}
                      </button>
                      <button
                        onClick={() => makePremium(car.id)}
                        disabled={processing === car.id}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-70 text-black py-3 rounded-xl font-black"
                      >
                        {processing === car.id ? "..." : "MAKE PREMIUM"}
                      </button>
                    </div>
                    <button
                      onClick={() => deleteCar(car.id)}
                      disabled={processing === car.id}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-black"
                    >
                      {processing === car.id ? "DELETING..." : "DELETE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-black mb-6 text-green-600">
            Live Listings ({approvedCars.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow p-4 border"
              >
                <Image
                  src={car.images[0]}
                  alt={car.model}
                  width={400}
                  height={300}
                  className="w-full rounded-lg object-cover h-48"
                />
                <p className="font-black mt-3 text-lg">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="text-green-600 font-bold">
                  ₦{(car.price / 1000000).toFixed(1)}M
                </p>
                {car.featured_paid && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold">
                    PREMIUM
                  </span>
                )}
                <button
                  onClick={() => deleteCar(car.id)}
                  disabled={processing === car.id}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 rounded-lg font-bold"
                >
                  {processing === car.id ? "DELETING..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-bold">
            CARS ABEG © 2025 • Nigeria&apos;s #1 • Built by THE KING
          </p>
        </div>
      </div>
    </div>
  );
}
