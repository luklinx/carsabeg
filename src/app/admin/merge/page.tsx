import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import AdminMergeForm from "@/components/AdminMergeForm";

export default async function AdminMergePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-3xl shadow-2xl">
          Unauthorized — please sign in.
        </div>
      </main>
    );
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .ilike("email", authUser.email ?? "")
    .maybeSingle();

  if (!admin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-3xl shadow-2xl">
          Forbidden — admin access required.
        </div>
      </main>
    );
  }

  const [{ data: mappings }, { data: users }] = await Promise.all([
    supabase.from("user_auth_accounts").select("auth_id, user_id, created_at"),
    supabase
      .from("users")
      .select("id, full_name, email")
      .order("created_at", { ascending: true }),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">
            Admin: Associate Auth Accounts
          </h1>
          <Link href="/dashboard" className="text-green-600 font-bold">
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="font-bold mb-4">Create Association</h2>
            <AdminMergeForm users={users ?? []} />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="font-bold mb-4">Existing Associations</h2>
            <div className="space-y-3">
              {mappings && mappings.length ? (
                mappings.map(
                  (m: {
                    auth_id: string;
                    user_id: string;
                    created_at: string;
                  }) => (
                    <div key={m.auth_id} className="p-3 border rounded-md">
                      <div className="text-sm text-gray-600">
                        Auth ID: {m.auth_id}
                      </div>
                      <div className="text-sm">User ID: {m.user_id}</div>
                      <div className="text-xs text-gray-600">
                        Created: {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-sm text-gray-600">No mappings yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
