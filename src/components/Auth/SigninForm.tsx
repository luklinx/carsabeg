// src/components/Auth/SigninForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // SAFE NULL CHECK — KILLS ALL WARNINGS
  const signupSuccess = searchParams?.get("success") === "true";
  const redirectTo = searchParams?.get("redirect") || "/dashboard/profile";

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      setSuccess("Welcome back! Redirecting...");
      setTimeout(() => {
        router.push(redirectTo);
        router.refresh(); // Force reload session
      }, 1000);
    } catch (err) {
      setError("Network error. Check your connection.");
      console.error("Signin failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignin} className="space-y-6 w-full max-w-md">
      {/* Success from signup */}
      {signupSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl font-bold text-center">
          Account created! Now sign in below
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl font-bold text-center">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl font-bold text-center">
          {success}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 rounded-xl font-black text-xl shadow-2xl transition-all hover:shadow-green-500/25 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* Signup Link */}
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
