"use client";

import { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import DateTimePicker from "@/components/DateTimePicker";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  carId: string | number;
}

interface Slot {
  id: string;
  start_at: string;
  available: boolean;
  booked: number;
  capacity: number;
}

interface BookingRequest {
  carId: string | number;
  name: string;
  email: string;
  phone: string;
  when: string | null;
  message: string;
  slotId?: string;
}

export default function BookInspectionModal({ open, onClose, carId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState<Date | null>(null);

  // Slots
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const minWhen = new Date();

  useEffect(() => {
    if (!open) return;
    // Fetch slots for this car when modal opens
    (async () => {
      try {
        setSlotsLoading(true);
        const url = `/api/inspections/slots?carId=${encodeURIComponent(
          String(carId)
        )}`;
        const res = await fetch(url);
        const json = await res.json();
        setSlots(json.slots || []);
      } catch (err) {
        console.error("failed to fetch slots:", err);
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [open, carId]);

  // Clear transient state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedSlotId(null);
      setWhen(null);
      setSlots([]);
    }
  }, [open]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setStatusMessage("");
    try {
      // Convert local datetime-local string to an ISO timestamp (UTC)
      const preferred_time = when ? new Date(when).toISOString() : null;

      const body: BookingRequest = {
        carId,
        name,
        email,
        phone,
        when: preferred_time,
        message,
      };

      if (selectedSlotId) body.slotId = selectedSlotId;

      const res = await fetch("/api/inspections/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatusMessage("Booking confirmed — we will contact you shortly.");
        // clear inputs
        setName("");
        setPhone("");
        setWhen(null);
        setSelectedSlotId(null);
        setMessage("");
        // close after a short delay so user sees success message
        setTimeout(() => onClose(), 1400);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatusMessage(
          (data && data.error) || "Failed to book inspection. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Error submitting booking. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="text-lg font-black">Book an Inspection</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="inspector-name"
              className="text-xs font-bold text-gray-700"
            >
              Full name
            </label>
            <input
              id="inspector-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Your name"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="inspector-email"
              className="text-xs font-bold text-gray-700"
            >
              Email (optional)
            </label>
            <input
              id="inspector-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="inspector-phone"
              className="text-xs font-bold text-gray-700"
            >
              Phone
            </label>
            <input
              id="inspector-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="0803xxxxxxx"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="inspector-when"
              className="text-xs font-bold text-gray-700"
            >
              Preferred date/time
            </label>
            <div className="mt-1">
              <DateTimePicker
                id="inspector-when"
                value={when}
                onChange={(d) => setWhen(d)}
                minDate={minWhen}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Pick a preferred date and time that works for you.
            </div>

            {/* Slots list (if any) */}
            {slotsLoading ? (
              <div className="text-sm text-gray-600 mt-2">Loading slots…</div>
            ) : slots && slots.length ? (
              <div className="mt-3">
                <div className="text-xs font-bold text-[var(--brand-green-dark)] mb-2">
                  Available slots
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {slots.map((s: Slot) => {
                    const start = new Date(s.start_at);
                    const label = start.toLocaleString();
                    const disabled = !s.available;
                    const selected = selectedSlotId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (disabled) return;
                          setSelectedSlotId(selected ? null : s.id);
                          setWhen(selected ? null : new Date(s.start_at));
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border ${
                          disabled
                            ? "bg-[var(--table-head-bg)] text-gray-600 border-gray-200"
                            : selected
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white text-[var(--foreground)] border-gray-200 hover:bg-gray-50"
                        }`}
                        disabled={disabled || loading}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{label}</div>
                          <div className="flex items-center gap-3">
                            <div className="text-xs">
                              {disabled ? "Booked" : "Open"}
                            </div>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--table-head-bg)] text-[var(--table-head-color)]">
                              {s.booked}/{s.capacity}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Select a slot to reserve it; you may also pick a custom
                  date/time below.
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="inspector-message"
              className="text-xs font-bold text-gray-700"
            >
              Message (optional)
            </label>
            <textarea
              id="inspector-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              rows={3}
              disabled={loading}
            />
          </div>

          {statusMessage && (
            <div className="p-3 rounded-lg bg-green-50 text-green-800 font-bold text-sm">
              {statusMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <CustomButton
              btnType="button"
              containerStyles="px-4 py-2 bg-white border border-gray-200 rounded-lg"
              handleClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              btnType="button"
              isDisabled={loading}
              containerStyles="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              handleClick={handleSubmit}
            >
              {loading ? "Booking..." : "Book"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
}
