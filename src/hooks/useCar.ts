// src/hooks/useCar.ts
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import type { Car } from "@/types";

export function useCar(carId: string | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!carId) {
      setLoading(false);
      return;
    }

    async function fetchCar() {
      try {
        const { data, error } = await supabaseBrowser
          .from("cars")
          .select("*")
          .eq("id", carId)
          .single();

        if (error) throw error;
        setCar(data);
      } catch (err) {
        console.error("Failed to load car:", err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [carId]);

  return { car, loading };
}
