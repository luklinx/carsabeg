"use client";

import { useEffect, useState } from "react";

interface Location {
  state: string;
  cities: string[];
}

export const NIGERIAN_LOCATIONS: Location[] = [
  { state: "Lagos", cities: ["Ikeja", "Lekki", "Victoria Island", "Surulere"] },
  { state: "Abuja", cities: ["Garki", "Maitama", "Asokoro", "Wuse"] },
  { state: "Kano", cities: ["Kano", "Tarauni", "Nassarawa"] },
  { state: "Kaduna", cities: ["Kaduna", "Zaria"] },
  { state: "Port Harcourt", cities: ["Port Harcourt", "Rumuokwuta"] },
];

export default function LocationSelector({
  onChange,
  initialState,
  initialCity,
}: {
  onChange?: (state: string | null, city: string | null) => void;
  initialState?: string | null;
  initialCity?: string | null;
}) {
  const [stateVal, setStateVal] = useState<string | null>(initialState ?? null);
  const [cityVal, setCityVal] = useState<string | null>(initialCity ?? null);
  const [showPrompt, setShowPrompt] = useState(false);

  // hydrate prompt & persisted selection on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissed = localStorage.getItem("carsabeg_location_prompt_dismissed");
      const s = localStorage.getItem("carsabeg_state");
      const c = localStorage.getItem("carsabeg_city");
      if (!initialState && !s && !dismissed) {
        setShowPrompt(true);
      }
      if (!stateVal && s) setStateVal(s);
      if (!cityVal && c) setCityVal(c);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Persist selection locally for simple location-first UX
    try {
      if (stateVal) localStorage.setItem("carsabeg_state", stateVal);
      else localStorage.removeItem("carsabeg_state");
      if (cityVal) localStorage.setItem("carsabeg_city", cityVal);
      else localStorage.removeItem("carsabeg_city");
    } catch (e) {
      // noop on SSR or storage errors
    }
    onChange?.(stateVal, cityVal);
  }, [stateVal, cityVal, onChange]);

  useEffect(() => {
    // hydrate from localStorage if available
    try {
      const s = localStorage.getItem("carsabeg_state");
      const c = localStorage.getItem("carsabeg_city");
      if (!stateVal && s) setStateVal(s);
      if (!cityVal && c) setCityVal(c);
    } catch (e) {}
  }, []);

  const availableCities = NIGERIAN_LOCATIONS.find((l) => l.state === stateVal)?.cities || [];

  return (
    <>
      {/* First-visit modal prompt */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Choose your location</h3>
            <p className="text-sm text-gray-600 mb-4">Select state and city to personalize listings near you. You can change this later.</p>
            <div className="flex gap-3 mb-4">
              <select
                value={stateVal ?? ""}
                onChange={(e) => {
                  const v = e.target.value || null;
                  setStateVal(v);
                  setCityVal(null);
                }}
                className="px-4 py-3 border rounded-lg flex-1"
              >
                <option value="">Select state</option>
                {NIGERIAN_LOCATIONS.map((l) => (
                  <option key={l.state} value={l.state}>
                    {l.state}
                  </option>
                ))}
              </select>

              <select
                value={cityVal ?? ""}
                onChange={(e) => setCityVal(e.target.value || null)}
                className="px-4 py-3 border rounded-lg flex-1"
                disabled={!stateVal}
              >
                <option value="">All cities</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.setItem("carsabeg_location_prompt_dismissed", "1");
                  } catch (e) {}
                  setShowPrompt(false);
                }}
                className="px-4 py-2 rounded bg-gray-100"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  // apply selection and close
                  setShowPrompt(false);
                  onChange?.(stateVal, cityVal);
                  try {
                    if (stateVal) localStorage.setItem("carsabeg_state", stateVal);
                    if (cityVal) localStorage.setItem("carsabeg_city", cityVal);
                  } catch (e) {}
                }}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 items-center justify-center">
      <select
        value={stateVal ?? ""}
        onChange={(e) => {
          const v = e.target.value || null;
          setStateVal(v);
          setCityVal(null);
        }}
        className="px-4 py-3 border rounded-lg"
        aria-label="Select state"
      >
        <option value="">Select state</option>
        {NIGERIAN_LOCATIONS.map((l) => (
          <option key={l.state} value={l.state}>
            {l.state}
          </option>
        ))}
      </select>

      <select
        value={cityVal ?? ""}
        onChange={(e) => setCityVal(e.target.value || null)}
        className="px-4 py-3 border rounded-lg"
        aria-label="Select city"
        disabled={!stateVal}
      >
        <option value="">All cities</option>
        {availableCities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
    </>
  );
}
