"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Car } from "@/types";
import CarCard from "@/components/CarCard";
import { formatCompactNumber } from "@/lib/utils";
import CustomButton from "@/components/CustomButton";
import { useToast } from "@/components/ui/ToastProvider";

interface Props {
  initialCars: Car[];
}

export default function InventoryClient({ initialCars }: Props) {
  const [cars, setCars] = useState<Car[]>(initialCars || []);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [makeFilter, setMakeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "price_desc" | "price_asc" | "mileage_asc"
  >("newest");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { showToast, confirm, prompt } = useToast();

  // Derived options
  const makes = useMemo(() => {
    const s = new Set<string>();
    cars.forEach((c) => c.make && s.add(String(c.make)));
    return Array.from(s).sort();
  }, [cars]);

  // Debounce query
  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedQuery(query.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(t);
  }, [query]);

  // Check admin flag (best-effort)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json?.is_admin) setIsAdmin(true);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtering + sorting
  const filtered = useMemo(() => {
    let list = cars.slice();

    // status
    if (statusFilter === "published") list = list.filter((c) => !!c.approved);
    if (statusFilter === "draft") list = list.filter((c) => !c.approved);

    // make
    if (makeFilter !== "all")
      list = list.filter((c) => String(c.make) === makeFilter);

    // query (match year/make/model/id)
    if (debouncedQuery) {
      list = list.filter((c) => {
        const candidates = [
          String(c.year || ""),
          String(c.make || ""),
          String(c.model || ""),
          String(c.id || ""),
          String(c.description || ""),
        ];
        return candidates.some((s) => s.toLowerCase().includes(debouncedQuery));
      });
    }

    // sort
    if (sortBy === "newest")
      list.sort(
        (a, b) =>
          (new Date(String(b.created_at)).getTime() || 0) -
          (new Date(String(a.created_at)).getTime() || 0)
      );
    if (sortBy === "price_desc")
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "price_asc")
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "mileage_asc")
      list.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));

    return list;
  }, [cars, statusFilter, makeFilter, debouncedQuery, sortBy]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // Single toggle approved (admin)
  async function toggleApproved(id: string, current: boolean) {
    setLoadingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/dashboard/cars/${id}/approve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ approved: !current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed");
      setCars((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, approved: json.data?.approved ?? !current } : c
        )
      );
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to update listing", type: "error" });
    } finally {
      setLoadingIds((s) => s.filter((x) => x !== id));
    }
  }

  // Delete single car
  async function deleteCar(id: string) {
    const ok = await confirm({
      message: "Delete this listing? This cannot be undone.",
    });
    if (!ok) return;
    setLoadingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/dashboard/cars/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete");
      setCars((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((s) => s.filter((x) => x !== id));
      showToast({ message: "Listing deleted", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to delete listing", type: "error" });
    } finally {
      setLoadingIds((s) => s.filter((x) => x !== id));
    }
  }

  // Bulk actions
  async function bulkPublish(publish = true) {
    if (!selectedIds.length) return;
    const ok = await confirm({
      message: `${publish ? "Publish" : "Unpublish"} ${
        selectedIds.length
      } listings?`,
    });
    if (!ok) return;
    setBulkLoading(true);
    try {
      const promises = selectedIds.map((id) =>
        fetch(`/api/dashboard/cars/${id}/approve`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ approved: publish }),
        }).then((r) =>
          r
            .json()
            .catch(() => ({}))
            .then((json) => ({ id, ok: r.ok, json }))
        )
      );
      const results = await Promise.all(promises);
      setCars((prev) =>
        prev.map((c) => {
          const r = results.find((x) => x.id === c.id);
          if (!r) return c;
          if (r.ok)
            return { ...c, approved: r.json?.data?.approved ?? publish };
          return c;
        })
      );
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showToast({ message: "Bulk update failed", type: "error" });
    } finally {
      setBulkLoading(false);
    }
  }

  async function bulkDelete() {
    if (!selectedIds.length) return;
    const ok = await confirm({
      message: `Delete ${selectedIds.length} listings? This cannot be undone.`,
    });
    if (!ok) return;
    setBulkLoading(true);
    try {
      const promises = selectedIds.map((id) =>
        fetch(`/api/dashboard/cars/${id}`, { method: "DELETE" }).then((r) => ({
          id,
          ok: r.ok,
        }))
      );
      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.ok);
      setCars((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      if (failed.length)
        showToast({
          message: `${failed.length} deletions failed`,
          type: "error",
        });
    } catch (err) {
      console.error(err);
      showToast({ message: "Bulk delete failed", type: "error" });
    } finally {
      setBulkLoading(false);
    }
  }

  // Export CSV (selected or all filtered)
  function exportCSV(useSelected = false) {
    const rows = (
      useSelected ? cars.filter((c) => selectedIds.includes(c.id)) : filtered
    ).map((c) => ({
      id: c.id,
      title: `${c.year} ${c.make} ${c.model}`,
      price: c.price ?? "",
      mileage: c.mileage ?? "",
      location: `${c.state ?? ""} ${c.city ?? ""}`.trim(),
      approved: c.approved ? "published" : "draft",
      created_at: c.created_at ?? "",
    }));
    if (!rows.length) {
      showToast({ message: "No rows to export", type: "error" });
      return;
    }
    const header = Object.keys(rows[0]).join(",");
    const csv = [
      header,
      ...rows.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cars_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Selection helpers
  function toggleSelect(id: string) {
    setSelectedIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }
  function selectAllOnPage() {
    setSelectedIds((s) => {
      const ids = pageItems.map((c) => c.id);
      const merged = Array.from(new Set([...s, ...ids]));
      return merged;
    });
  }
  function clearSelection() {
    setSelectedIds([]);
  }

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  return (
    <div>
      {/* Header + stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black">My Inventory</h2>
          <div className="text-sm text-gray-600 mt-1">
            {cars.length} total • {cars.filter((c) => c.approved).length}{" "}
            published • {cars.filter((c) => !c.approved).length} drafts
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            Create Listing
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <CustomButton
              btnType="button"
              handleClick={() => exportCSV(true)}
              containerStyles="px-3 py-2 bg-gray-100 rounded-lg text-sm"
              title="Export Selected"
            />
            <CustomButton
              btnType="button"
              handleClick={() => exportCSV(false)}
              containerStyles="px-3 py-2 bg-gray-100 rounded-lg text-sm"
              title="Export All"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3 flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by year, make, model, ID or description"
            className="flex-1 border px-3 py-2 rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "published" | "draft")
            }
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "newest"
                  | "price_desc"
                  | "price_asc"
                  | "mileage_asc"
              )
            }
            className="border px-3 py-2 rounded-lg hidden md:block"
          >
            <option value="newest">Newest</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="mileage_asc">Mileage: Low → High</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Per page</div>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border px-2 py-1 rounded-lg"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white p-3 rounded-lg shadow">
          <div className="text-sm">{selectedIds.length} selected</div>
          <div className="flex items-center gap-2">
            <CustomButton
              btnType="button"
              isDisabled={bulkLoading}
              handleClick={() => bulkPublish(true)}
              containerStyles="px-3 py-2 bg-green-600 text-white rounded-lg"
              title="Publish"
            />
            <CustomButton
              btnType="button"
              isDisabled={bulkLoading}
              handleClick={() => bulkPublish(false)}
              containerStyles="px-3 py-2 bg-yellow-500 text-white rounded-lg"
              title="Unpublish"
            />
            <CustomButton
              btnType="button"
              isDisabled={bulkLoading}
              handleClick={bulkDelete}
              containerStyles="px-3 py-2 bg-red-600 text-white rounded-lg"
              title="Delete"
            />
            <CustomButton
              btnType="button"
              handleClick={clearSelection}
              containerStyles="px-3 py-2 bg-gray-100 rounded-lg"
              title="Clear"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((car) => (
          <div key={car.id} className="relative">
            <div className="absolute top-3 left-3 z-20">
              <input
                type="checkbox"
                checked={selectedIds.includes(car.id)}
                onChange={() => toggleSelect(car.id)}
                className="w-5 h-5"
              />
            </div>

            <CarCard car={car} />

            <div className="flex gap-2 mt-3">
              <Link
                href={`/sell?edit=${car.id}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
              >
                Edit
              </Link>
              <CustomButton
                btnType="button"
                isDisabled={!isAdmin || loadingIds.includes(car.id)}
                handleClick={() => toggleApproved(car.id, !!car.approved)}
                containerStyles="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                title={
                  loadingIds.includes(car.id)
                    ? "..."
                    : car.approved
                    ? "Unpublish"
                    : "Publish"
                }
              />
              <CustomButton
                btnType="button"
                isDisabled={loadingIds.includes(car.id)}
                handleClick={() => deleteCar(car.id)}
                containerStyles="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm"
                title="Delete"
              />
            </div>

            <div className="mt-2 text-xs text-gray-600">
              {car.created_at
                ? `Posted ${new Date(car.created_at).toLocaleDateString()}`
                : null}{" "}
              • {formatCompactNumber(Number(car.views_count || 0))} views
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)}{" "}
          of {total}
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            btnType="button"
            isDisabled={page === 1}
            handleClick={() => setPage((p) => Math.max(1, p - 1))}
            containerStyles="px-3 py-1 bg-white border rounded-lg"
            title="Prev"
          />
          <div className="px-3 py-1 bg-white border rounded-lg">
            Page {page} / {totalPages}
          </div>
          <CustomButton
            btnType="button"
            isDisabled={page === totalPages}
            handleClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            containerStyles="px-3 py-1 bg-white border rounded-lg"
            title="Next"
          />
        </div>
      </div>
    </div>
  );
}
