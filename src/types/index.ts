// src/types.ts
export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: "Foreign Used" | "Nigerian Used";
  images: string[];
  transmission: string;
  fuel: string;
  location: string;
  description?: string;
  featured: boolean;

  // NEW: Paid Featured Ads (₦50,000)
  featuredPaid?: boolean;
  featuredUntil?: string; // e.g. "2025-12-25"
  dealerPhone?: string; // WhatsApp number
  dealerName?: string; // Dealer name
};
