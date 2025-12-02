// src/components/Footer.tsx
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Shield,
  Zap,
  Heart,
  Flag,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 border-t-8 border-amber-300 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* MAIN GRID — Mobile: Stacked | Desktop: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-center md:text-left">
          {/* BRAND — The Golden Lion */}
          <div className="order-1">
            <h2 className="text-6xl md:text-7xl font-black text-green-600 leading-none tracking-tighter">
              CARS ABEG
            </h2>
            <p className="text-2xl font-black text-amber-900 mt-4">
              No Wahala. Just Quality Cars.
            </p>
            <p className="text-lg text-amber-800 mt-6 leading-relaxed font-medium max-w-xs mx-auto md:mx-0">
              Nigeria’s fastest-growing marketplace for Tokunbo & Nigerian Used
              cars.
            </p>

            {/* Trust Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-8">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="text-green-600" size={28} />
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Zap className="text-yellow-600" size={28} />
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Heart className="text-orange-600" size={28} />
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="order-3 md:order-2">
            <h3 className="text-2xl font-black text-amber-900 mb-6">Explore</h3>
            <ul className="space-y-5 text-lg">
              {[
                { href: "/", label: "Home" },
                { href: "/inventory", label: "All Cars" },
                { href: "/sell", label: "Sell Your Car" },
                { href: "/value-my-car", label: "Value My Car" },
                { href: "/how-it-works", label: "How It Works" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-amber-800 hover:text-green-600 font-bold text-lg transition-all hover:translate-x-2 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT — WhatsApp King */}
          <div className="order-2 md:order-3">
            <h3 className="text-2xl font-black text-amber-900 mb-6">
              Talk to Us
            </h3>
            <div className="space-y-6 text-lg font-bold text-amber-800">
              <a
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-4 bg-green-600 text-white px-8 py-5 rounded-full shadow-2xl hover:shadow-green-600/50 transform hover:scale-105 transition-all"
              >
                <MessageCircle size={28} />
                WhatsApp Us Now
              </a>
              <div className="space-y-4 mt-6">
                <p className="flex items-center justify-center md:justify-start gap-3">
                  <Phone size={20} className="text-green-600" />
                  ++234 901 883 7909
                </p>
                <p className="flex items-center justify-center md:justify-start gap-3">
                  <Mail size={20} className="text-green-600" />
                  hello@carsabeg.com
                </p>
                <p className="flex items-center justify-center md:justify-start gap-3">
                  <MapPin size={20} className="text-green-600" />
                  Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          {/* WHY CHOOSE US — Pride of Naija */}
          <div className="order-4">
            <h3 className="text-2xl font-black text-amber-900 mb-6">
              Why CARS ABEG?
            </h3>
            <ul className="space-y-5 text-lg font-bold text-amber-800">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-green-600">Verified Sellers Only</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-green-600">Direct WhatsApp Deals</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-green-600">Fresh Cars Daily</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-green-600">No Hidden Fees</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Flag className="text-green-600" size={24} />
                <span className="text-green-600 font-black">
                  100% Nigerian Owned
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* FINAL GOLDEN LINE */}
        <div className="border-t-4 border-amber-400 mt-20 pt-10 text-center">
          <p className="text-2xl font-black text-amber-900">
            © 2025 <span className="text-green-600 text-3xl">CARS ABEG</span> •
            Built with <span className="text-red-600">♥</span> in Nigeria by{" "}
            <span className="text-green-600">THE KING</span>
          </p>
          <p className="text-amber-800 font-bold mt-4 text-lg">
            Proudly Made in Naija • For Nigerians • By Nigerians
          </p>
        </div>
      </div>
    </footer>
  );
}
