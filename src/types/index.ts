// src/types/index.ts
export type Car = {
  id: string; // ← REALITY: IDs are strings ("1", "2")
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: string;
  condition: string;
  images: string[];
  featured?: boolean;
  description?: string;
};
