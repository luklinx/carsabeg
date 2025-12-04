"use client";

// app/admin/login/page.tsx
import { useAuth } from "@/lib/auth";

export default function AdminLoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/20 max-w-md w-full p-12 text-center">
        <h1 className="text-5xl font-black text-white mb-8">ADMIN LOGIN</h1>
        <p className="text-xl text-gray-300 mb-12">Secure access required</p>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white text-black py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition"
        >
          LOGIN WITH GOOGLE
        </button>

        <p className="text-center text-gray-400 mt-12 text-sm">
          Only authorized admins • Contact support if issues
        </p>
      </div>
    </div>
  );
}
