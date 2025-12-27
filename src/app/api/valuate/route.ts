// src/app/api/valuate/route.ts
import { NextRequest, NextResponse } from "next/server";

const YEAR_MULTIPLIERS = {
  2025: 1.75,
  2024: 1.6,
  2023: 1.45,
  2022: 1.3,
  2021: 1.15,
  2020: 1.05,
  2019: 1.0,
  2018: 0.95,
  2017: 0.88,
  2016: 0.8,
  2015: 0.72,
  2014: 0.65,
  2013: 0.58,
} as const;

const LOCATION_MULTIPLIERS = {
  Lagos: 1.0,
  Abuja: 1.09,
  "Port Harcourt": 1.06,
  "Other Cities": 1.02,
} as const;

const CONDITION_MULTIPLIERS = { tokunbo: 1.0, nigerian: 0.58 } as const;
const GRADE_MULTIPLIERS = { full: 1.0, mid: 0.93, base: 0.84 } as const;
const BODY_MULTIPLIERS = {
  first: 1.0,
  touchup: 0.92,
  repainted: 0.82,
  accident: 0.58,
} as const;

// LUXURY TIER
const LUXURY_PRICES: Record<string, Record<string, Record<number, number>>> = {
  "mercedes-benz": {
    "g-class-g-63-amg": {
      2021: 385_000_000,
      2020: 365_000_000,
      2022: 420_000_000,
    },
    gle: { 2023: 185_000_000 },
  },
  toyota: {
    "land-cruiser": { 2021: 485_000_000, 2022: 520_000_000 },
  },
  lexus: { lx570: { 2021: 320_000_000 } },
  bmw: { x7: { 2022: 280_000_000 } },
};

// STANDARD BASE PRICES — FULLY TYPED
const BASE_PRICES = {
  toyota: {
    camry: 16_500_000,
    corolla: 14_200_000,
    rav4: 18_800_000,
    highlander: 24_800_000,
  },
  honda: { accord: 10_800_000, "cr-v": 11_800_000, civic: 8_500_000 },
  mercedes: { c300: 23_800_000, gle: 42_800_000 },
  lexus: { rx350: 26_800_000, es350: 18_800_000 },
  bmw: { x3: 28_800_000, x5: 39_800_000 },
  hyundai: { sonata: 10_800_000, tucson: 12_800_000 },
  kia: { optima: 10_200_000, sorento: 13_800_000 },
} as const;

// TYPE-SAFE KEYS
type Make = keyof typeof BASE_PRICES;
type Model<M extends Make> = keyof (typeof BASE_PRICES)[M];
type YearKey = keyof typeof YEAR_MULTIPLIERS;

interface ValuationInput {
  make: string;
  model: string;
  year: number;
  condition: "tokunbo" | "nigerian";
  mileage?: number;
  grade: "full" | "mid" | "base";
  body: "first" | "touchup" | "repainted" | "accident";
  location: string;
}

function predictPrice(input: ValuationInput): { min: number; max: number } {
  const {
    make,
    model,
    year,
    condition,
    mileage = 65_000,
    grade,
    body,
    location,
  } = input;

  const makeKey = make.toLowerCase().replace(/[^a-z]/g, "") as Make;
  const modelKey = model.toLowerCase().replace(/[^a-z-]/g, "");

  let base = 14_000_000; // fallback

  // 1. LUXURY TIER CHECK
  const luxuryMake = LUXURY_PRICES[makeKey];
  if (luxuryMake?.[modelKey]?.[year]) {
    base = luxuryMake[modelKey][year];
  } else {
    // 2. STANDARD BASE — 100% TYPE-SAFE
    const makePrices = BASE_PRICES[makeKey];
    if (makePrices && modelKey in makePrices) {
      base = makePrices[modelKey as keyof typeof makePrices] as number;
    }
    // If model not found → keep fallback
  }

  // Apply multipliers
  base *= YEAR_MULTIPLIERS[year as YearKey] ?? 0.85;
  base *= CONDITION_MULTIPLIERS[condition];
  base *= GRADE_MULTIPLIERS[grade];
  base *= BODY_MULTIPLIERS[body];
  base *=
    LOCATION_MULTIPLIERS[location as keyof typeof LOCATION_MULTIPLIERS] ?? 1.0;

  // Mileage penalty
  if (mileage > 120_000) base *= 0.75;
  else if (mileage > 90_000) base *= 0.88;
  else if (mileage > 60_000) base *= 0.95;

  const min = Math.round(base * 0.88) / 1_000_000;
  const max = Math.round(base * 1.18) / 1_000_000;

  return {
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ValuationInput = await req.json();
    const result = predictPrice(body);

    return NextResponse.json({
      success: true,
      valuation: result,
    });
  } catch (error) {
    console.error("Valuation failed:", error);
    return NextResponse.json(
      { success: false, error: "AI is thinking... Try again!" },
      { status: 500 }
    );
  }
}
