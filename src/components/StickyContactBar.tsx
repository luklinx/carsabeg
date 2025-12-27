// src/components/StickyContactBar.tsx
"use client";

import { Phone, MessageCircle, Share2, Flag } from "lucide-react";

interface Props {
  phone?: string;
  whatsappUrl?: string;
  price?: string | number | null;
  year?: number | string;
  make?: string;
  model?: string;
  onShare?: () => void;
  onReport?: () => void;
}

export default function StickyContactBar({
  phone = "",
  whatsappUrl = "#",
  price = null,
  year = "",
  make = "",
  model = "",
  onShare,
  onReport,
}: Props) {
  const text = `Hello, I'm interested in the ${year} ${make} ${model} listed on CarsAbeg.ng`;
  const waText = encodeURIComponent(text);
  const waHref =
    whatsappUrl && whatsappUrl !== "#"
      ? whatsappUrl
      : `https://wa.me/?text=${waText}`;

  async function handleShare() {
    if (onShare) return onShare();

    const nav =
      typeof navigator !== "undefined"
        ? (navigator as Navigator & {
            share?: (data: {
              title?: string;
              text?: string;
              url?: string;
            }) => Promise<void>;
          })
        : null;

    if (nav?.share) {
      try {
        await nav.share({
          title: "Car listing",
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // ignore share errors and fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      // small visual feedback could be implemented by parent
      alert("Link copied to clipboard");
    } catch {
      // ignore clipboard errors
    }
  }

  function handleReport() {
    if (onReport) return onReport();
    // fallback: open mailto as a minimal action
    window.open(
      `mailto:report@carsabeg.com?subject=Report%20ad%20${encodeURIComponent(
        String(year) + " " + make + " " + model
      )}`,
      "_blank"
    );
  }

  return (
    <>
      {/* Mobile sticky bar (compact) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow-lg"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2 px-2 py-2">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-gray-600">Price</div>
            <div className="font-black text-sm text-green-600 truncate">
              {price ?? "Contact"}
            </div>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center p-2 bg-green-600 text-white rounded-md shadow-sm"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={16} />
          </a>

          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center p-2 bg-amber-400 text-black rounded-md shadow-sm"
            aria-label="Call seller"
          >
            <Phone size={16} />
          </a>

          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-md text-gray-700"
            aria-label="Share listing"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={handleReport}
            className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-md text-gray-700"
            aria-label="Report listing"
          >
            <Flag size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
