// src/lib/supabaseClient.ts  ← temporary nuclear file
import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowser = createBrowserClient(
  "https://gwoweovqllfzznmidskz.supabase.co", // ← PUT YOUR REAL URL HERE
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3b3dlb3ZxbGxmenpubWlkc2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MjQzNTUsImV4cCI6MjA4MDAwMDM1NX0.5Wit1hacBc8pRNS-uZGn1c_EahxEd_400XxxN7qABmw" // ← PUT YOUR REAL ANON KEY HERE (copy from Supabase → Settings → API)
);
