// src/components/AdminPanel.tsx
"use client";

// import { useState } from "react";
import Image from "next/image";
import { getPaidFeaturedCars } from "@/lib/cars";
import { Car } from "@/types";

export default function AdminPanel() {
  // Load cars ONCE on mount — no useMemo needed → React Compiler happy!
  const cars: Car[] = (() => {
    try {
      const saved = localStorage.getItem("cars");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as Car[];
      }
    } catch (error) {
      console.error("Failed to load cars:", error);
    }
    return [];
  })();

  const paidCars = getPaidFeaturedCars();
  const totalRevenue = paidCars.length * 50000;

  const featuredCars = cars.filter((c) => c.featuredPaid);
  const freeCars = cars.filter((c) => !c.featuredPaid);

  const deleteCar = (id: string) => {
    if (!confirm("Delete this car permanently?")) return;
    const updated = cars.filter((c) => c.id !== id);
    localStorage.setItem("cars", JSON.stringify(updated));
    alert("Car deleted!");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dubizzle-Style Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-green-600">
              CARS ABEG ADMIN
            </h1>
            <p className="text-gray-600 mt-1">
              Manage listings • Track revenue • Rule Nigeria
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-4xl font-black text-green-600">
              ₦{totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              {paidCars.length} paid × ₦50,000
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 font-bold">Total Listings</p>
            <p className="text-3xl font-black text-gray-900 mt-2">
              {cars.length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm border border-orange-200">
            <p className="text-gray-700 font-bold">Premium Listings</p>
            <p className="text-3xl font-black text-orange-600 mt-2">
              {paidCars.length}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
            <p className="text-gray-700 font-bold">Free Listings</p>
            <p className="text-3xl font-black text-green-600 mt-2">
              {freeCars.length}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
            <p className="text-gray-700 font-bold">Free Slots Left</p>
            <p className="text-3xl font-black text-blue-600 mt-2">
              {Math.max(0, 3 - freeCars.length)}
            </p>
          </div>
        </div>

        {/* Premium Listings */}
        {featuredCars.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black mb-6 text-gray-800">
              Premium Listings (₦50,000 each)
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Car
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Seller
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Price
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Location
                    </th>
                    <th className="text-center p-4 font-bold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featuredCars.map((car) => (
                    <tr key={car.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={car.images[0] || "/placeholder.jpg"}
                            alt={car.model}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-black">
                              {car.year} {car.make} {car.model}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {car.id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold">{car.dealerName}</td>
                      <td className="p-4 font-black text-green-600">
                        ₦{(car.price / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-4">{car.location}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteCar(car.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Free Listings */}
        <section>
          <h2 className="text-2xl font-black mb-6 text-gray-800">
            Free Listings
          </h2>
          {freeCars.length === 0 ? (
            <p className="text-center py-16 text-gray-500 font-bold text-xl">
              No free listings yet
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <Image
                    src={car.images[0] || "/placeholder.jpg"}
                    alt={car.model}
                    width={400}
                    height={300}
                    className="w-full rounded-lg object-cover mb-4"
                  />
                  <h3 className="font-black text-lg">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-green-600 font-bold">
                    ₦{(car.price / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {car.dealerName} • {car.location}
                  </p>
                  <button
                    onClick={() => deleteCar(car.id)}
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
                  >
                    Delete Car
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            CARS ABEG © 2025 • Built by{" "}
            <span className="text-green-600 font-black">YOU</span> •
            Nigeria&apos;s #1
          </p>
        </div>
      </div>
    </div>
  );
}
