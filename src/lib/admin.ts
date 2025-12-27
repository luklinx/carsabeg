import { getSupabaseServer } from "./supabaseServer";
import supabaseAdmin from "./supabaseAdmin";

export async function getAdminUser() {
  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, is_admin: false, supabase };

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
    // ignore if table missing
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

  // If this is an admin, prefer the privileged service role client so admin actions bypass RLS
  const client = is_admin ? supabaseAdmin : supabase;

  return { user, is_admin, supabase: client };
}
