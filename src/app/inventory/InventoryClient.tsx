// src/components/InventoryClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import CarCard from "@/components/CarCard";
import FilterSidebar from "@/components/FilterSidebar";

import { Car } from "@/types";
import { X, Filter, Car as CarIcon, List, LayoutGrid } from "lucide-react";
import { useState as useLocalState, useEffect as useLocalEffect } from "react";
import FilterTopBar from "@/components/FilterTopBar";
import { useRouter } from "next/navigation";

export default function InventoryClient() {
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [, setFacets] = useState<Record<string, Record<string, number>>>({});
  const pageSize = 12;

  const searchParams = useSearchParams();

  // THIS LINE KILLS THE WARNING FOREVER — SAFE NULL CHECK
  const params = Object.fromEntries(searchParams ?? new URLSearchParams());

  // Compute a key representing filter params (exclude page) so we only reset page when filters change
  const filterKey = useMemo(() => {
    const p = new URLSearchParams(searchParams ?? new URLSearchParams());
    p.delete("page");
    return p.toString();
  }, [searchParams]);

  // Fetch server-driven search results when applied filters or page change
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchResults() {
      setLoading(true);
      try {
        const url = new URL(`/api/cars/search`, window.location.origin);
        // Reconstruct params from the Next `searchParams` so the dependency
        // is stable (we depend on `filterKey` below) and avoid re-running on
        // ephemeral object identity changes for `params`.
        const sp = new URLSearchParams(searchParams?.toString() ?? "");
        sp.set("page", String(page));
        sp.set("page_size", String(pageSize));
        url.search = sp.toString();

        const res = await fetch(url.toString(), { signal: controller.signal });
        const json = await res.json();
        if (!mounted) return;
        if (json?.success) {
          setAllCars(json.data ?? []);
          const tp = json?.meta?.total_pages ?? 1;
          setTotalPages(tp || 1);
          const total = json?.meta?.total ?? json?.data?.length ?? 0;
          setTotalCount(total);
          setFacets(json?.facets ?? {});
        } else {
          setAllCars([]);
          setTotalPages(1);
          setTotalCount(0);
          setFacets({});
        }
      } catch (err) {
        const maybe = err as unknown as { name?: string };
        if (maybe?.name === "AbortError") return;
        console.error("Failed to fetch inventory:", err);
        setAllCars([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchResults();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [filterKey, page, searchParams]);

  const hasActiveFilters = Object.keys(params).length > 0;

  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  // list view is now the default for quicker scanning
  const [viewMode, setViewMode] = useLocalState<"grid" | "list">("list");

  // ref to main results container so pagination can scroll to the first row
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // pagination
  // totalPages is provided by the server and stored in state
  const pagedCars = allCars;

  // sync page with URL param (if present)
  useLocalEffect(() => {
    const p = params.page ? Number(params.page) : 1;
    if (!Number.isNaN(p) && p >= 1 && p <= totalPages && p !== page) setPage(p);
  }, [params.page, totalPages]);

  const goPage = (n: number) => {
    const next = Math.min(totalPages, Math.max(1, n));
    setPage(next);

    const p = new URLSearchParams(searchParams ?? new URLSearchParams());
    if (next > 1) p.set("page", String(next));
    else p.delete("page");
    // update URL without automatic scroll, then scroll programmatically for a smooth UX
    router.replace(`/inventory?${p.toString()}`, { scroll: false });

    if (typeof window !== "undefined") {
      // scroll to first row of listings (with offset for header/filter bar)
      window.requestAnimationFrame(() => {
        if (resultsRef?.current) {
          const rect = resultsRef.current.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const offset = 120; // leave space for sticky header / top filter bar
          window.scrollTo({
            top: Math.max(0, top - offset),
            behavior: "smooth",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  };

  // helper to pick a card variant: single image -> main, occasional collage -> collage, otherwise carousel
  const selectVariant = (idx: number, car: Car) => {
    const imgs = car.images || [];
    if (!imgs.length || imgs.length === 1) return "main" as const;
    // make collage occasionally when there are at least 3 images
    if (imgs.length >= 3 && idx % 6 === 0) return "collage" as const;
    return "carousel" as const;
  };

  // reset page to 1 when filters change and clear page param from URL (only if needed)
  useLocalEffect(() => {
    if (page !== 1) setPage(1);
    const p = new URLSearchParams(searchParams ?? new URLSearchParams());
    p.delete("page");
    router.replace(`/inventory?${p.toString()}`, { scroll: false });
  }, [filterKey]);

  // Clamp current page to totalPages when totalPages shrinks
  useLocalEffect(() => {
    if (page > totalPages) {
      const clamped = Math.max(1, totalPages);
      setPage(clamped);
      const p = new URLSearchParams(searchParams ?? new URLSearchParams());
      if (clamped > 1) p.set("page", String(clamped));
      else p.delete("page");
      router.replace(`/inventory?${p.toString()}`, { scroll: false });
    }
  }, [totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <CarIcon
            size={80}
            className="mx-auto text-green-600 animate-bounce"
          />
          <p className="text-3xl md:text-5xl font-black text-green-600 mt-8 animate-pulse">
            LOADING FRESH CARS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO HEADER */}
      <section className="bg-gradient-to-b from-green-600 to-emerald-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            ALL CARS IN STOCK
          </h1>
          <p className="text-2xl md:text-4xl font-black opacity-90">
            {totalCount} Fresh {totalCount === 1 ? "Car" : "Cars"} Available
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <a
                href="/inventory"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-full font-black text-sm shadow-md hover:bg-gray-100 transition"
              >
                <X size={16} /> Clear All Filters
              </a>
            )}

            <div className="inline-flex items-center gap-2 bg-transparent rounded-full p-1">
              <button
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full ${
                  viewMode === "grid"
                    ? "bg-white text-green-600 shadow-sm"
                    : "bg-transparent text-white"
                }`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full ${
                  viewMode === "list"
                    ? "bg-white text-green-600 shadow-sm"
                    : "bg-transparent text-white"
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>

            {/* Mobile: open filters */}
            <div className="md:hidden">
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-2 bg-white text-green-600 px-3 py-1.5 rounded-full font-black text-sm shadow"
              >
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT: sidebar + results */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-4 md:mb-6">
            <FilterTopBar />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-8">
            {/* SIDEBAR - desktop */}
            <aside className="hidden md:block">
              <div className="sticky top-20 bg-white rounded-2xl shadow p-2 md:p-4">
                <FilterSidebar deferApply />
              </div>
            </aside>

            {/* MAIN RESULTS */}
            <div ref={resultsRef}>
              {totalCount === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-2xl">
                  <p className="text-2xl md:text-4xl font-black text-gray-700 mb-6">
                    No cars match your search
                  </p>
                  <a
                    href="/inventory"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black text-lg shadow-md transform hover:scale-105 transition"
                  >
                    Show All Cars
                  </a>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {pagedCars.map((car, index) => (
                    <div
                      key={car.id}
                      className="animate-in fade-in slide-in-from-bottom-8"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <CarCard car={car} variant={selectVariant(index, car)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col divide-y bg-white/0">
                  {pagedCars.map((car) => (
                    <div key={car.id} className="py-3">
                      <CarCard
                        car={car}
                        layout="list"
                        variant={car.images?.length === 1 ? "main" : "carousel"}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => goPage(page - 1)}
                    className={`px-3 py-1 rounded-md border text-gray-800 ${
                      page === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={page === 1}
                    aria-disabled={page === 1}
                    title="Previous page"
                  >
                    Previous
                  </button>

                  <div className="inline-flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goPage(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          page === i + 1
                            ? "bg-green-600 text-white border-green-600"
                            : "border border-gray-200 text-gray-800 bg-transparent hover:bg-gray-50"
                        }`}
                        aria-current={page === i + 1 ? "page" : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => goPage(page + 1)}
                    className={`px-3 py-1 rounded-md border text-gray-800 ${
                      page === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={page === totalPages}
                    aria-disabled={page === totalPages}
                    title="Next page"
                  >
                    Next
                  </button>

                  <div className="ml-4 text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile slide-over for filters */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-auto">
            <div className="p-3 flex items-center justify-between border-b">
              <h3 className="font-black text-lg">Filters</h3>
              <button
                className="text-gray-600"
                onClick={() => setShowFilters(false)}
              >
                <X />
              </button>
            </div>
            <FilterSidebar onClose={() => setShowFilters(false)} deferApply />
          </div>
        </div>
      )}
    </>
  );
}
