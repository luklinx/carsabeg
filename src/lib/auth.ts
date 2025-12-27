"use client";

// lib/auth.ts
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Redirect to a client-side callback that will persist the session to
        // server-side cookies and then navigate to the admin area.
        redirectTo: `${window.location.origin}/auth/callback?redirect=/admin`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}
