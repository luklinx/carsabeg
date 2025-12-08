// src/app/page.tsx
import ClientHome from "@/components/ClientHome";
import { MessageCircle, Zap, Shield, Phone } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-gray-50">
      {/* HERO — PURE NIGERIAN POWER, MOBILE PERFECTION */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 px-6">
        {/* Background Gradient + Subtle Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-emerald-800 to-teal-900" />
        {/* NIGERIAN-INSPIRED SUBTLE PATTERN — CLEAN & WARNING-FREE */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-emerald-900 to-transparent" />
          <div className="absolute inset-0 bg-grid-green-900/10 bg-[length:60px_60px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* MAIN HEADLINE — SHORT, LOUD, PROUD */}
          <h1 className="text-3xl md:text-4xl lg:text-7xl font-black text-white drop-shadow-4xl leading-tight">
            FIND YOUR <span className="text-yellow-400">DREAM CAR</span>
          </h1>

          {/* SUBHEAD — MINIMAL, POWERFUL */}
          <p className="mt-6 text-2xl md:text-2xl font-black text-green-100">
            Foreign Used • Nigerian Used • Brand New
          </p>

          {/* TRUST PILLS — MOBILE FRIENDLY GRID */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <Shield className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
              <p className="text-lg font-black text-white">Verified Sellers</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <Zap className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
              <p className="text-lg font-black text-white">Fast Deals</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <Phone className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
              <p className="text-lg font-black text-white">Direct Calls</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <MessageCircle className="w-12 h-12 mx-auto text-yellow-400 mb-3" />
              <p className="text-lg font-black text-white">WhatsApp First</p>
            </div>
          </div>

          {/* CTA — IMPOSSIBLE TO MISS */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/inventory"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-4"
            >
              <Zap size={48} className="animate-pulse" />
              BROWSE ALL CARS
            </Link>

            <a
              href="https://wa.me/2348022772234"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-700 hover:bg-gray-100 px-16 py-8 rounded-full font-black text-3xl md:text-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center gap-4"
            >
              <MessageCircle size={48} className="animate-bounce" />
              CHAT NOW
            </a>
          </div>

          {/* SUBTLE SCROLL HINT */}
          <div className="mt-20 animate-bounce">
            <div className="w-10 h-16 mx-auto border-4 border-white/50 rounded-full flex justify-center">
              <div className="w-2 h-6 bg-white rounded-full mt-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT-SIDE CONTENT — NO REPETITION */}
      <ClientHome />
    </main>
  );
}
