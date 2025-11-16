// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mb-8">Car not found!</p>
      <Link href="/" className="bg-green-600 text-white px-8 py-3 rounded-lg">
        Back to Home
      </Link>
    </div>
  );
}
