// src/types.ts

export type CarCondition = "Foreign Used" | "Nigerian Used" | "Brand New";

export interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  condition: CarCondition;
  location?: string;
  mileage?: number;
  transmission?: string;
  fuel?: string;
  description?: string | null;
  dealer_name: string;
  dealer_phone: string;
  images: string[];
  featured: boolean;
  featured_paid?: boolean;
  featured_until?: string;
  approved: boolean;
  created_at?: string;
}
