// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminPanel from "@/components/AdminPanel";

// CHANGE THIS PASSWORD (make it strong!)
const ADMIN_PASSWORD = "carsabeg2025";

export default function AdminLoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Check auth only on client
  useEffect(() => {
    const auth = localStorage.getItem("carsabeg-admin-auth");
    setIsAuthenticated(auth === "authenticated");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("carsabeg-admin-auth", "authenticated");
      setIsAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-black flex items-center justify-center">
        <div className="text-white text-4xl font-black">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-black flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter">
              CARS
            </h1>
            <h1 className="text-6xl md:text-8xl font-black text-yellow-400 -mt-4">
              ABEG
            </h1>
            <p className="text-2xl font-black text-white/80 mt-6">
              ADMIN PORTAL
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className={`transition-all ${error ? "animate-pulse" : ""}`}>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-6 text-2xl font-black text-center rounded-3xl border-4 border-white focus:border-yellow-400 outline-none shadow-2xl bg-white/10 backdrop-blur-md text-white placeholder-white/50"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-center text-xl font-black animate-bounce">
                WRONG PASSWORD!
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-3xl py-6 rounded-3xl shadow-2xl transform hover:scale-105 transition"
            >
              ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated → show full admin panel
  return <AdminPanel />;
}
