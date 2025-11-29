// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50 to-orange-50 border-t-4 border-amber-200 py-20">
      {/* Creamy milky background with warm golden undertone */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-green-600 mb-4 tracking-tight">
              CARS ABEG
            </h2>
            <p className="text-xl text-amber-900 font-bold">
              No Wahala. Just Quality Cars.
            </p>
            <p className="text-amber-800 mt-4 leading-relaxed font-medium">
              Nigeria’s most trusted marketplace for Tokunbo & Nigerian Used
              cars.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-2xl font-black text-amber-900 mb-6">Explore</h3>
            <ul className="space-y-4 text-lg">
              <li>
                <Link
                  href="/"
                  className="text-amber-800 hover:text-green-600 font-bold transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="text-amber-800 hover:text-green-600 font-bold transition"
                >
                  All Cars
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="text-amber-800 hover:text-green-600 font-bold transition"
                >
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-amber-800 hover:text-green-600 font-bold transition"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-black text-amber-900 mb-6">
              Contact Us
            </h3>
            <div className="space-y-4 text-lg text-amber-800 font-medium">
              <p>Lagos, Nigeria</p>
              <p>WhatsApp: +234 800 2277 2234</p>
              <p>hello@carsabeg.com</p>
            </div>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-2xl font-black text-amber-900 mb-6">
              Why CARS ABEG?
            </h3>
            <ul className="space-y-4 text-lg text-amber-800 font-medium">
              <li>Verified Sellers Only</li>
              <li>Direct WhatsApp Chat</li>
              <li>Daily Fresh Listings</li>
              <li>No Hidden Charges</li>
              <li>100% Nigerian Owned</li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t-2 border-amber-300 mt-16 pt-10 text-center">
          <p className="text-amber-900 font-black text-lg">
            © 2025 <span className="text-green-600">CARS ABEG</span> • Built
            with fire by <span className="text-green-600">YOU</span> • Proudly
            Made in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
