"use client";

import { useEffect, useState } from "react";

interface Booking {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  scheduled_time?: string;
  preferred_time?: string;
  status?: string;
  message?: string;
}

export default function AdminSlotBookings({ slotId }: { slotId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/inspection-slots/bookings?slotId=${encodeURIComponent(
            slotId
          )}`
        );
        const json = await res.json();
        setBookings(json.bookings || []);
      } catch (err) {
        console.error("failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, slotId]);

  const cancelBooking = async (id: string) => {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    try {
      setBusy(true);
      const res = await fetch(`/api/admin/inspection-slots/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert((d && d.error) || "Failed to cancel");
        return;
      }
      // Optimistically update list
      setBookings((b) => b.filter((x) => x.id !== id));
      // Refresh page to update slot counts or let admin click refresh
      // You could also implement a smarter refresh of parent state
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="text-sm text-blue-600"
        onClick={() => setOpen((s) => !s)}
      >
        {open ? "Hide bookings" : "View bookings"}
      </button>

      {open && (
        <div className="mt-2 p-3 border rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="text-sm text-gray-600">Loading…</div>
          ) : bookings && bookings.length ? (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-2 border rounded flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-[var(--foreground)]">
                      {b.name || b.phone || b.email || b.id}
                    </div>
                    <div className="text-xs text-gray-600">
                      {b.scheduled_time || b.preferred_time || "—"} • {b.status}
                    </div>
                    {b.message ? (
                      <div className="text-xs mt-1 text-[var(--muted)]">
                        {b.message}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => cancelBooking(b.id)}
                      className="text-sm text-red-600"
                    >
                      Cancel
                    </button>
                    <a
                      className="text-sm text-[var(--muted)]"
                      href={`/admin/inspections/${b.id}`}
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              No bookings for this slot
            </div>
          )}
        </div>
      )}
    </div>
  );
}
