"use client";

import { useEffect, useState } from "react";
import CarCard from "@/components/CarCard";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialCars: any[];
}

export default function InventoryClient({ initialCars }: Props) {
  const [cars, setCars] = useState(initialCars || []);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json?.is_admin) setIsAdmin(true);
      } catch (e) {
        // ignore
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, []);

  async function toggleApproved(id: string, current: boolean) {
    setLoadingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/dashboard/cars/${id}/approve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ approved: !current }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update");
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: json.data.approved } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update listing");
    } finally {
      setLoadingIds((s) => s.filter((x) => x !== id));
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div key={car.id} className="relative">
          <CarCard car={car} />
          {isAdmin && (
            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow">
              <button
                onClick={() => toggleApproved(car.id, !!car.approved)}
                disabled={loadingIds.includes(car.id)}
                className="px-3 py-1 rounded-full text-sm font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {car.approved ? "Unpublish" : "Publish"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
