// app/admin/page.tsx
import { useAuth } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center">
        <div className="text-4xl font-black text-white">Loading Admin...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-black mb-4">Access Denied</h1>
          <p className="text-xl">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}
