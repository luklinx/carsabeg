// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn = className merge with Tailwind support
 * Used everywhere in shadcn/ui and modern Next.js apps
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into compact form (e.g. 1200 -> 1.2k)
 */
export function formatCompactNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/**
 * Format a location from `state` and `city` fields with fallbacks.
 */
export function formatLocation(state?: string | null, city?: string | null, fallback?: string | null): string {
  const s = state ? String(state).trim() : "";
  const c = city ? String(city).trim() : "";
  if (c && s) return `${c}, ${s}`;
  if (s) return s;
  if (c) return c;
  return fallback ?? "";
}
