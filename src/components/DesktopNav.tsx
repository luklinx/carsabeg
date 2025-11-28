// src/components/DesktopNav.tsx
import Link from "next/link";

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex space-x-8">
      <Link
        href="/"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        Home
      </Link>
      <Link
        href="/inventory"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        All Cars
      </Link>
      <Link
        href="/sell"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        Sell Car
      </Link>
      <Link
        href="/value-my-car"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        Value Car
      </Link>
      <Link
        href="/blog"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        Blog
      </Link>
      <Link
        href="/how-it-works"
        className="text-lg font-bold hover:text-green-600 transition"
      >
        How It Works
      </Link>
    </nav>
  );
}
