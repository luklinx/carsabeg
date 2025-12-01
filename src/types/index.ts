// src/types.ts

export type CarCondition = "Foreign Used" | "Nigerian Used";

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: CarCondition;
  images: string[];
  transmission: string;
  fuel: string;
  location: string;
  created_at: string;
  description?: string;
  featured: boolean;
  approved: boolean;

  // NEW: Paid Featured Ads (₦50,000)
  featured_paid?: boolean;
  featured_until?: string; // e.g. "2025-12-25"
  dealer_phone?: string; // WhatsApp number
  dealer_name?: string; // Dealer name
};
