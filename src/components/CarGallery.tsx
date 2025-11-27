// src/components/CarGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

export default function CarGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if images array is empty
  const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative h-96 w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={safeImages[currentIndex]}
          alt={`Car main view - ${currentIndex + 1}`}
          fill
          priority={currentIndex === 0} // First image loads fast
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-4 transition-all ${
                idx === currentIndex
                  ? "border-green-600 shadow-lg scale-105"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
