import { redirect } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";
import { getSupabaseServer } from "@/lib/supabaseServer";

export default async function AdminDashboard() {
  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/admin-login");
  }
  // Prefer checking an `admins` DB table (if present). Fall back to environment allowlist.
  let is_admin = false;
  try {
    const { data: adminRow, error: adminErr } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();

    if (!adminErr && adminRow) {
      is_admin = true;
    }
  } catch (e) {
    // ignore — table may not exist
  }

  if (!is_admin) {
    const adminList = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    is_admin =
      adminList.length > 0
        ? adminList.includes((user.email || "").toLowerCase())
        : false;
  }

  if (!is_admin) return redirect("/admin-login");
  return <AdminPanel />;
}
