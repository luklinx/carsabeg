"use client";

import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { NIGERIAN_LOCATIONS } from "./LocationSelector";
import { X } from "lucide-react";
import { useFilters } from "../hooks/useFilters";

export default function FilterSidebar({
  onClose,
  deferApply,
}: {
  onClose?: () => void;
  deferApply?: boolean;
}) {
  const router = useRouter();
  const { local, applied, setParam, clear, apply } = useFilters({
    deferApply: deferApply ?? true,
  });

  const getVal = <K extends keyof import("../hooks/useFilters").FiltersParams>(
    key: K
  ) => {
    const v = (deferApply ? local : applied)[key];
    return v === undefined || v === null ? "" : String(v);
  };

  const currentMake = getVal("make").toLowerCase();
  const currentMin = getVal("price_min");
  const currentMax = getVal("price_max");
  const currentState = getVal("state");
  const currentCity = getVal("city");
  const currentYearMin = getVal("year_min");
  const currentYearMax = getVal("year_max");
  const currentTransmission = getVal("transmission");
  const currentFuel = getVal("fuel");

  const [metadata, setMetadata] = useState<{
    seller_types: string[];
    body_types: string[];
    exterior_colors: string[];
    interior_colors: string[];
    market?: string[];
  }>({
    seller_types: [],
    body_types: [],
    exterior_colors: [],
    interior_colors: [],
  });

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      applied.make ||
        applied.model ||
        applied.city ||
        applied.state ||
        applied.price_min != null ||
        applied.price_max != null ||
        applied.year_min != null ||
        applied.year_max != null ||
        applied.transmission ||
        applied.fuel ||
        applied.seller_type ||
        applied.body_type ||
        applied.exterior_color ||
        applied.interior_color ||
        applied.market
    );
  }, [applied]);

  const updateSearchParams = <
    K extends keyof import("../hooks/useFilters").FiltersParams
  >(
    key: K,
    value: string
  ) => {
    // clear dependent city when clearing state
    if (key === "state" && !value) {
      setParam("city" as K, undefined);
    }

    // numeric fields should be parsed
    if (value === "") {
      setParam(key, undefined);
      return;
    }

    if (
      key === "price_min" ||
      key === "price_max" ||
      key === "year_min" ||
      key === "year_max"
    ) {
      const n = Number(value);
      if (Number.isFinite(n))
        setParam(
          key,
          n as unknown as import("../hooks/useFilters").FiltersParams[typeof key]
        );
      else setParam(key, undefined);
      return;
    }

    setParam(
      key,
      value as unknown as import("../hooks/useFilters").FiltersParams[typeof key]
    );
  };

  const clearFilters = () => {
    clear();
    // navigate to base inventory path
    router.push("/inventory", { scroll: false });
  };

  // fetch metadata for selects
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/cars/metadata");
        const json = await res.json();
        if (!mounted) return;
        if (json?.success && json?.data) {
          setMetadata(json.data);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const applyLocal = () => {
    apply();
  };

  return (
    <div className="p-4 w-full md:w-[280px] min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-green-600 font-bold"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-700">
              <X />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="state-select"
            className="block text-xs font-bold mb-1"
          >
            State
          </label>
          <select
            id="state-select"
            value={currentState}
            onChange={(e) => updateSearchParams("state", e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All States</option>
            {NIGERIAN_LOCATIONS.map((l) => (
              <option key={l.state} value={l.state}>
                {l.state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city-select" className="block text-xs font-bold mb-1">
            City
          </label>
          <select
            id="city-select"
            value={currentCity}
            onChange={(e) => updateSearchParams("city", e.target.value)}
            className="w-full p-2 border rounded-lg"
            disabled={!currentState}
          >
            <option value="">All Cities</option>
            {(
              NIGERIAN_LOCATIONS.find((l) => l.state === currentState)
                ?.cities || []
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Make</label>
          <input
            value={currentMake}
            onChange={(e) => updateSearchParams("make", e.target.value)}
            placeholder="e.g., Toyota"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Model</label>
          <input
            value={getVal("model")}
            onChange={(e) => updateSearchParams("model", e.target.value)}
            placeholder="e.g., Corolla"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="seller-type-select"
              className="block text-xs font-bold mb-1"
            >
              Seller type
            </label>
            <select
              id="seller-type-select"
              value={getVal("seller_type")}
              onChange={(e) =>
                updateSearchParams("seller_type", e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              {metadata.seller_types.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="body-type-select"
              className="block text-xs font-bold mb-1"
            >
              Body type
            </label>
            <select
              id="body-type-select"
              value={getVal("body_type")}
              onChange={(e) => updateSearchParams("body_type", e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              {metadata.body_types.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="exterior-color-select"
              className="block text-xs font-bold mb-1"
            >
              Exterior color
            </label>
            <select
              id="exterior-color-select"
              value={getVal("exterior_color")}
              onChange={(e) =>
                updateSearchParams("exterior_color", e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              {metadata.exterior_colors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="interior-color-select"
              className="block text-xs font-bold mb-1"
            >
              Interior color
            </label>
            <select
              id="interior-color-select"
              value={getVal("interior_color")}
              onChange={(e) =>
                updateSearchParams("interior_color", e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              {metadata.interior_colors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Market</label>
          <input
            placeholder="e.g., UAE"
            value={getVal("market")}
            onChange={(e) => updateSearchParams("market", e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold mb-1">Min Price</label>
            <input
              type="number"
              value={currentMin}
              onChange={(e) => updateSearchParams("price_min", e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Max Price</label>
            <input
              type="number"
              value={currentMax}
              onChange={(e) => updateSearchParams("price_max", e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Any"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold mb-1">Year (from)</label>
            <input
              type="number"
              value={currentYearMin}
              onChange={(e) => updateSearchParams("year_min", e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="1998"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Year (to)</label>
            <input
              type="number"
              value={currentYearMax}
              onChange={(e) => updateSearchParams("year_max", e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="2024"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold mb-1">Transmission</label>
            <select
              value={currentTransmission}
              onChange={(e) =>
                updateSearchParams("transmission", e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Fuel</label>
            <select
              value={currentFuel}
              onChange={(e) => updateSearchParams("fuel", e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Any</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/inventory", { scroll: false })}
              className="flex-1 bg-green-600 text-white p-2 rounded-lg font-black text-sm"
            >
              Show All Cars
            </button>
            {deferApply && (
              <button
                onClick={applyLocal}
                className="bg-green-700 text-white p-2 rounded-lg font-black text-sm"
              >
                Apply
              </button>
            )}
          </div>
          <div>
            <button
              onClick={clearFilters}
              className="w-full border border-gray-200 p-2 rounded-lg text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
