"use client";

import React from "react";

export default function ApprovalsChart({
  series,
}: {
  series: { date: string; count: number }[];
}) {
  if (!series || series.length === 0) return <div>No approvals yet</div>;

  const max = Math.max(...series.map((s) => s.count), 1);
  const width = 600;
  const height = 120;
  const padding = 20;
  const points = series
    .map((s, i) => {
      const x = padding + (i / (series.length - 1)) * (width - 2 * padding);
      const y = padding + (1 - s.count / max) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white/5 p-4 rounded">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-300">
          Approvals (last {series.length} days)
        </p>
        <p className="text-xs text-gray-600">
          Total: {series.reduce((s, a) => s + a.count, 0)}
        </p>
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-32"
      >
        <polyline
          points={points}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* area */}
        <polygon
          points={`${points} ${width - padding},${
            height - padding
          } ${padding},${height - padding}`}
          fill="rgba(34,197,94,0.12)"
        />
      </svg>
      <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
        <span>{series[0].date}</span>
        <span>{series[series.length - 1].date}</span>
      </div>
    </div>
  );
}
