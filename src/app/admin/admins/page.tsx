import AdminsList from "@/components/admin/AdminsList";

export default function AdminsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black">Manage Admins</h1>
          <p className="text-gray-300">
            Add or remove admin emails that can access the admin area.
          </p>
        </div>

        <AdminsList />
      </div>
    </div>
  );
}
