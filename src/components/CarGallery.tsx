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
    <div className="space-y-4 sm:space-y-5">
      {/* MAIN IMAGE */}
      <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900">
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
          <Image
            src={safeImages[currentIndex]}
            alt={`${year} ${make} ${model} - View ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* TOKUNBO / CONDITION BADGE */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full font-black text-sm sm:text-xl shadow-lg sm:shadow-2xl z-10">
            {condition === "Foreign Used" ? "TOKUNBO" : condition.toUpperCase()}
          </div>

          {/* PREMIUM BADGE */}
          {featured_paid && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 sm:px-6 py-2 sm:py-3 rounded-full font-black text-xs sm:text-lg shadow-lg sm:shadow-2xl animate-pulse z-10 flex items-center gap-2">
              PREMIUM
            </div>
          )}

          {/* IMAGE COUNTER */}
          {hasMultiple && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/70 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm backdrop-blur-sm z-10">
              {currentIndex + 1} / {safeImages.length}
            </div>
          )}

          {/* ZOOM HINT ON HOVER */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <ZoomIn className="w-10 sm:w-16 h-10 sm:h-16 text-white drop-shadow-2xl" />
          </div>

          {/* NAVIGATION ARROWS */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-4 rounded-full opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="sm:w-[36px] sm:h-[36px]" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 sm:p-4 rounded-full opacity-0 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-20"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="sm:w-[36px] sm:h-[36px]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* THUMBNAILS — HORIZONTAL SCROLL ON MOBILE */}
      {hasMultiple && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-3 px-1 -mx-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex-nowrap w-full">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-2xl overflow-hidden border-3 sm:border-4 transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl
                ${
                  idx === currentIndex
                    ? "border-green-600 ring-3 sm:ring-4 ring-green-600/30 scale-105 sm:scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={112}
                height={112}
                className="object-cover w-full h-full block"
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
