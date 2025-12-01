// src/lib/supabaseClient.ts
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("SUPABASE ENV VARS MISSING!");
  console.error("URL:", url);
  console.error("KEY:", key?.slice(0, 10) || "missing");
}

export const supabaseBrowser = createBrowserClient(url!, key!);
