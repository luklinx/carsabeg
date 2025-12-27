import { getSupabaseServer } from "./supabaseServer";

export type ServerAuthResult = {
  user: any | null;
  supabase: ReturnType<typeof getSupabaseServer>;
};

export async function getServerAuth(): Promise<ServerAuthResult> {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user: user ?? null, supabase };
}