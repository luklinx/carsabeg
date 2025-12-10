// src/components/Auth/SignupForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams?.get("redirect") || "/dashboard/profile";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabaseBrowser.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // SUCCESS — Auto sign in + redirect
      if (data.user) {
        // User created and confirmed (if email confirm off)
        router.push(redirectTo);
        router.refresh();
      } else {
        // Email confirmation required
        setError("");
        alert("Check your email for confirmation link!");
        router.push("/auth/signin");
      }
    } catch (error) {
      const err = error as { message?: string };
      setError(err.message || "An error occurred. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl font-bold text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="Your full name"
            required
          />
        </div>
      </div>

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
            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="+234 901 883 7909"
            required
          />
        </div>
      </div>

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
            className="w-full pl-10 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="Minimum 6 characters"
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

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-4 border-2 border-gray-300 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
            placeholder="Confirm your password"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 rounded-xl font-black text-xl shadow-2xl transition-all hover:shadow-green-500/25 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-gray-600 font-medium">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-green-600 font-black hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </form>
  );
}
