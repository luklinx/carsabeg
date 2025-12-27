// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Shield,
  Zap,
  Heart,
  Flag,
  Cookie,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isCarPage = pathname ? pathname.startsWith("/car/") : false;

  // Do not render footer on product detail pages
  if (isCarPage) return null;
  const [openPolicies, setOpenPolicies] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  const policiesRef = useRef<HTMLUListElement | null>(null);
  const resourcesRef = useRef<HTMLDivElement | null>(null);
  const supportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (openPolicies) {
      const el = policiesRef.current?.querySelector("a");
      (el as HTMLElement | null)?.focus();
    }
  }, [openPolicies]);

  useEffect(() => {
    if (openResources) {
      const el = resourcesRef.current?.querySelector("a");
      (el as HTMLElement | null)?.focus();
    }
  }, [openResources]);

  useEffect(() => {
    if (openSupport) {
      const el = supportRef.current?.querySelector("a, button");
      (el as HTMLElement | null)?.focus();
    }
  }, [openSupport]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenPolicies(false);
        setOpenResources(false);
        setOpenSupport(false);
      }
    };
    if (openPolicies || openResources || openSupport) {
      window.addEventListener("keydown", handler);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [openPolicies, openResources, openSupport]);

  return (
    <footer className="bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 border-t-4 sm:border-t-6 md:border-t-8 border-amber-300 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* MAIN GRID — Mobile: Stacked | Desktop: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 text-center md:text-left">
          {/* BRAND — The Golden Lion */}
          <div className="order-1">
            <h2 className="text-2xl sm:text-3xl md:text-2xl font-black text-green-600 leading-none tracking-tighter">
              CARS ABEG
            </h2>
            <p className="text-lg sm:text-2xl font-black text-amber-900 mt-2 sm:mt-4">
              No Wahala. Just Quality Cars.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-amber-800 mt-4 sm:mt-6 leading-relaxed font-medium max-w-xs mx-auto md:mx-0">
              Nigeria’s fastest-growing marketplace for Foreign Used & Nigerian
              Used cars.
            </p>

            {/* Trust Icons */}
            <div className="flex justify-center md:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <Shield className="text-green-600" size={24} />
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <Zap className="text-yellow-600" size={24} />
              </div>
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                <Heart className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="order-3 md:order-2">
            <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-3 sm:mb-4">
              Explore
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/inventory", label: "All Cars" },
                { href: "/sell", label: "Sell Your Car" },
                { href: "/value-my-car", label: "Value My Car" },
                { href: "/how-it-works", label: "How It Works" },
              ].map((link) => (
                <li key={link.href} className="flex items-center gap-2">
                  <ChevronRight
                    size={14}
                    className="text-amber-600"
                    aria-hidden
                  />
                  <Link
                    href={link.href}
                    className="text-amber-800 hover:text-green-600 font-medium transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* POLICIES */}
          <div className="order-2 md:order-3">
            <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-3 sm:mb-4 flex items-center justify-center md:justify-start">
              Policies
              <button
                onClick={() => setOpenPolicies((s) => !s)}
                className="md:hidden ml-3 p-2 bg-amber-100 rounded-full"
                aria-expanded={openPolicies}
                aria-controls="policies-list"
                aria-label="Toggle Policies"
              >
                {openPolicies ? "−" : "+"}
              </button>
            </h3>

            <ul
              id="policies-list"
              ref={policiesRef}
              className={`space-y-2 sm:space-y-3 text-xs ${
                openPolicies ? "block" : "hidden md:block"
              }`}
            >
              <li className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/privacy-policy"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Privacy Policy
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/terms-and-conditions"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/billing-policy"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Billing Policy
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/candidate-privacy-policy"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Candidate Privacy Policy
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <FileText size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/copyright-infringement-policy"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Copyright Infringement Policy
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <Cookie size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/cookies-policy"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  Cookies Policy
                </Link>
              </li>

              <li className="flex items-center gap-2">
                <Flag size={14} className="text-amber-600" aria-hidden />
                <Link
                  href="/careers"
                  className="text-amber-800 hover:text-green-600 font-semibold inline-block"
                >
                  We're Hiring
                </Link>
              </li>
            </ul>
          </div>

          {/* RESOURCES & SUPPORT */}
          <div className="order-4">
            <h3 className="text-lg sm:text-xl font-black text-amber-900 mb-3 sm:mb-4 flex items-center justify-center md:justify-start">
              Resources & Support
              <button
                onClick={() => setOpenResources((s) => !s)}
                className="md:hidden ml-3 p-2 bg-amber-100 rounded-full"
                aria-expanded={openResources}
                aria-controls="resources-list"
                aria-label="Toggle Resources and Support"
              >
                {openResources ? "−" : "+"}
              </button>
            </h3>

            <div
              id="resources-list"
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                openResources ? "block" : "hidden md:block"
              }`}
            >
              <div>
                <h4 className="text-sm font-bold mb-1">Social</h4>
                <ul className="space-y-2 text-xs" ref={resourcesRef}>
                  <li className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden
                      focusable="false"
                    >
                      <path
                        fill="#1877F2"
                        d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.1v-2.9h2.1V9.6c0-2.1 1.2-3.3 3-3.3.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.4h2.2l-.4 2.9H14.4v7A10 10 0 0 0 22 12z"
                      />
                    </svg>
                    <Link
                      href="/resources/facebook"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      Facebook
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden
                      focusable="false"
                    >
                      <path
                        fill="#1DA1F2"
                        d="M22 5.9c-.6.3-1.2.5-1.9.6.7-.4 1.2-.9 1.4-1.6-.7.4-1.5.7-2.3.8C18.2 5 17.4 4.6 16.6 4.6c-1.7 0-3.1 1.4-3.1 3.1 0 .2 0 .4.1.6-2.6-.1-4.9-1.4-6.4-3.4-.3.6-.4 1.2-.4 1.9 0 1.2.6 2.3 1.6 3-.5 0-1-.1-1.5-.4v.1c0 1.8 1.2 3.3 2.9 3.6-.5.1-1 .2-1.6.2-.4 0-.8 0-1.2-.1.8 2.4 3.1 4.1 5.8 4.1-2.1 1.6-4.7 2.6-7.5 2.6-.5 0-1 0-1.4-.1C6 20.1 8.1 21 10.5 21c7 0 10.8-5.9 10.8-11 0-.2 0-.4 0-.6.7-.5 1.2-1.1 1.7-1.8-.7.3-1.4.5-2.2.6z"
                      />
                    </svg>
                    <Link
                      href="/resources/x"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      X
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden
                      focusable="false"
                    >
                      <path
                        fill="#C13584"
                        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm8 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 8a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8z"
                      />
                    </svg>
                    <Link
                      href="/resources/instagram"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      Instagram
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden
                      focusable="false"
                    >
                      <path
                        fill="#FF0000"
                        d="M23.5 6.2s-.2-1.7-.9-2.4c-.8-.9-1.6-.9-2-1C16.5 2.3 12 2.3 12 2.3h0s-4.5 0-8.6.4c-.4 0-1.3.1-2 1C.7 4.5.5 6.2.5 6.2S.3 8 .3 9.8v.4c0 1.8.2 3.6.2 3.6s.2 1.7.9 2.4c.8.9 1.9.9 2.4 1C7.7 21.7 12 21.7 12 21.7s4.5 0 8.6-.4c.4 0 1.3-.1 2-1 .6-.7.9-2.4.9-2.4s.2-1.8.2-3.6v-.4c0-1.8-.2-3.6-.2-3.6zM9.8 15.3V8.7l6.1 3.3-6.1 3.3z"
                      />
                    </svg>
                    <Link
                      href="/resources/youtube"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      YouTube
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold mb-1">Support</h4>
                <ul className="space-y-2 text-xs" ref={supportRef}>
                  <li>
                    <a
                      href="mailto:support@carsabeg.ng"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      support@carsabeg.ng
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/safety-tips"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      Safety tips
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faqs"
                      className="text-amber-800 hover:text-green-600 font-medium"
                    >
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* make support collapsible on small screens */}
            <div
              className={`mt-4 ${openSupport ? "block" : "hidden md:block"}`}
            >
              <button className="w-full md:w-auto bg-green-600 text-white px-3 py-2 rounded-full font-semibold inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-300">
                <Phone size={14} aria-hidden />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>

        {/* FINAL GOLDEN LINE */}
        <div className="border-t-2 sm:border-t-3 md:border-t-4 border-amber-400 mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 md:pt-10 text-center">
          <p className="text-base sm:text-lg md:text-2xl font-black text-amber-900">
            © 2025{" "}
            <span className="text-green-600 text-lg sm:text-2xl md:text-3xl">
              CARS ABEG
            </span>{" "}
            • Built with <span className="text-red-600">♥</span> in Nigeria by{" "}
            <span className="text-green-600">THE KING</span>
          </p>
          <p className="text-xs sm:text-sm md:text-lg text-amber-800 font-bold mt-2 sm:mt-3 md:mt-4">
            Proudly Made in Naija • For Nigerians • By Nigerians
          </p>
        </div>
      </div>
    </footer>
  );
}
