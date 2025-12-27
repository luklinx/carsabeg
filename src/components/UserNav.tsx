// src/components/UserNav.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";

export default function UserNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user_id cookie exists
    const checkAuth = async () => {
      try {
        // Try to fetch dashboard to see if authenticated
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear client-side session (localStorage/cookies used by browser client)
      try {
        await supabaseBrowser.auth.signOut();
      } catch (e) {
        // ignore client sign-out errors, proceed to server logout
        console.error("Client signOut error:", e);
      }

      // Also clear server-side cookies/session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // force a full reload so server sees cleared cookies
      window.location.replace("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/signin"
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold"
      >
        <User size={18} />
        <span className="hidden sm:inline">Profile</span>
      </Link>
      <CustomButton
        btnType="button"
        handleClick={handleLogout}
        containerStyles="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </CustomButton>
    </div>
  );
}
