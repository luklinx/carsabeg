// src/app/not-found.tsx  ← UPGRADED VERSION (optional)
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-black text-green-600 mb-8">404</h1>
        <p className="text-2xl font-bold text-gray-800 mb-4">
          Oops! This car has been sold or no more in existence
        </p>
        <p className="text-2xl text-gray-600 mb-12">
          But don’t worry — we have plenty more!
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-full font-black text-3xl shadow-2xl transform hover:scale-105 transition"
        >
          BROWSE ALL CARS
        </Link>
      </div>
    </div>
  );
}
