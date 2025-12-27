import React from "react";
import { Heart } from "lucide-react";
import ShareDropdown from "@/components/ui/ShareDropdown";
import PostedAgo from "@/components/PostedAgo";
import { MapPin, Eye } from "lucide-react";
import { formatCompactNumber, formatLocation } from "@/lib/utils";
import type { Car } from "@/types";

interface Props {
  car: Car;
  formattedPrice: string;
  viewsMeta?: number;
  className?: string;
}

export default function PriceCard({
  car,
  formattedPrice,
  viewsMeta,
  className = "",
}: Props) {
  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 relative ${className}`}
    >
      {/* top-right icons (stay absolute) */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        <button
          aria-label="Save"
          className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Heart size={14} />
        </button>
        <ShareDropdown compact />
      </div>

      <div className="text-sm text-gray-600">Price</div>
      <div className="text-4xl sm:text-3xl font-extrabold text-emerald-700">
        ₦{formattedPrice}
      </div>

      <h3 className="mt-3 text-lg sm:text-l font-medium text-gray-900">
        {car.year} {car.make} {car.model}
      </h3>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-green-600" />
          <span className="truncate">
            {formatLocation(car.state, car.city, car.location) || "Lagos"}
          </span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-2">
          <PostedAgo createdAt={car.created_at} />
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1">
          <Eye size={14} />
          <span>{formatCompactNumber(Number(viewsMeta || 0))} views</span>
        </div>
      </div>
    </div>
  );
}
