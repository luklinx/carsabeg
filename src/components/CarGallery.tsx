// src/components/CarGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  year: number;
  make: string;
  model: string;
  condition: string;
  featured_paid?: boolean;
}

export default function CarGallery({
  images,
  year,
  make,
  model,
  condition,
  featured_paid,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety + fallback
  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];
  const hasMultiple = safeImages.length > 1;

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setCurrentIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="space-y-5">
      {/* MAIN IMAGE */}
      <div className="relative group rounded-3xl overflow-hidden bg-gray-900">
        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={safeImages[currentIndex]}
            alt={`${year} ${make} ${model} - View ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* TOKUNBO / CONDITION BADGE */}
          <div className="absolute top-4 left-4 bg-green-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-2xl z-10">
            {condition === "Foreign Used" ? "TOKUNBO" : condition.toUpperCase()}
          </div>

          {/* PREMIUM BADGE */}
          {featured_paid && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-2xl animate-pulse z-10 flex items-center gap-2">
              PREMIUM
            </div>
          )}

          {/* IMAGE COUNTER */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm z-10">
              {currentIndex + 1} / {safeImages.length}
            </div>
          )}

          {/* ZOOM HINT ON HOVER */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <ZoomIn className="w-16 h-16 text-white drop-shadow-2xl" />
          </div>

          {/* NAVIGATION ARROWS */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
                aria-label="Next image"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* THUMBNAILS — HORIZONTAL SCROLL ON MOBILE */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-lg hover:shadow-2xl
                ${
                  idx === currentIndex
                    ? "border-green-600 ring-4 ring-green-600/30 scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-green-600/40" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* MOBILE SWIPE HINT */}
      {hasMultiple && (
        <p className="text-center text-sm text-gray-500 md:hidden font-medium">
          Swipe or tap arrows to see more photos
        </p>
      )}
    </div>
  );
}
