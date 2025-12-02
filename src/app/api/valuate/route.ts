// src/app/api/valuate/route.ts
import { NextRequest, NextResponse } from "next/server";

// FULLY TYPE-SAFE MULTIPLIERS
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

const CONDITION_MULTIPLIERS = {
  tokunbo: 1.0,
  nigerian: 0.58,
} as const;

const GRADE_MULTIPLIERS = {
  full: 1.0,
  mid: 0.93,
  base: 0.84,
} as const;

const BODY_MULTIPLIERS = {
  first: 1.0,
  touchup: 0.92,
  repainted: 0.82,
  accident: 0.58,
} as const;

// BASE PRICES — FULLY TYPED
const BASE_PRICES = {
  toyota: {
    camry: 16500000,
    corolla: 14200000,
    rav4: 18800000,
    highlander: 24800000,
  },
  honda: { accord: 10800000, "cr-v": 11800000, civic: 8500000 },
  mercedes: { c300: 23800000, gle: 42800000 },
  lexus: { rx350: 26800000, es350: 18800000 },
  bmw: { x3: 28800000, x5: 39800000 },
  hyundai: { sonata: 10800000, tucson: 12800000 },
  kia: { optima: 10200000, sorento: 13800000 },
} as const;

// TYPE-SAFE KEYS
type Make = keyof typeof BASE_PRICES;
type Model<T extends Make> = keyof (typeof BASE_PRICES)[T];
type Year = keyof typeof YEAR_MULTIPLIERS;
type Location = keyof typeof LOCATION_MULTIPLIERS;

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
    mileage = 65000,
    grade,
    body,
    location,
  } = input;

  const makeKey = make.toLowerCase().replace(/[^a-z]/g, "") as Make;
  const modelKey = model.toLowerCase().replace(/[^a-z-]/g, "") as string;

  // SAFE BASE PRICE LOOKUP
  const makePrices = BASE_PRICES[makeKey];
  let base = makePrices
    ? makePrices[modelKey as keyof typeof makePrices] ?? 14000000
    : 14000000;

  // SAFE YEAR LOOKUP
  const yearKey = year as Year;
  base *= YEAR_MULTIPLIERS[yearKey] ?? 0.85;

  // SAFE MULTIPLIERS
  base *= CONDITION_MULTIPLIERS[condition];
  base *= GRADE_MULTIPLIERS[grade];
  base *= BODY_MULTIPLIERS[body];
  base *= LOCATION_MULTIPLIERS[location as Location] ?? 1.0;

  // MILEAGE PENALTY
  if (mileage > 120000) base *= 0.75;
  else if (mileage > 90000) base *= 0.88;
  else if (mileage > 60000) base *= 0.95;

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
    console.error("AI Valuation Error:", error);
    return NextResponse.json(
      { success: false, error: "Valuation failed" },
      { status: 500 }
    );
  }
}
