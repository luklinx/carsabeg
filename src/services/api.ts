// src/services/api.ts
import { Car } from "@/types";

// OFFLINE MODE — FULLY TYPED, REALISTIC, SCALABLE
export const fetchCars = async (): Promise<Car[]> => {
  // Simulate network delay (feels real)
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2018,
      price: 8500000,
      mileage: 68000,
      transmission: "Automatic",
      fuel: "Petrol",
      location: "Lagos",
      condition: "Foreign Used",
      images: [
        "https://images.unsplash.com/photo-1609520843994-3178a2c5a2df?w=800",
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
      ],
      featured: true,
      description:
        "Super clean Tokunbo 2018 Toyota Camry. First body, leather seats, thumbstart, reverse camera, accident-free. Duty fully paid.",
      // NEW: Paid Featured Ads (₦50,000)
      featuredPaid: false,
      featuredUntil: "2025-12-25", // e.g. "2025-12-25"
      dealerPhone: "09018837909", // WhatsApp number
      dealerName: "Ashiru Ahmad", // Dealer name
    },
    {
      id: "2",
      make: "Honda",
      model: "Accord",
      year: 2019,
      price: 9200000,
      mileage: 52000,
      transmission: "Automatic",
      fuel: "Petrol",
      location: "Abuja",
      condition: "Foreign Used",
      images: [
        "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
      ],
      featured: true,
      description:
        "Extremely clean 2019 Honda Accord Sport. Full option, panoramic roof, low mileage, Lagos cleared.",
      // NEW: Paid Featured Ads (₦50,000)
      featuredPaid: false,
      featuredUntil: "2025-12-25", // e.g. "2025-12-25"
      dealerPhone: "09018837909", // WhatsApp number
      dealerName: "Ashiru Ahmad", // Dealer name
    },
    {
      id: "3",
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      price: 7200000,
      mileage: 92000,
      transmission: "Automatic",
      fuel: "Petrol",
      location: "Lagos",
      condition: "Nigerian Used",
      images: [
        "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      ],
      description:
        "Very sharp Nigerian-used Corolla. Engine & gear perfect. AC chilling. Buy and drive.",

      // NEW: Paid Featured Ads (₦50,000)
      featured: false,
      featuredPaid: false,
      featuredUntil: "2025-12-25", // e.g. "2025-12-25"
      dealerPhone: "09018837909", // WhatsApp number
      dealerName: "Ashiru Ahmad", // Dealer name
    },
    {
      id: "4",
      make: "Mercedes-Benz",
      model: "C300 4MATIC",
      year: 2017,
      price: 15500000,
      mileage: 45000,
      transmission: "Automatic",
      fuel: "Petrol",
      location: "Lagos",
      condition: "Foreign Used",
      images: [
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
        "https://images.unsplash.com/photo-1618843479313-40f8e899fcce?w=800",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
      ],
      featured: true,
      description:
        "2017 Mercedes-Benz C300 4MATIC. Panoramic roof, AMG kit, red interior, extremely clean.",
      // NEW: Paid Featured Ads (₦50,000)
      featuredPaid: false,
      featuredUntil: "2025-12-25", // e.g. "2025-12-25"
      dealerPhone: "09018837909", // WhatsApp number
      dealerName: "Ashiru Ahmad", // Dealer name
    },
    {
      id: "5",
      make: "Lexus",
      model: "RX 350",
      year: 2016,
      price: 18200000,
      mileage: 71000,
      transmission: "Automatic",
      fuel: "Petrol",
      location: "Port Harcourt",
      condition: "Foreign Used",
      images: [
        "https://images.unsplash.com/photo-1606664515524-ed2a572e11cf?w=800",
        "https://images.unsplash.com/photo-1618843479313-40f8e899fcce?w=800",
      ],
      featured: true,
      description:
        "Full option RX350. Thumbstart, reverse camera, leather seats, accident-free.",
      // NEW: Paid Featured Ads (₦50,000)
      featuredPaid: false,
      featuredUntil: "2025-12-25", // e.g. "2025-12-25"
      dealerPhone: "09018837909", // WhatsApp number
      dealerName: "Ashiru Ahmad", // Dealer name
    },
  ];
};

// Optional: fetch single car (useful later)
export const fetchCarById = async (id: string): Promise<Car | null> => {
  const cars = await fetchCars();
  return cars.find((car) => car.id === id) || null;
};
