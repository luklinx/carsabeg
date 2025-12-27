// src/components/Auth/SigninForm.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import CustomButton from "@/components/CustomButton";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") || "/dashboard/profile";

  // Prefill email and show duplicate-account message if redirected here from profile
  React.useEffect(() => {
    const qEmail = searchParams?.get("email") || "";
    const dup = searchParams?.get("duplicate");
    if (qEmail) setEmail(qEmail);
    if (dup) {
      setInfo(
        "An account with this email already exists. Please sign in to that account or contact support to merge accounts."
      );
    }
  }, [searchParams]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Persist auth session into server cookies so server-side middleware/layouts can read it
      try {
        const session = data?.session;
        if (session) {
          await fetch("/api/auth/set-session", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          });

          // Do a full navigation so the server receives the auth cookies we just set
          window.location.replace(redirectTo);
          return;
        }
      } catch (err) {
        console.error("Failed to set server session:", err);
      }

      // Fallback client navigation
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      // THIS LINE WAS THE PROBLEM — NOW FIXED
      const err = error as { message?: string };
      setError(err.message || "Network error. Please try again.");
      console.error("Signin failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignin} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl font-bold text-center">
          {error}
        </div>
      )}

      {info && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-900 p-4 rounded-xl font-medium text-center">
          {info}{" "}
          <Link href="/auth/forgot" className="underline font-bold">
            Reset password
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="underline font-bold">
            contact support
          </Link>
          .
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-600" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="your@email.com"
            required
            autoFocus
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-600" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="••••••••"
            required
          />
          <CustomButton
            onClick={() => setShowPassword(!showPassword)}
            containerStyles="absolute right-3 top-3.5 text-gray-600 hover:text-gray-700"
            btnType="button"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </CustomButton>
        </div>
      </div>

      <CustomButton
        btnType="submit"
        isDisabled={loading}
        containerStyles="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 rounded-xl font-black text-xl shadow-2xl transition-all hover:shadow-green-500/25 disabled:cursor-not-allowed"
        title={loading ? "Signing in..." : "Sign In"}
      />

      <p className="text-center text-gray-600 font-medium">
        New here?{" "}
        <Link
          href="/auth/signup"
          className="text-green-600 font-black hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
