"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import CustomButton from "@/components/CustomButton";
import { useCallback as useReactCallback } from "react";

export default function AdminsList() {
  const [admins, setAdmins] = useState<
    { id: number; email: string; created_at?: string }[]
  >([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast, confirm } = useToast();
  // prompt not currently used here

  const load = useReactCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/dashboard/admins`);
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setAdmins(j.data || []);
    } catch (e) {
      console.error(e);
      showToast({ message: "Failed to load admins", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  async function addAdmin() {
    const e = email.trim().toLowerCase();
    if (!e) return;
    try {
      const r = await fetch(`/api/dashboard/admins`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: e }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Add failed");
      setEmail("");
      load();
      showToast({ message: "Admin added", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to add admin", type: "error" });
    }
  }

  async function removeAdmin(id: number) {
    const ok = await confirm({ message: "Remove this admin?" });
    if (!ok) return;
    try {
      const r = await fetch(`/api/dashboard/admins/${id}`, {
        method: "DELETE",
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Remove failed");
      load();
      showToast({ message: "Admin removed", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to remove admin", type: "error" });
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="bg-white/5 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Admins</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="bg-white/5 p-2 rounded flex-1"
        />
        <CustomButton
          handleClick={addAdmin}
          containerStyles="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add
        </CustomButton>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {admins.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between bg-white/5 p-3 rounded"
            >
              <div>
                <div className="font-bold">{a.email}</div>
                <div className="text-xs text-gray-300">
                  {a.created_at ? a.created_at.split("T")[0] : ""}
                </div>
              </div>
              <div>
                <CustomButton
                  handleClick={() => removeAdmin(a.id)}
                  containerStyles="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Remove
                </CustomButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
