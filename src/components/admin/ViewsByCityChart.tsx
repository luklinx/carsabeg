"use client";

import React from "react";

export default function ViewsByCityChart({
  cities,
}: {
  cities: { city: string; views: number }[];
}) {
  if (!cities || cities.length === 0) return <div>No views data</div>;
  const max = Math.max(...cities.map((c) => c.views), 1);
  return (
    <div className="bg-white/5 p-4 rounded space-y-2">
      <p className="text-sm text-gray-300">Views by City</p>
      <div className="space-y-2 mt-2">
        {cities.slice(0, 8).map((c, i) => (
          <div key={c.city} className="flex items-center gap-3">
            <div className="w-28 text-sm text-gray-200">{c.city}</div>
            <div className="flex-1 h-4 bg-white/10 rounded overflow-hidden">
              <div
                style={{ width: `${(c.views / max) * 100}%` }}
                className="h-4 bg-yellow-400"
              />
            </div>
            <div className="w-20 text-right text-sm text-gray-200">
              {c.views}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
