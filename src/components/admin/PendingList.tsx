"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { Car } from "@/types";
import { format } from "date-fns";
import ListingModal from "@/components/admin/ListingModal";
import CustomButton from "@/components/CustomButton";
import { useToast } from "@/components/ui/ToastProvider";

export default function PendingList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 50;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCar, setActiveCar] = useState<Car | null>(null);
  const [bulkAction, setBulkAction] = useState("");
  // selected is a map of id->boolean; use this to track selections across the page

  const { showToast, confirm, prompt } = useToast();

  const closeModal = () => {
    setActiveId(null);
    setActiveCar(null);
  };
  const handleUpdated = (updated: Car) => {
    // If status changed away from pending, remove from the pending list
    if (updated.status !== "pending") {
      setCars((prev) => prev.filter((c) => c.id !== updated.id));
      setSelected((s) => {
        const ns = { ...s };
        delete ns[updated.id];
        return ns;
      });
    } else {
      // Otherwise update the item in place
      setCars((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  };

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const r = await fetch(
          `/api/dashboard/cars/pending?page=${p}&limit=${PER_PAGE}`
        );
        const json = await r.json();
        if (!r.ok) throw new Error(json?.error || "Failed to load");
        setCars(json.data || []);
        setTotal(json.meta?.total || 0);
        setPage(p);
        // clear selections when page changes
        setSelected({});
      } catch (e) {
        console.error(e);
        showToast({ message: "Failed to load pending cars", type: "error" });
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const approveOne = async (id: string) => {
    if (!id) return showToast({ message: "Invalid listing id", type: "error" });
    const notes = (await prompt({
      message: "Moderation notes (optional):",
      placeholder: "",
    })) as string | null;
    const ok = await confirm({ message: "Approve this listing?" });
    if (!ok) return;
    try {
      const r = await fetch(`/api/dashboard/cars/${id}/approve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "approved", notes }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Approve failed");
      // remove from list
      setCars((prev) => prev.filter((c) => c.id !== id));
      showToast({ message: "Approved", type: "success" });
    } catch (e) {
      console.error(e);
      showToast({ message: "Failed to approve", type: "error" });
    }
  };

  const setStatusOne = async (id: string, status: string) => {
    if (!id) return showToast({ message: "Invalid listing id", type: "error" });
    const notes = (await prompt({
      message: "Notes (optional):",
      placeholder: "",
    })) as string | null;
    const ok = await confirm({
      message: `Set status to ${status} for this listing?`,
    });
    if (!ok) return;
    try {
      const r = await fetch(`/api/dashboard/cars/${id}/approve`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Update failed");
      setCars((prev) => prev.filter((c) => c.id !== id));
      showToast({ message: "Status updated", type: "success" });
    } catch (e) {
      console.error(e);
      showToast({ message: "Failed to update status", type: "error" });
    }
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const toggleSelectAll = () => {
    const ids = cars
      .map((c) => c.id)
      .filter((id) => !!id && id !== "undefined") as string[];
    const allSelected = ids.length > 0 && ids.every((id) => !!selected[id]);
    if (allSelected) {
      setSelected({});
    } else {
      const ns: Record<string, boolean> = {};
      ids.forEach((id) => (ns[id] = true));
      setSelected(ns);
    }
  };

  const bulkActionSelected = async (action: string) => {
    if (!action)
      return showToast({ message: "Select an action", type: "error" });
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (ids.length === 0)
      return showToast({ message: "No items selected", type: "error" });
    const notes = (await prompt({
      message: "Notes (optional):",
      placeholder: "",
    })) as string | null;
    const ok = await confirm({
      message: `Perform '${action}' on ${ids.length} listings?`,
    });
    if (!ok) return;
    try {
      const r = await fetch(`/api/dashboard/cars/bulk`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ids,
          action,
          notes,
        }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Bulk failed");
      // Remove affected from list (they are no longer pending)
      setCars((prev) => prev.filter((c) => !ids.includes(c.id)));
      setSelected({});
      setBulkAction("");
      showToast({ message: "Bulk action completed", type: "success" });
    } catch (e) {
      console.error(e);
      showToast({ message: "Bulk action failed", type: "error" });
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Pending Listings</h2>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              aria-label="Select all listings on page"
              checked={
                cars.length > 0 &&
                cars
                  .map((c) => c.id)
                  .filter(Boolean)
                  .every((id) => !!selected[id])
              }
              onChange={toggleSelectAll}
            />
            Select all
          </label>

          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-white/5 p-2 rounded text-white"
          >
            <option value="">Bulk action</option>
            <option value="approve">Approve</option>
            <option value="rejected">Reject</option>
            <option value="needs_changes">Needs changes</option>
            <option value="flagged">Flag</option>
          </select>

          <CustomButton
            isDisabled={!bulkAction || selectedCount === 0}
            handleClick={() => bulkActionSelected(bulkAction)}
            containerStyles="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Apply
          </CustomButton>

          <div className="text-sm text-gray-300">{selectedCount} selected</div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : cars.length === 0 ? (
        <div>No pending listings</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-white">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="p-2"> </th>
                <th className="p-2">Title</th>
                <th className="p-2">Location</th>
                <th className="p-2">Price</th>
                <th className="p-2">Created</th>
                <th className="p-2">Status</th>
                <th className="p-2">Approver</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[c.id]}
                      onChange={() =>
                        c.id && c.id !== "undefined" && toggleSelect(c.id)
                      }
                      disabled={!c.id || c.id === "undefined"}
                    />
                  </td>
                  <td className="p-2 font-bold">
                    {c.year} {c.make} {c.model}
                  </td>
                  <td className="p-2">{c.city || c.state || c.location}</td>
                  <td className="p-2">₦{(c.price / 1000000).toFixed(1)}M</td>
                  <td className="p-2">
                    {c.created_at
                      ? format(new Date(c.created_at), "yyyy-MM-dd")
                      : ""}
                  </td>
                  <td className="p-2">
                    {c.status ?? (c.approved ? "approved" : "pending")}
                  </td>
                  <td className="p-2">
                    {c.approver_email ?? c.approved_by ?? "—"}
                  </td>
                  <td className="p-2 space-x-2">
                    <CustomButton
                      isDisabled={!c.id || c.id === "undefined"}
                      handleClick={() => {
                        const validId =
                          c.id && c.id !== "undefined" ? c.id : null;
                        setActiveId(validId);
                        setActiveCar(c);
                      }}
                      containerStyles="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </CustomButton>
                    <CustomButton
                      isDisabled={!c.id || c.id === "undefined"}
                      handleClick={() => approveOne(c.id ?? "")}
                      containerStyles="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </CustomButton>
                    <select
                      onChange={(e) => {
                        if (e.target.value) setStatusOne(c.id, e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="">Set status...</option>
                      <option value="rejected">Reject</option>
                      <option value="needs_changes">Needs changes</option>
                      <option value="flagged">Flag</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Page {page} of {Math.max(1, Math.ceil(total / PER_PAGE))}
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            isDisabled={page <= 1}
            handleClick={() => load(Math.max(1, page - 1))}
            containerStyles="px-3 py-1 rounded bg-white/5"
          >
            Prev
          </CustomButton>
          <CustomButton
            isDisabled={page >= Math.max(1, Math.ceil(total / PER_PAGE))}
            handleClick={() =>
              load(Math.min(Math.max(1, Math.ceil(total / PER_PAGE)), page + 1))
            }
            containerStyles="px-3 py-1 rounded bg-white/5"
          >
            Next
          </CustomButton>
        </div>
      </div>

      {/* Listing modal */}
      <ListingModal
        id={activeId}
        car={activeCar}
        onClose={closeModal}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
