// src/lib/cars.ts
import { createClient } from "@supabase/supabase-js";
import type { Car } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This line throws error if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// PUBLIC: Only approved + visible cars
export async function getCars(): Promise<Car[]> {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (data as Car[]) || [];
}

// PREMIUM SECTION on homepage
export async function getPaidFeaturedCars(): Promise<Car[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("approved", true)
    .eq("featured_paid", true)
    .gte("featured_until", today)
    .order("created_at", { ascending: false });

  return (data as Car[]) || [];
}
