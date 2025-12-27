"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; full_name: string; email: string };

export default function AdminMergeForm({ users }: { users: User[] }) {
  const [authId, setAuthId] = useState("");
  const [userId, setUserId] = useState(users?.[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/user-auth-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_id: authId, user_id: userId }),
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unknown error");

      setMessage("Mapping created successfully.");
      setAuthId("");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Auth ID
        </label>
        <input
          value={authId}
          onChange={(e) => setAuthId(e.target.value)}
          placeholder="Auth user UUID (from logs)"
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">User</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
        >
          {users?.map((u: User) => (
            <option key={u.id} value={u.id}>
              {u.full_name} — {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-bold"
        >
          {loading ? "Saving…" : "Associate"}
        </button>
        {message ? (
          <div className="text-sm text-gray-700">{message}</div>
        ) : null}
      </div>
    </form>
  );
}
