// src/app/404.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-8xl font-black text-green-600 mb-8">404</h1>
        <p className="text-3xl font-black text-gray-800 mb-8">Car Not Found</p>
        <p className="text-xl text-gray-600 mb-12">
          The car you&apos;re looking for has been sold or doesn&apos;t exist.
        </p>
        <Link
          href="/inventory"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-12 py-6 rounded-2xl font-black text-2xl shadow-2xl transition hover:scale-105"
        >
          Browse All Cars
        </Link>
      </div>
    </div>
  );
}
