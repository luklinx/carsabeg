"use client";

import React from "react";

export default function InspectionSlotList({
  slots,
  onSelect,
  selectedId,
}: any) {
  if (!slots || !slots.length) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-bold text-[var(--brand-green-dark)] mb-2">
        Available slots
      </div>
      <div className="grid grid-cols-1 gap-2">
        {slots.map((s: any) => {
          const start = new Date(s.start_at);
          const label = start.toLocaleString();
          const disabled = !s.available;
          const selected = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => !disabled && onSelect(s)}
              className={`w-full text-left px-3 py-2 rounded-lg border ${
                disabled
                  ? "bg-[var(--table-head-bg)] text-gray-600 border-gray-200"
                  : selected
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-[var(--foreground)] border-gray-200 hover:bg-gray-50"
              }`}
              disabled={disabled}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{label}</div>
                <div className="text-xs">{disabled ? "Booked" : "Open"}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
