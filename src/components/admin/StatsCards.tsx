"use client";

import React, { useEffect, useState } from "react";
import ApprovalsChart from "@/components/admin/ApprovalsChart";
import ViewsByCityChart from "@/components/admin/ViewsByCityChart";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  topMakes?: Array<{ make: string }>;
  topCities?: Array<{ city: string; views: number }>;
  approvalsSeries?: Array<{ date: string; count: number }>;
  createdCount?: number;
  approvedInRange?: number;
  conversionRate?: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  async function load() {
    try {
      const r = await fetch(`/api/dashboard/stats`);
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed");
      setStats(j.data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 p-4 rounded">
          <p className="text-sm text-gray-300">Total Listings</p>
          <p className="text-2xl font-black mt-2">{stats.total}</p>
        </div>
        <div className="bg-orange-600/10 p-4 rounded">
          <p className="text-sm text-orange-300">Pending</p>
          <p className="text-2xl font-black mt-2">{stats.pending}</p>
        </div>
        <div className="bg-green-600/10 p-4 rounded">
          <p className="text-sm text-green-300">Approved</p>
          <p className="text-2xl font-black mt-2">{stats.approved}</p>
        </div>
        <div className="bg-yellow-400/10 p-4 rounded">
          <p className="text-sm text-yellow-300">Created (30d)</p>
          <p className="text-2xl font-black mt-2">{stats.createdCount ?? 0}</p>
        </div>
        <div className="bg-purple-600/10 p-4 rounded">
          <p className="text-sm text-purple-300">Conversion (30d)</p>
          <p className="text-2xl font-black mt-2">
            {stats.conversionRate ?? 0}%
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ApprovalsChart series={stats.approvalsSeries ?? []} />
        </div>
        <div>
          <ViewsByCityChart cities={stats.topCities ?? []} />
        </div>
      </div>
    </div>
  );
}
