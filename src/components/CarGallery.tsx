// src/components/CarGallery.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

export default function CarGallery({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={images[currentIndex] || "/placeholder.jpg"}
          alt="Car image"
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
              idx === currentIndex ? "border-green-600" : "border-gray-300"
            } overflow-hidden`}
          >
            <Image
              src={img || "/placeholder.jpg"}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
