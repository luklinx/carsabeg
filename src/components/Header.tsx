// src/components/Header.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Cars<span className="text-black">Abeg</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-green-600">Home</Link>
            <Link href="/inventory" className="text-gray-700 hover:text-green-600">Inventory</Link>
            <Link href="/admin" className="text-gray-700 hover:text-green-600">Admin</Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link href="/" className="block py-2 text-gray-700">Home</Link>
            <Link href="/inventory" className="block py-2 text-gray-700">Inventory</Link>
            <Link href="/admin" className="block py-2 text-gray-700">Admin</Link>
          </nav>
        )}
      </div>
    </header>
  );
}