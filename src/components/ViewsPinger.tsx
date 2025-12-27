"use client";

import { useEffect } from "react";

export default function ViewsPinger({
  carId,
  serverIncremented = false,
}: {
  carId: string;
  serverIncremented?: boolean;
}) {
  useEffect(() => {
    if (!carId) return;
    const key = `car_viewed_${carId}`;
    const now = Date.now();
    try {
      const raw = localStorage.getItem(key);
      const last = raw ? Number(raw) : 0;

      // If server already incremented during SSR render, mark locally to avoid client ping
      if (serverIncremented) {
        localStorage.setItem(key, String(now));
        return;
      }

      // Dedupe: only send a view if last view was more than 1 hour ago
      const ONE_HOUR = 60 * 60 * 1000;
      if (last && now - last < ONE_HOUR) return;

      // Fire-and-forget POST to increment views
      fetch("/api/cars/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: carId }),
      }).catch((err) => {
        // non-fatal
        console.error("Failed to ping views endpoint", err);
      });

      localStorage.setItem(key, String(now));
    } catch (e) {
      // ignore storage errors
    }
  }, [carId, serverIncremented]);

  return null;
}
