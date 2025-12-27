import { redirect } from "next/navigation";
import AdminInspectionRow from "@/components/AdminInspectionRow";
import { getSupabaseServer } from "@/lib/supabaseServer";
import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function InspectionsAdminPage() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/admin-login");

  let is_admin = false;
  try {
    const { data: adminRow, error: adminErr } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();

    if (!adminErr && adminRow) is_admin = true;
  } catch {
    // ignore
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

  // Use the admin service client for inspections so admins see all rows even if RLS is enabled
  const client = is_admin ? supabaseAdmin : supabase;
  const { data: inspections, error } = await client
    .from("inspections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  // Only log and surface errors that contain meaningful information. Supabase sometimes
  // returns an empty object which is not actionable and just produces noisy console logs.
  let loadError: string | null = null;
  if (error && Object.keys(error).length > 0) {
    const errMsg =
      typeof (error as Record<string, unknown>).message === "string"
        ? (error as Record<string, unknown>).message
        : JSON.stringify(error);
    console.error("Failed to load inspections:", errMsg);

    // Friendly guidance for the common 'table not found' Supabase error
    if (
      /could not find the table|table '.*inspections'.*not found/i.test(
        errMsg as string
      )
    ) {
      loadError =
        "Inspections table not found. Run the migration `db/migrations/009_create_inspections_table.sql` or create the `inspections` table in your DB.";
    } else {
      loadError = errMsg as string;
    }
  }

  // `inspections` can be `null` when there are no rows returned — coerce to [] to avoid runtime crashes
  const rows = (inspections ?? []).map((ins: (typeof inspections)[number]) => ({
    ...ins,
  }));

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-black">Inspections</h1>
          <p className="text-[var(--muted)] mt-2">
            List of inspection bookings submitted by users.
          </p>
        </header>

        {loadError && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <strong>Error loading inspections:</strong>
            <div className="mt-1 text-sm text-red-600">{loadError}</div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-[var(--table-head-bg)]">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Created
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Email
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Phone
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Preferred
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Message
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-semibold text-[var(--table-head-color)]">
                  Car
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-600">
                    No inspections yet.
                  </td>
                </tr>
              ) : (
                rows.map((r: (typeof rows)[number]) => (
                  <AdminInspectionRow key={r.id} inspection={r} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
