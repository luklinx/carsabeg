// src/components/CarGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

// If you don't have the lightbox package installed, it's already added and styles are imported in globals.css.

interface Props {
  images: string[];
}

export default function CarGallery({ images = [] }: Props) {
  const safeImages =
    images && images.length > 0 ? images : ["/placeholder.jpg"];

  const [loaded, setLoaded] = useState<boolean[]>(() =>
    Array(safeImages.length).fill(false)
  );

  const router = useRouter();

  // open the full gallery modal via query param
  function openGalleryModal(e?: React.MouseEvent) {
    e?.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set("modal", "gallery");
    router.push(url.pathname + url.search);
  }

  // mark image as loaded (for skeleton)
  function markLoaded(i: number) {
    setLoaded((prev) => {
      const copy = prev.slice();
      copy[i] = true;
      return copy;
    });
  }

  return (
    <div
      className="w-full group cursor-pointer relative"
      onClick={(e) => openGalleryModal(e)}
    >
      {/* View all photos (opens full gallery modal) */}
      <button
        onClick={(e) => openGalleryModal(e)}
        className="absolute top-2 right-3 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm z-10"
        aria-label="View all photos"
      >
        View all photos
      </button>
      {/* Collage layout */}
      {safeImages.length === 0 ? (
        <div className="w-full rounded-2xl bg-gray-100 h-64 flex items-center justify-center">
          <div className="text-gray-600">No photos</div>
        </div>
      ) : safeImages.length === 1 ? (
        <div className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
          <div className="relative w-full h-[320px] sm:h-[380px]">
            {!loaded[0] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <Image
              src={safeImages[0]}
              alt="photo"
              fill
              onLoadingComplete={() => markLoaded(0)}
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="hidden md:flex md:gap-[10px] no-radius">
            <div className="w-[730.662px] overflow-hidden shadow-lg">
              <div className="relative h-[500px] main-image-container overflow-hidden">
                {!loaded[0] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src={safeImages[0]}
                  alt="main photo"
                  fill
                  priority
                  onLoadingComplete={() => markLoaded(0)}
                  className="object-cover main-collage-img"
                />
              </div>
            </div>

            <div className="w-[365.337px] flex flex-col gap-4">
              <button
                onClick={(e) => openGalleryModal(e)}
                className="relative overflow-hidden shadow-sm cursor-pointer"
              >
                <div className="relative h-1/2 min-h-[246px] small-top-container overflow-hidden">
                  {!loaded[1] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <Image
                    src={safeImages[1]}
                    alt="photo 2"
                    fill
                    priority
                    onLoadingComplete={() => markLoaded(1)}
                    className="object-cover small-collage-img small-top"
                  />
                </div>
              </button>

              {safeImages.length >= 3 ? (
                <button
                  onClick={(e) => openGalleryModal(e)}
                  className="relative overflow-hidden shadow-sm"
                >
                  <div className="relative h-1/2 min-h-[246px] small-bottom-container overflow-hidden">
                    {!loaded[2] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={safeImages[2]}
                      alt="photo 3"
                      fill
                      priority
                      onLoadingComplete={() => markLoaded(2)}
                      className="object-cover small-collage-img"
                    />

                    {safeImages.length > 3 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-xs flex items-center gap-1">
                        <Camera size={14} />{" "}
                        <span>+{safeImages.length - 3}</span>
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                // when there are only two images, use the second slot as a tall single tile
                <div className="relative overflow-hidden shadow-sm h-full">
                  <div className="relative h-full small-top-container overflow-hidden">
                    {!loaded[1] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={safeImages[1]}
                      alt="photo 2"
                      fill
                      priority
                      onLoadingComplete={() => markLoaded(1)}
                      className="object-cover small-collage-img small-top"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden">
            <div className="overflow-hidden shadow-lg mb-3">
              <div className="relative h-[350px] main-image-container overflow-hidden">
                {" "}
                {!loaded[0] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src={safeImages[0]}
                  alt="main photo"
                  fill
                  priority
                  onLoadingComplete={() => markLoaded(0)}
                  className="object-cover main-collage-img"
                />
              </div>
            </div>

            <div className="flex gap-[10px]">
              {safeImages[1] && (
                <button
                  onClick={(e) => openGalleryModal(e)}
                  className="relative overflow-hidden flex-1 h-[180px]"
                >
                  <div className="relative h-full small-top-container overflow-hidden">
                    {!loaded[1] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={safeImages[1]}
                      alt="photo 2"
                      fill
                      priority
                      onLoadingComplete={() => markLoaded(1)}
                      className="object-cover small-collage-img small-top"
                    />
                  </div>
                </button>
              )}

              {safeImages.length >= 3 ? (
                <button
                  onClick={(e) => openGalleryModal(e)}
                  className="relative overflow-hidden flex-1 h-[180px]"
                >
                  <div className="relative h-full small-bottom-container overflow-hidden">
                    {!loaded[2] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={safeImages[2]}
                      alt="photo 3"
                      fill
                      priority
                      onLoadingComplete={() => markLoaded(2)}
                      className="object-cover small-collage-img small-bottom"
                    />
                  </div>

                  {safeImages.length > 3 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-sm text-xs flex items-center gap-1">
                      <Camera size={14} /> <span>+{safeImages.length - 3}</span>
                    </div>
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
