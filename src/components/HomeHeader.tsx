"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Bell,
  Heart,
  Search,
  Star,
  MessageCircle,
  Home,
  PlusCircle,
  Menu,
  Car,
  Truck,
  Shield,
  Phone,
} from "lucide-react";

const BODY_TYPES = [
  "SUV",
  "Coupe",
  "Sedan",
  "Crossover",
  "Hard Top Convertible",
  "Pick Up Truck",
];

export default function HomeHeader() {
  const [city, setCity] = useState<string>("Lagos");
  const [query, setQuery] = useState("");

  // Dropdown state & outside-click handling
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuOpenOverlay, setMenuOpenOverlay] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setOpenMenu(null);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function toggleMenu(name: string) {
    setOpenMenu((prev) => (prev === name ? null : name));
  }

  return (
    <header className="w-full">
      {/* Row 1: top controls (centered, 1280px) - hidden on mobile */}
      <div className="w-full bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[60px] flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo logoSrc="/logo.webp" size="sm" alt="CarsAbeg" />
            </Link>

            {/* tiny city dropdown */}
            <div className="flex items-center gap-2 ml-2">
              <select
                aria-label="Select city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-sm border border-gray-200 rounded px-2 py-1"
              >
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Kano</option>
                <option>Kaduna</option>
              </select>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-6">
            <button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
              <Bell size={18} />{" "}
              <span className="hidden lg:inline">Notifications</span>
            </button>

            <Link
              href="/saved"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <Star size={18} />{" "}
              <span className="hidden lg:inline">Favorites</span>
            </Link>

            <Link
              href="/searches"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <Search size={18} />{" "}
              <span className="hidden lg:inline">My searches</span>
            </Link>

            <Link
              href="/chats"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <MessageCircle size={18} />{" "}
              <span className="hidden lg:inline">Chats</span>
            </Link>

            <Link
              href="/my-ads"
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <Heart size={18} />{" "}
              <span className="hidden lg:inline">My Ads</span>
            </Link>

            <Link
              href="/auth/login"
              className="text-sm text-gray-800 hover:underline"
            >
              Login / Signup
            </Link>

            <Link
              href="/place-ad"
              className="ml-2 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-full font-bold"
            >
              Place Your Ad
            </Link>
          </div>

          {/* Mobile quick controls (compact) */}
          <div className="md:hidden ml-4 flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-800">
              Login
            </Link>
            <Link
              href="/place-ad"
              className="text-sm bg-yellow-400 text-black px-3 py-1 rounded font-bold"
            >
              Sell
            </Link>
          </div>
        </div>{" "}
      </div>
      {/* Row 2: links */}
      <nav className="w-full border-b border-gray-100 bg-white hidden md:block">
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 md:px-8">
          <ul className="flex items-center justify-between gap-6 py-3 text-sm font-medium text-gray-700 flex-wrap nav-row-links">
            <li className="relative">
              <button
                aria-expanded={openMenu === "carsForSale"}
                aria-controls="carsForSaleMenu"
                onClick={() => toggleMenu("carsForSale")}
                className="inline-flex items-center gap-2"
              >
                Cars for Sale
              </button>

              {openMenu === "carsForSale" && (
                <>
                  <div
                    id="carsForSaleMenu"
                    className="absolute left-0 mt-2 bg-white rounded-md shadow-lg p-3 min-w-[160px] z-50 hidden md:block"
                  >
                    <Link
                      href="/inventory?condition=brand-new"
                      className="block px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Brand New
                    </Link>
                    <Link
                      href="/inventory?condition=foreign-used"
                      className="block px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Foreign Used
                    </Link>
                    <Link
                      href="/inventory?condition=nigerian-used"
                      className="block px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Local Used
                    </Link>
                  </div>

                  <div className="md:hidden fixed inset-0 bg-white p-6 z-50 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-black">Cars for Sale</div>
                      <button
                        onClick={() => setOpenMenu(null)}
                        className="text-sm"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/inventory?condition=brand-new"
                        className="block px-3 py-2 text-base"
                      >
                        Brand New
                      </Link>
                      <Link
                        href="/inventory?condition=foreign-used"
                        className="block px-3 py-2 text-base"
                      >
                        Foreign Used
                      </Link>
                      <Link
                        href="/inventory?condition=nigerian-used"
                        className="block px-3 py-2 text-base"
                      >
                        Local Used
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </li>

            <li className="relative">
              <button
                aria-expanded={openMenu === "carsForRent"}
                aria-controls="carsForRentMenu"
                onClick={() => toggleMenu("carsForRent")}
                className="inline-flex items-center gap-2"
              >
                Cars for Rent
              </button>

              {openMenu === "carsForRent" && (
                <>
                  <div
                    id="carsForRentMenu"
                    className="absolute left-0 mt-2 bg-white rounded-md shadow-lg p-3 min-w-[200px] max-h-56 overflow-auto z-50 hidden md:block"
                  >
                    {BODY_TYPES.map((b) => (
                      <Link
                        key={b}
                        href={`/rent?type=${encodeURIComponent(b)}`}
                        className="block px-3 py-1 text-sm hover:bg-gray-50"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>

                  <div className="md:hidden fixed inset-0 bg-white p-6 z-50 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-black">Cars for Rent</div>
                      <button
                        onClick={() => setOpenMenu(null)}
                        className="text-sm"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-2">
                      {BODY_TYPES.map((b) => (
                        <Link
                          key={b}
                          href={`/rent?type=${encodeURIComponent(b)}`}
                          className="block px-3 py-2 text-base"
                        >
                          {b}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </li>

            <li>
              <Link href="/finance" className="hover:underline">
                Finance
              </Link>
            </li>

            <li>
              <Link href="/sell" className="hover:underline">
                Sell
              </Link>
            </li>

            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero moved to ClientHome (desktop-only). */}

      {/* MOBILE HERO: logo center + search + 3x3 quick grid */}
      <div className="md:hidden w-full py-6 bg-white">
        <div className="max-w-md mx-auto px-4 text-center">
          <Logo logoSrc="/logo.webp" size="md" alt="CarsAbeg" />

          <div className="mt-4">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything"
                className="flex-1 w-full px-4 py-3 rounded-md border border-gray-200"
              />
              <button className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded-md font-bold">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            {[
              { label: "Cars for Sale", href: "/inventory", Icon: Car },
              { label: "Cars for Rent", href: "/rent", Icon: Truck },
              {
                label: "Brand New",
                href: "/inventory?condition=brand-new",
                Icon: Star,
              },
              {
                label: "Foreign Used",
                href: "/inventory?condition=foreign-used",
                Icon: Shield,
              },
              {
                label: "Local Used",
                href: "/inventory?condition=nigerian-used",
                Icon: Phone,
              },
              { label: "SUV", href: "/rent?type=SUV", Icon: Car },
              { label: "Sedan", href: "/rent?type=Sedan", Icon: Car },
              {
                label: "Pick-Up",
                href: "/rent?type=Pick Up Truck",
                Icon: Truck,
              },
              { label: "Crossover", href: "/rent?type=Crossover", Icon: Car },
            ].map((b) => (
              <Link
                key={b.label}
                href={b.href}
                className="flex flex-col items-center bg-white border border-gray-100 rounded-lg p-3 text-center hover:bg-gray-50"
              >
                <div className="text-gray-700 mb-1">
                  <b.Icon size={20} />
                </div>
                <div className="text-xs text-gray-700 font-medium">
                  {b.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV & MENU */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex flex-col items-center text-gray-700 text-xs"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              href="/inventory"
              className="flex flex-col items-center text-gray-700 text-xs"
            >
              <Search size={20} />
              <span>Search</span>
            </Link>

            <Link href="/place-ad" className="flex flex-col items-center -mt-4">
              <div className="bg-yellow-400 text-black p-3 rounded-full shadow-lg">
                <PlusCircle size={22} />
              </div>
              <span className="text-xs font-bold">Post</span>
            </Link>

            <Link
              href="/chats"
              className="flex flex-col items-center text-gray-700 text-xs"
            >
              <MessageCircle size={20} />
              <span>Chats</span>
            </Link>

            <button
              onClick={() => setMenuOpenOverlay(true)}
              className="flex flex-col items-center text-gray-700 text-xs"
            >
              <Menu size={20} />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {menuOpenOverlay && (
          <div
            className="fixed inset-0 z-50 bg-white overflow-auto p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="relative min-h-screen pt-[40vh]">
              <button
                onClick={() => setMenuOpenOverlay(false)}
                className="absolute top-6 right-6 text-sm"
              >
                Close
              </button>

              <div className="absolute left-1/2 transform -translate-x-1/2 top-[25vh] flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  U
                </div>
                <Link
                  href="/auth/login"
                  className="mt-3 font-bold text-gray-800 hover:underline"
                >
                  Log in or sign up
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 text-center px-4">
                <Link href="/saved" className="block py-4 bg-gray-50 rounded">
                  Favorites
                </Link>
                <Link href="/my-ads" className="block py-4 bg-gray-50 rounded">
                  My Ads
                </Link>
                <Link
                  href="/searches"
                  className="block py-4 bg-gray-50 rounded"
                >
                  My Searches
                </Link>
              </div>

              <div className="mt-8 space-y-4 px-4">
                <Link href="/locations" className="block py-3">
                  City
                </Link>
                <Link href="/help" className="block py-3">
                  Help
                </Link>
                <a href="tel:+234000000000" className="block py-3">
                  Call us
                </a>
                <Link href="/legal" className="block py-3">
                  Legal hub
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
