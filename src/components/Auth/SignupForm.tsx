// src/components/Auth/SignupForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabaseBrowser.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard/profile`,
      },
    });

    if (error) {
      setMessage("Error: " + error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Check your email! Click the confirmation link to activate your account."
    );
    setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6 max-w-md mx-auto">
      {message && (
        <div
          className={`p-4 rounded-xl text-center font-bold ${
            message.includes("Error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-6 py-4 border rounded-xl"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-6 py-4 border rounded-xl"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p className="text-center">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-green-600 font-bold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
