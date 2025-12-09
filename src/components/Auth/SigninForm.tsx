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

  // THIS KILLS THE WARNING — SAFE NULL CHECKING
  const signupSuccess = searchParams?.get("success") === "true";
  const redirectTo = searchParams?.get("redirect") || null;

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }

      setSuccess("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push(redirectTo || "/dashboard/profile");
      }, 800);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignin} className="space-y-6">
      {/* Success message from signup */}
      {signupSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold text-sm text-center border border-green-300">
          Account created successfully! Please sign in with your credentials.
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg font-bold text-sm text-center border border-red-300">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg font-bold text-sm text-center border border-green-300">
          {success}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-black text-xl transition-all hover:shadow-2xl disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* Signup Link */}
      <p className="text-center text-gray-700 font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-green-600 font-black hover:underline"
        >
          Create one here
        </Link>
      </p>
    </form>
  );
}
