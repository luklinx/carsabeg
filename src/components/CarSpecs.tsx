// src/components/CarSpecs.tsx
"use client";

import React from "react";
import {
  Calendar,
  Zap,
  Globe,
  Settings,
  Droplet,
  Box,
  Palette,
  Star,
  MapPin,
} from "lucide-react";
import { formatLocation } from "@/lib/utils";

import type { Car } from "@/types";

interface Props {
  car: Partial<Car> & Record<string, unknown>;
}

export default function CarSpecs({ car }: Props) {
  if (!car) return null;

  const regional = (car.regional_specs ||
    car.region ||
    car.origin ||
    car.regional) as string | undefined;
  const items = [
    { key: "year", label: "Year", value: car.year, Icon: Calendar },
    {
      key: "mileage",
      label: "Kilometers",
      value:
        car.mileage != null
          ? `${Number(car.mileage).toLocaleString()} km`
          : null,
      Icon: Zap,
    },
    { key: "regional", label: "Regional Specs", value: regional, Icon: Globe },
    {
      key: "transmission",
      label: "Transmission",
      value: car.transmission,
      Icon: Settings,
    },
    { key: "fuel", label: "Fuel Type", value: car.fuel, Icon: Droplet },
    { key: "body", label: "Body Type", value: car.body_type, Icon: Box },
    { key: "color", label: "Color", value: car.color, Icon: Palette },
    { key: "condition", label: "Condition", value: car.condition, Icon: Star },
    {
      key: "location",
      label: "Location",
      value: formatLocation(car.state, car.city, car.location),
      Icon: MapPin,
    },
  ];

  const visible = items.filter(
    (i) => i.value !== null && i.value !== undefined && i.value !== ""
  );
  if (visible.length === 0) return null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-black mb-4">Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visible.map(({ key, label, value, Icon }) => (
          <div
            key={key}
            className="flex items-start gap-4 pb-4 border-b last:border-b-0"
          >
            <Icon size={22} className="text-green-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600">{label}</div>
              <div className="font-black text-gray-900 text-base">
                {String(value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
