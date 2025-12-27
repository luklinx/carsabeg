import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!url || !serviceKey) {
  console.warn("supabaseAdmin: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL");
}

const supabaseAdmin = createClient(url, serviceKey as string, {
  auth: { persistSession: false },
});

export default supabaseAdmin;
