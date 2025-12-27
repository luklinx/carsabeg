"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/useFilters";

export default function FilterTopBar({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = Object.fromEntries(searchParams ?? new URLSearchParams());

  // Use the reusable filter hook
  const {
    local,
    setParam,
    apply: applyFilters,
    clear: clearFilters,
  } = useFilters({ deferApply: true, syncOnMount: true });

  // Helpers to map inputs to filter params
  const parseNumberInput = (v: string) => {
    const s = v.trim();
    if (s === "") return undefined;
    const n = Number(s.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };

  const apply = () => {
    applyFilters();
  };

  const clear = () => {
    clearFilters();
  };

  return (
    <div
      className={`sticky top-20 z-20 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg p-2 md:p-3 flex flex-col md:flex-row items-stretch gap-2 md:gap-3 ${
        className || ""
      }`}
    >
      <div className="flex gap-2 items-center flex-1">
        <input
          className="flex-1 p-2 border rounded-md text-sm"
          placeholder="Make"
          value={local.make ?? ""}
          onChange={(e) => setParam("make", e.target.value || undefined)}
        />
        <input
          className="flex-1 p-2 border rounded-md text-sm"
          placeholder="Model"
          value={local.model ?? ""}
          onChange={(e) => setParam("model", e.target.value || undefined)}
        />
        <input
          className="w-24 p-2 border rounded-md text-sm"
          placeholder="Min"
          value={local.price_min?.toString() ?? ""}
          onChange={(e) =>
            setParam("price_min", parseNumberInput(e.target.value))
          }
        />
        <input
          className="w-24 p-2 border rounded-md text-sm"
          placeholder="Max"
          value={local.price_max?.toString() ?? ""}
          onChange={(e) =>
            setParam("price_max", parseNumberInput(e.target.value))
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={apply}
          className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-bold"
        >
          Apply
        </button>
        <button
          onClick={clear}
          className="border border-gray-200 px-3 py-2 rounded-md text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
