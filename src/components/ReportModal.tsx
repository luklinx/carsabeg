"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  carId?: string;
}

export default function ReportModal({ open, onClose, carId }: Props) {
  const [reason, setReason] = useState("Inappropriate content");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/report-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: carId,
          reason: `${reason}${details ? ": " + details : ""}`,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setDone(true);
        setTimeout(() => {
          setDone(false);
          onClose();
        }, 1500);
      } else {
        console.error(json);
        alert("Report failed. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Report failed. Try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-lg">
        <h3 className="text-xl font-black mb-3">Report this ad</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please tell us why you are reporting this ad.
        </p>

        {done ? (
          <div className="text-center py-8">
            <div className="font-black text-green-600">Report submitted</div>
            <div className="text-sm text-gray-600 mt-2">
              Thank you — we will review it shortly.
            </div>
          </div>
        ) : (
          <form onSubmit={submitReport} className="space-y-4">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option>Inappropriate content</option>
              <option>Fraud / Scam</option>
              <option>Duplicate listing</option>
              <option>Incorrect info</option>
              <option>Other</option>
            </select>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Additional details (optional)"
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
