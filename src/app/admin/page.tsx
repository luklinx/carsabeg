// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminPanel from "@/components/AdminPanel";
import { Lock, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react";

const ADMIN_PASSWORD = "carsabeg2025"; // CHANGE THIS NOW!!!

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // just visual

  // SAFEST WAY: Read localStorage only during render (no effect needed)
  const isAuthenticated =
    typeof window !== "undefined"
      ? localStorage.getItem("carsabeg-admin-auth") === "authenticated"
      : false;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("carsabeg-admin-auth", "authenticated");
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        window.location.reload(); // Cleanest way to re-render after auth
      }, 1000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
      setPassword("");
    }
  };

  // NOT AUTHENTICATED → SHOW EPIC LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_#10b981,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_#f59e0b,_transparent_60%)]" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {/* Epic Logo */}
          <div className="text-center mb-16">
            <div className="flex justify-center gap-6 mb-10">
              <Shield size={90} className="text-yellow-400 animate-pulse" />
              <Zap
                size={90}
                className="text-green-400 animate-pulse delay-150"
              />
              <Shield
                size={90}
                className="text-yellow-400 animate-pulse delay-300"
              />
            </div>
            <h1 className="text-9xl md:text-10xl font-black text-white tracking-tighter leading-none">
              CARS
            </h1>
            <h1 className="text-8xl md:text-9xl font-black text-yellow-400 -mt-8 leading-none">
              ABEG
            </h1>
            <p className="text-4xl font-black text-white/90 mt-10 tracking-widest">
              ADMIN COMMAND CENTER
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-12">
            <div
              className={`transition-all duration-700 ${
                error ? "animate-shake" : ""
              }`}
            >
              <div className="relative">
                <Lock
                  size={56}
                  className="absolute left-10 top-1/2 -translate-y-1/2 text-yellow-400"
                />
                <input
                  type="password"
                  placeholder="MASTER KEY REQUIRED"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-32 pr-10 py-12 text-5xl font-black text-center rounded-3xl border-8 border-white/40 focus:border-yellow-400 outline-none shadow-3xl bg-white/10 backdrop-blur-2xl text-white placeholder-white/50 tracking-widest"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center animate-in slide-in-from-bottom duration-500">
                <div className="inline-flex items-center gap-5 bg-red-600/95 backdrop-blur-md px-12 py-8 rounded-full shadow-2xl">
                  <AlertTriangle size={56} className="animate-pulse" />
                  <p className="text-4xl font-black text-white">
                    ACCESS DENIED
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="text-center animate-in zoom-in duration-700">
                <div className="inline-flex items-center gap-5 bg-green-600/95 backdrop-blur-md px-12 py-8 rounded-full shadow-2xl">
                  <CheckCircle size={56} className="animate-ping" />
                  <p className="text-4xl font-black text-white">
                    ACCESS GRANTED — WELCOME BOSS
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={success}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:from-green-600 disabled:to-emerald-600 text-black font-black text-6xl md:text-7xl py-12 rounded-3xl shadow-3xl transform hover:scale-105 disabled:scale-100 transition-all duration-500 flex items-center justify-center gap-8"
            >
              {success ? (
                <>ENTERING SECURE ZONE...</>
              ) : (
                <>
                  <Zap size={72} className="animate-pulse" />
                  ENTER COMMAND CENTER
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/70 font-bold text-2xl mt-16">
            Gold Lion Security • Lagos, Nigeria • 2025
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED → SHOW ADMIN PANEL
  return <AdminPanel />;
}
