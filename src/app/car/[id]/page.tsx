// src/components/CarGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

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
  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setCurrentIndex((i) => (i + 1) % safeImages.length);

  return (
    <div className="relative">
      {/* MAIN HERO IMAGE — FULL BLEED, CINEMATIC */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
        <div className="aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9] relative">
          <Image
            src={safeImages[currentIndex]}
            alt={`${year} ${make} ${model}`}
            fill
            priority
            className="object-cover brightness-95 contrast-110 transition-all duration-700 hover:brightness-100 hover:scale-[1.02]"
            sizes="100vw"
          />

          {/* GRADIENT OVERLAY FOR TEXT READABILITY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* TOP LEFT BADGES */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
            <div className="bg-green-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-2xl backdrop-blur-sm">
              {condition === "Foreign Used"
                ? "TOKUNBO"
                : condition.toUpperCase()}
            </div>
            {featured_paid && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-lg shadow-2xl flex items-center gap-2 animate-pulse">
                PREMIUM LISTING
              </div>
            )}
          </div>

          {/* IMAGE COUNTER + MAXIMIZE HINT */}
          <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm text-white px-5 py-3 rounded-full font-bold text-lg">
              {currentIndex + 1} / {safeImages.length}
            </div>
            <button className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white p-4 rounded-full transition-all hover:scale-110">
              <Maximize2 size={28} />
            </button>
          </div>

          {/* NAVIGATION ARROWS — BIG, BOLD, ALWAYS VISIBLE ON DESKTOP */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-4 rounded-full transition-all hover:scale-110 hidden md:flex"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-4 rounded-full transition-all hover:scale-110 hidden md:flex"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* THUMBNAILS — MODERN, GLASSMORPHIC, HORIZONTAL SCROLL */}
      {safeImages.length > 1 && (
        <div className="mt-6 -mb-4 px-4 md:px-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden snap-center transition-all duration-300 group
                  ${
                    idx === currentIndex
                      ? "ring-4 ring-green-600 ring-offset-4 ring-offset-white shadow-2xl scale-105"
                      : "shadow-lg hover:shadow-2xl hover:scale-105"
                  }`}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-green-600/30" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE SWIPE HINT */}
      {safeImages.length > 1 && (
        <p className="text-center mt-6 text-gray-600 font-medium md:hidden">
          Swipe to see more photos
        </p>
      )}
    </div>
  );
}
