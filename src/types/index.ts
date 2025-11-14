// src/types/index.ts
export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "automatic" | "manual";
  fuel: "petrol" | "diesel" | "hybrid";
  location: string;
  condition: "brand new" | "foreign used" | "nigerian used";
  images: string[];
  featured?: boolean;
};
