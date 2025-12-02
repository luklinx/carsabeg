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
