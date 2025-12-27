// src/components/HeaderClean.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  MessageCircle as WhatsAppIcon,
  MessageCircle,
  Home,
  Car,
  DollarSign,
  Search,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import Logo from "@/components/Logo";
import UserNav from "@/components/UserNav";
import CustomButton from "@/components/CustomButton";

export default function HeaderClean() {
  const pathname = usePathname();
  const isCarPage = pathname ? pathname.startsWith("/car/") : false;

  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showTopNav, setShowTopNav] = useState(!isCarPage);

  const [carInfo, setCarInfo] = useState<{
    title?: string | null;
    price?: string | null;
    location?: string | null;
    condition?: string | null;
  }>({});

  // track the Y position at which to show the sticky car header (below images)
  const [stickyTriggerY, setStickyTriggerY] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // determine sticky trigger point and car meta from DOM (if present)
    let imagesEl: Element | null = null;
    let metaEl: HTMLElement | null = null;
    let observer: MutationObserver | null = null;

    const setupFromDom = () => {
      imagesEl = document.querySelector(
        "#product-images, [data-product-images]"
      );
      metaEl = document.querySelector("#product-meta") as HTMLElement | null;

      if (imagesEl) {
        const rect = (imagesEl as HTMLElement).getBoundingClientRect();
        setStickyTriggerY(window.scrollY + rect.bottom);
      }

      if (metaEl) {
        const dataset = metaEl.dataset;
        setCarInfo({
          title: dataset.name ?? metaEl.getAttribute("data-title") ?? null,
          price: dataset.price ?? metaEl.getAttribute("data-price") ?? null,
          location:
            dataset.location ?? metaEl.getAttribute("data-location") ?? null,
          condition:
            dataset.condition ?? metaEl.getAttribute("data-condition") ?? null,
        });

        // observe changes to data attributes (in case page hydrates later)
        observer = new MutationObserver(() => {
          const ds = metaEl!.dataset;
          setCarInfo({
            title: ds.name ?? metaEl!.getAttribute("data-title") ?? null,
            price: ds.price ?? metaEl!.getAttribute("data-price") ?? null,
            location:
              ds.location ?? metaEl!.getAttribute("data-location") ?? null,
            condition:
              ds.condition ?? metaEl!.getAttribute("data-condition") ?? null,
          });
        });

        observer.observe(metaEl, {
          attributes: true,
          attributeFilter: [
            "data-name",
            "data-price",
            "data-location",
            "data-condition",
            "data-title",
          ],
        });
      }
    };

    setupFromDom();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isCarPage) {
        // Don't show the main top nav on car detail pages; we'll use a floating header inside the detail page instead
        setShowTopNav(false);
        setShowBottomNav(true);
      } else if (currentScrollY < lastScrollY) {
        setShowTopNav(true);
        setShowBottomNav(false);
      }

      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // re-run DOM setup on resize (gallery sizes may change)
    window.addEventListener("resize", setupFromDom);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", setupFromDom);
      if (observer) observer.disconnect();
    };
  }, [lastScrollY, isCarPage, stickyTriggerY]);

  // fetch auth status only on client (async, guarded to avoid sync setState in effect)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (!mounted) return;
        setIsLoggedIn(res.ok);
      } catch {
        if (!mounted) return;
        setIsLoggedIn(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Prefer DOM-provided car info when available
  const carTitle = isCarPage && showTopNav ? carInfo.title ?? null : null;
  const carPrice = isCarPage && showTopNav ? carInfo.price ?? null : null;
  const carLocation = isCarPage && showTopNav ? carInfo.location ?? null : null;
  const carCondition =
    isCarPage && showTopNav ? carInfo.condition ?? null : null;

  return (
    <>
      {/* VERIFICATION BAR */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-2 text-center font-black text-xs shadow-lg">
        <Link href="/auth/signup" className="hover:underline">
          Get verified to boost credibility!
          <span className="ml-2 bg-black text-yellow-400 px-2 py-0.5 rounded text-xs animate-pulse">
            VERY NOW
          </span>
        </Link>
      </div>

      {/* MAIN HEADER */}
      <header
        className={`bg-white fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          showTopNav ? "translate-y-0 shadow-md" : "-translate-y-full"
        }`}
      >
        <div className="px-3 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* LEFT */}
            {isCarPage ? (
              <Link href="/" className="text-gray-800">
                <ArrowLeft size={24} />
              </Link>
            ) : (
              <Link href="/">
                <Logo logoSrc="/logo.webp" alt="CarsAbeg" size="sm" />
              </Link>
            )}

            {/* CENTER: Car Info */}
            {isCarPage && showTopNav && (
              <div className="flex-1 text-center px-2">
                {carTitle ? (
                  <h2 className="font-black text-sm truncate">{carTitle}</h2>
                ) : null}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mt-1">
                  <span className="text-green-600 font-black">{carPrice}</span>
                  <span>•</span>
                  <span>{carLocation}</span>
                  <span>•</span>
                  <span className="text-yellow-600 font-bold">
                    {carCondition}
                  </span>
                </div>
              </div>
            )}

            {/* RIGHT */}
            {isCarPage ? (
              <div className="flex items-center gap-3">
                <CustomButton
                  aria-label="Share"
                  containerStyles="text-gray-700 hover:text-green-600 p-2 rounded-md"
                >
                  <Share2 size={18} />
                </CustomButton>
                <CustomButton
                  aria-label="Favourite"
                  containerStyles="text-gray-700 hover:text-green-600 p-2 rounded-md"
                >
                  <Heart size={18} />
                </CustomButton>
                {isLoggedIn === null ? null : isLoggedIn ? (
                  <div className="p-1">
                    <UserNav />
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
                    aria-label="Sign in"
                  >
                    <UserIcon size={18} />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sell"
                  className="hidden sm:flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm"
                >
                  <DollarSign size={14} />
                  Sell
                </Link>
                <div className="p-1">
                  <UserNav />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* spacer to avoid content overlap when header is fixed and visible */}
      <div
        aria-hidden
        className={`transition-[height] duration-300 ease-in-out bg-transparent ${
          showTopNav ? "h-16" : "h-0"
        }
        `}
      />

      {/* BOTTOM NAV */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {!isCarPage ? (
          <div className="grid grid-cols-5 gap-1 py-2">
            <Link
              href="/"
              className="flex flex-col items-center text-green-600 font-bold"
            >
              <Home size={22} />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/inventory"
              className="flex flex-col items-center text-gray-700 font-bold"
            >
              <Car size={22} />
              <span className="text-xs">Cars</span>
            </Link>
            <Link href="/sell" className="flex flex-col items-center">
              <div className="bg-green-600 text-white p-3.5 rounded-full shadow-2xl -mt-6">
                <DollarSign size={28} />
              </div>
              <span className="text-xs font-black">Sell</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center text-gray-700 font-bold"
            >
              <MessageCircle size={22} />
              <span className="text-xs">Chat</span>
            </Link>
            <div className="flex flex-col items-center text-gray-700 font-bold">
              <UserIcon size={22} />
              <span className="text-xs">Me</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 py-2 px-4">
            <a
              href="#call"
              className="flex flex-col items-center justify-center bg-white border border-gray-200 text-green-600 p-2 rounded-full shadow-sm"
              aria-label="Call seller"
            >
              <Phone size={18} />
              <span className="text-[10px] text-gray-700 mt-1">Call</span>
            </a>
            <a
              href="#whatsapp"
              className="flex flex-col items-center justify-center bg-white border border-gray-200 text-green-600 p-2 rounded-full shadow-sm"
              aria-label="WhatsApp seller"
            >
              <WhatsAppIcon size={18} />
              <span className="text-[10px] text-gray-700 mt-1">WhatsApp</span>
            </a>
            <a
              href="#sms"
              className="flex flex-col items-center justify-center bg-white border border-gray-200 text-yellow-600 p-2 rounded-full shadow-sm"
              aria-label="Send SMS"
            >
              <MessageCircle size={18} />
              <span className="text-[10px] text-gray-700 mt-1">SMS</span>
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
