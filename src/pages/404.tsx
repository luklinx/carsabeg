// pages/404.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-9xl font-black text-green-600 mb-8">404</h1>
        <p className="text-4xl font-black text-gray-800 mb-8">Car Not Found</p>
        <p className="text-xl text-gray-600 mb-12">
          This car has been sold or the link is broken.
        </p>
        <Link
          href="/inventory"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-16 py-8 rounded-full font-black text-3xl shadow-2xl transition hover:scale-110"
        >
          Browse All Cars
        </Link>
      </div>
    </div>
  );
}
