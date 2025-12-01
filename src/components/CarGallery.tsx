// src/components/CarGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
}

export default function CarGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safety + fallback
  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];
  const hasMultiple = safeImages.length > 1;

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setCurrentIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="space-y-5">
      {/* MAIN IMAGE WITH ZOOM HINT + NAV BUTTONS */}
      <div className="relative group rounded-3xl overflow-hidden bg-gray-900">
        <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[5/3] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={safeImages[currentIndex]}
            alt={`Car view ${currentIndex + 1} of ${safeImages.length}`}
            fill
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            className="object-cover transition-all duration-500 group-hover:scale-110"
          />

          {/* Zoom Hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-16 h-16 text-white drop-shadow-2xl" />
          </div>

          {/* Counter Badge */}
          {hasMultiple && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full font-black text-sm backdrop-blur-sm">
              shadow-lg
              {currentIndex + 1} / {safeImages.length}
            </div>
          )}

          {/* Premium Badge (if first image is premium) */}
          {currentIndex === 0 &&
            images.length > 0 &&
            images[0].includes("premium") && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-2xl animate-pulse">
                PREMIUM
              </div>
            )}
        </div>

        {/* Navigation Arrows - Show on hover */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-400">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-md hover:shadow-xl
                ${
                  idx === currentIndex
                    ? "border-green-600 scale-110 ring-4 ring-green-600/30"
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
              {/* Active indicator */}
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-green-600/30" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile swipe hint */}
      {hasMultiple && (
        <p className="text-center text-sm text-gray-500 md:hidden">
          Swipe or use arrows to view more photos
        </p>
      )}
    </div>
  );
}
