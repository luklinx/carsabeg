"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

interface Props {
  title: string;
  price: string;
  sellerName?: string;
  sellerAvatar?: string;
  sellerJoined?: string;
  listingsCount?: number;
  listingsUrl?: string;
  rating?: { average: number; total: number };
  isVerified?: boolean;
  phone?: string;
  whatsappUrl?: string;
  image?: string;
  targetId?: string; // id of the element to observe (hide bar while visible)
  compact?: boolean;
}

export default function FloatingCarBar({
  title,
  price,
  sellerName,
  sellerAvatar,
  sellerJoined,
  listingsCount,
  listingsUrl,
  rating,
  isVerified,
  phone,
  whatsappUrl,
  image,
  targetId = "basic-info",
  compact = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    let retry = 0;
    let retryTimer: number | undefined;
    let scrollHandler: (() => void) | null = null;

    function attachObserverOnce(): boolean {
      const el = document.getElementById(targetId);
      if (!el) return false;

      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // when target is NOT visible => show the bar
            setVisible(!entry.isIntersecting);
          });
        },
        { root: null, threshold: 0 }
      );

      obs.observe(el);
      return true;
    }

    function fallbackToScroll() {
      // if the observed element never appears, use scroll position as a fallback
      const check = () => setVisible(window.scrollY > 200);
      check();
      scrollHandler = check;
      window.addEventListener("scroll", scrollHandler);
    }

    const tryAttach = () => {
      if (attachObserverOnce()) return;
      retry++;
      if (retry <= 6) {
        retryTimer = window.setTimeout(tryAttach, 150);
      } else {
        console.warn(
          `FloatingCarBar: could not find target #${targetId}, falling back to scroll heuristic`
        );
        fallbackToScroll();
      }
    };

    tryAttach();

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      if (obs) obs.disconnect();
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    };
  }, [targetId]);

  // manage mount animation when `visible` becomes true
  // Avoid calling setState synchronously inside an effect — schedule it on the next frame
  useEffect(() => {
    let id: number | undefined;
    if (visible) {
      // schedule mount on the next animation frame to avoid cascading renders
      id = window.requestAnimationFrame(() => setMounted(true));
    } else {
      // delay unmount to allow exit animation
      id = window.setTimeout(() => setMounted(false), 250);
    }
    return () => {
      if (typeof id === "number") {
        // cancel both possible handles safely
        try {
          window.cancelAnimationFrame(id);
        } catch {
          /* ignore */
        }
        try {
          window.clearTimeout(id);
        } catch {
          /* ignore */
        }
      }
    };
  }, [visible]);

  // Avoid displaying an empty/loading bar — only render when we have the important content
  const isPlaceholder = (s?: string) =>
    !s || /loading/i.test(s) || s.includes("…") || s.includes("...");

  if (isPlaceholder(title) || isPlaceholder(price) || isPlaceholder(sellerName))
    return null;

  if (!visible && !mounted) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 pointer-events-auto">
      <div
        className={`backdrop-blur-sm bg-white/95 border-b border-gray-200 transition-transform duration-250 ease-out will-change-transform ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
        style={{
          transitionProperty: "transform, opacity",
          transitionDuration: "220ms",
        }}
        role="region"
        aria-label="Car quick actions"
      >
        {/* Compact layout when requested (expanded to include seller name + CTAs) */}
        {compact ? (
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {image ? (
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  <Image
                    src={image}
                    alt={title}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-md bg-gray-100 flex-shrink-0" />
              )}

              <div className="min-w-0">
                <div className="text-sm sm:text-base font-extrabold truncate text-gray-900">
                  {title}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm sm:text-base text-green-600 font-extrabold">
                    {price}
                  </div>

                  {rating && (
                    <div className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      ★ {rating.average}
                    </div>
                  )}

                  {isVerified && (
                    <div
                      title="Verified seller"
                      className="inline-flex items-center text-green-600 px-2 py-0.5 rounded-full text-xs font-semibold"
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 1.5l2.5 1.7 2.9-.3 1.2 2.3 2.1 1-1 2.1.7 2.9-2.2 1.6.2 2.9L15.5 23l-2.5-1.7L10 23l-1.8-1.2.2-2.9L6 17.3 3.8 15.7 5 13.7 4 11.6 5.2 10 6.4 8l2.9.3L12 6.5z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/** seller name underneath */}
                <div className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">
                  <div className="flex items-center gap-2">
                    {sellerAvatar && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={sellerAvatar}
                          alt={sellerName || "Seller"}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    )}

                    <a
                      href={listingsUrl || "#"}
                      className="font-semibold text-gray-800 hover:underline"
                    >
                      {sellerName}
                    </a>

                    {sellerJoined && (
                      <span className="text-xs text-gray-600 ml-2">
                        • Joined{" "}
                        {(() => {
                          const d = new Date(sellerJoined as string);
                          const months = [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ];
                          return `${
                            months[d.getUTCMonth()]
                          } ${d.getUTCFullYear()}`;
                        })()}
                      </span>
                    )}
                  </div>

                  {typeof listingsCount === "number" && (
                    <div className="text-xs text-gray-600 mt-0.5">
                      <a
                        href={listingsUrl || "#"}
                        className="text-green-600 font-bold hover:underline"
                      >
                        {listingsCount} listing{listingsCount === 1 ? "" : "s"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg font-bold text-sm"
                  aria-label="Message seller"
                >
                  <MessageCircle size={16} /> Message
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold text-sm"
                  aria-label="Call seller"
                >
                  <Phone size={16} /> Call
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {image ? (
                <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  <Image
                    src={image}
                    alt={title}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-md bg-gray-100 flex-shrink-0" />
              )}

              <div className="min-w-0">
                <div className="text-base font-extrabold truncate text-gray-900">
                  {title}
                </div>
                <div className="text-base text-green-600 font-extrabold">
                  {price}
                </div>
                <div className="text-sm text-gray-600 truncate mt-0.5">
                  {sellerName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg font-bold text-sm"
                >
                  <MessageCircle size={16} /> Message
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold text-sm"
                >
                  <Phone size={16} /> Call
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
