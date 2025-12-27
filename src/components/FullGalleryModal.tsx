"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Share2 } from "lucide-react";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

export default function FullGalleryModal({
  images = [],
}: {
  images: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOpen = (searchParams?.get("modal") ?? "") === "gallery";

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      const raf = window.requestAnimationFrame(() => setLightboxOpen(false));
      return () => window.cancelAnimationFrame(raf);
    }
    // no cleanup if isOpen === true
    return;
  }, [isOpen]);

  const slides = useMemo(() => images.map((s) => ({ src: s })), [images]);

  const close = useCallback(() => {
    // remove modal param
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    router.push(url.pathname + url.search);
  }, [router]);

  const openAt = useCallback((i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }, []);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // small visual feedback could be added later
      // For now just console
      console.info("Gallery URL copied to clipboard");
    } catch (e) {
      console.error("Copy failed", e);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col bg-black/70 p-6 md:p-12">
      <div className="flex items-center justify-between mb-4 text-white">
        <div className="flex items-center gap-4">
          <button
            aria-label="Close gallery"
            onClick={close}
            className="p-2 rounded-md bg-black/40 hover:bg-black/30"
          >
            <X />
          </button>

          <div className="font-black text-lg">Photos ({images.length})</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={share}
            className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-md"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      <div className="overflow-auto pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => openAt(i)}
              className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 w-full h-56 sm:h-56 md:h-48"
            >
              <Image
                src={src}
                alt={`photo-${i + 1}`}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {typeof Lightbox !== "undefined" && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
        />
      )}

      {/* index badge while lightbox is open */}
      {lightboxOpen && (
        <div className="fixed bottom-8 right-8 z-[1100] bg-black/60 text-white px-3 py-1 rounded-md text-sm font-bold pointer-events-none">
          {lightboxIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
