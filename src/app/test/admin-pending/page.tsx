"use client";

import PendingList from "@/components/admin/PendingList";

export default function TestPendingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Pending List (dev-only)</h1>
      <PendingList />
    </div>
  );
}
