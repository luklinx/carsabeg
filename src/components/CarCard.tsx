// src/components/CarCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentCarCardProps } from "@/types";
import { formatCompactNumber, formatLocation } from "@/lib/utils";
import { useState } from "react";

function ImageArea({
  images,
  carId,
  featured,
  views,
  variant = "carousel",
}: {
  images: string[];
  carId: string;
  featured?: boolean;
  views?: number;
  variant?: "main" | "collage" | "carousel";
}) {
  const [index, setIndex] = useState(0);
  const [fav, setFav] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  const prev = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (variant !== "carousel") return;
    setStartX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (variant !== "carousel" || startX === null) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }
    setStartX(null);
  };

  const share = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = `${window.location.origin}/car/${carId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Check this car", url });
      } catch {
        // ignore
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div
      className="relative h-full"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {variant === "carousel" ? (
        <div className="relative h-full">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={prev}
              className="bg-white/30 p-1 rounded-full shadow text-gray-900"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={next}
              className="bg-white/30 p-1 rounded-full shadow text-gray-900"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="w-full h-48 md:h-full relative overflow-hidden">
            <Image
              src={images[index] || "/placeholder.jpg"}
              alt="car image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : variant === "collage" ? (
        <div className="flex h-full">
          <div className="relative flex-1 h-48 md:h-full border-r border-gray-100 overflow-hidden">
            <Image
              src={images[0] || "/placeholder.jpg"}
              alt="main"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-24 flex flex-col gap-1 border-l border-gray-100 overflow-hidden">
            <div className="relative h-1/2 border-b border-gray-100">
              <Image
                src={images[1] || images[0] || "/placeholder.jpg"}
                alt="thumb1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-1/2">
              <Image
                src={images[2] || images[0] || "/placeholder.jpg"}
                alt="thumb2"
                fill
                className="object-cover"
              />
              {images.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-sm">
                  +{images.length - 2}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full">
          <div className="w-full h-48 md:h-full relative overflow-hidden">
            <Image
              src={images[0] || "/placeholder.jpg"}
              alt="main"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {featured && (
        <div className="absolute top-2 left-2 z-30 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-md font-extrabold text-[11px] uppercase tracking-wide shadow-sm">
          Premium
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFav((f) => !f);
          }}
          className={`bg-white/30 p-1 rounded-full shadow ${
            fav ? "text-red-500" : "text-gray-900"
          }`}
        >
          <Heart size={16} />
        </button>
        <button
          onClick={share}
          className="bg-white/30 p-1 rounded-full shadow text-gray-900"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="absolute left-2 bottom-2 flex items-center gap-1 bg-white/30 px-2 py-1 rounded-full text-xs text-gray-900">
        <Eye size={14} />{" "}
        <span className="font-bold">
          {formatCompactNumber(Number(views || 0))}
        </span>
      </div>
    </div>
  );
}

export default function CarCard({
  car,
  layout = "card",
  variant: propVariant,
}: ComponentCarCardProps) {
  const isList = layout === "list";
  if (!car?.id) {
    return (
      <div className="bg-red-900 text-white p-10 rounded-3xl text-center font-black text-2xl">
        ERROR: NO CAR ID
      </div>
    );
  }

  // Decide variant: explicit prop > derived from images
  const variant =
    propVariant ??
    (car.images?.length && car.images.length <= 1 ? "main" : "carousel");

  return (
    <div
      className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${
        isList ? "flex flex-row items-stretch gap-4" : "flex flex-col h-full"
      }`}
    >
      {/* IMAGE with carousel / collage + overlays */}
      <Link
        href={`/car/${car.id}`}
        className={`block relative overflow-hidden bg-gray-50 ${
          isList ? "w-48 min-w-[180px]" : "aspect-[4/3]"
        }`}
      >
        <ImageArea
          images={car.images || []}
          carId={car.id}
          featured={!!car.featured_paid}
          views={car.views_count ?? 0}
          variant={variant}
        />
      </Link>

      {/* CONTENT — MAXIMUM WHITE SPACE & DUBIZZLE LAYOUT */}
      <div
        className={`p-3 flex ${
          isList
            ? "flex-col justify-between flex-1"
            : "flex-col flex-grow justify-between"
        } space-y-2`}
      >
        <Link href={`/car/${car.id}`} className="block">
          <p
            className="font-bold"
            style={{ color: "var(--brand-green-dark)", fontSize: "18px" }}
          >
            ₦{(car.price / 1_000_000).toFixed(1)}M
          </p>
        </Link>

        <Link href={`/car/${car.id}`} className="block">
          <h3
            className="font-bold leading-tight line-clamp-2 transition"
            style={{ fontSize: "14px", color: "var(--foreground)" }}
          >
            {car.year} {car.make} {car.model}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
          <span>{car.year}</span>
          <span className="text-gray-700">•</span>
          <span>{car.mileage?.toLocaleString() || "N/A"} km</span>
          {car.transmission && (
            <>
              <span className="text-gray-700">•</span>
              <span>{car.transmission}</span>
            </>
          )}
          {car.condition && (
            <>
              <span className="text-gray-700">•</span>
              <span>{car.condition}</span>
            </>
          )}
        </div>

        <div className="text-sm text-gray-600 truncate">
          {formatLocation(car.state, car.city, car.location) || "Lagos"}
        </div>
      </div>
    </div>
  );
}
