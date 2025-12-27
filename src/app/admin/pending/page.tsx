import PendingList from "@/components/admin/PendingList";
import StatsCards from "@/components/admin/StatsCards";

export default function PendingAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black">Pending Listings</h1>
          <p className="text-gray-300">Review and moderate new listings</p>
        </div>

        <StatsCards />

        <PendingList />
      </div>
    </div>
  );
}
