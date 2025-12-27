"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroDesktop() {
  const [tab, setTab] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const queryTerms = query.trim().split(/\s+/).filter(Boolean);
  const router = useRouter();

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (tab && tab !== "All") params.set("tab", tab);
    const url = `/inventory${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(url);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 hidden md:block hero-desktop-root">
      <div className="relative mt-6 rounded-md overflow-hidden">
        <Image
          src="/hero-bg2.png"
          alt="Hero background"
          width={1600}
          height={420}
          className="w-full h-[420px] object-cover block"
        />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 bg-black/50"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="text-center max-w-3xl">
            <h2
              className="text-lg md:text-2xl font-black mb-2 text-white whitespace-nowrap"
              style={{ fontSize: "28px", color: "#ffffff" }}
            >
              The best place to buy, sell or rent a car in Nigeria
            </h2>
            <p className="text-white/90">
              Find thousands of listings and great deals from trusted sellers.
              Search across categories with ease.
            </p>
          </div>

          <div className="w-full md:w-full mt-4">
            <div className="mx-auto max-w-4xl rounded-md p-6 bg-black/60 text-white ring-1 ring-white/10 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-sm text-white/80 mr-3">Searching in</div>
                <div className="flex flex-wrap gap-3">
                  {[
                    "All",
                    "Brand New",
                    "Foreign used",
                    "Local used",
                    "Car for rent",
                  ].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        tab === t
                          ? "bg-yellow-400 text-black"
                          : "bg-white/12 text-white/90 border border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search for anything"
                    className="flex-1 w-full px-4 py-3 rounded-md border border-black/10 bg-white text-black placeholder-black/60"
                  />
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-3 rounded-md font-bold"
                  >
                    <Search size={16} /> Search
                  </button>
                </div>

                {queryTerms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {queryTerms.map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="px-3 py-1 rounded-full bg-gray-100 text-black text-sm shadow transition-all duration-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
