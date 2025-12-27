"use client";
import { useState } from "react";

type Inspection = {
  id: string;
  car_id?: string | null;
  name: string;
  email?: string | null;
  phone: string;
  preferred_time?: string | null;
  message?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default function AdminInspectionRow({
  inspection,
}: {
  inspection: Inspection;
}) {
  const [status, setStatus] = useState(inspection.status || "pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/inspections/${inspection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update");
      setStatus(json.inspection.status);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error";
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-t">
      <td className="p-3 text-sm">
        {new Date(inspection.created_at || "").toLocaleString()}
      </td>
      <td className="p-3 text-sm">{inspection.name}</td>
      <td className="p-3 text-sm">{inspection.email || "—"}</td>
      <td className="p-3 text-sm">{inspection.phone}</td>
      <td className="p-3 text-sm">{inspection.preferred_time || "—"}</td>
      <td className="p-3 text-sm">{inspection.message || "—"}</td>
      <td className="p-3 text-sm">
        <select
          value={status}
          onChange={(e) => {
            const v = e.target.value;
            setStatus(v);
            updateStatus(v);
          }}
          className="border rounded px-2 py-1"
          disabled={loading}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {loading && <div className="text-xs text-gray-600">Saving…</div>}
        {error && <div className="text-xs text-red-500">{error}</div>}
      </td>
      <td className="p-3 text-sm">
        {inspection.car_id ? (
          <a
            href={`/car/${inspection.car_id}`}
            className="text-green-600 underline"
          >
            View car
          </a>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}
