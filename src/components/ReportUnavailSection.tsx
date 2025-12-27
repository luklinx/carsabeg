"use client";

import React, { useState } from "react";
import ReportModal from "./ReportModal";

interface Props {
  carId: string;
  isLoggedIn?: boolean;
}

export default function ReportUnavailSection({ carId, isLoggedIn }: Props) {
  const [reportOpen, setReportOpen] = useState(false);

  function openUnavailable() {
    if (isLoggedIn === null || isLoggedIn === undefined) {
      window.location.href = "/auth/signin";
      return;
    }
    if (!isLoggedIn) {
      window.location.href = "/auth/signin";
      return;
    }
    // reuse existing listener pattern — CarDetailActions listens for this event
    window.dispatchEvent(new CustomEvent("open-unavailable"));
  }

  return (
    <div className="mt-6 w-full">
      <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base sm:text-lg font-extrabold text-gray-900">
            Report or Mark Unavailable
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Help keep listings honest by reporting issues or marking as
            unavailable
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportOpen(true)}
            className="underline text-sm text-gray-600"
          >
            Report this ad
          </button>

          <button
            onClick={openUnavailable}
            className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-black"
            aria-label="Mark car unavailable"
          >
            Mark Unavailable
          </button>
        </div>
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        carId={carId}
      />
    </div>
  );
}
