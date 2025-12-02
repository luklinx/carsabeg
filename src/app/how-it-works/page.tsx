// src/app/how-it-works/page.tsx
import Link from "next/link";
import {
  CheckCircle,
  MessageCircle,
  Camera,
  Zap,
  Shield,
  Users,
  Clock,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "How It Works – Cars Abeg • Buy or Sell in 60 Seconds",
  description:
    "No agents. No stress. Just real cars and real owners — Buy or sell in minutes.",
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-yellow-50">
      {/* HERO – Nigerian Power */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-32 md:py-44 overflow-hidden relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md px-10 py-5 rounded-full font-black text-2xl mb-10 shadow-2xl">
            <Zap className="animate-pulse" size={40} />
            FASTEST CAR DEALS IN NIGERIA
          </div>
          <h1 className="text-3xl md:text-3xl font-black leading-tight mb-8">
            How Cars Abeg Works
          </h1>
          <p className="text-3xl md:text-3xl font-black opacity-90 max-w-5xl mx-auto">
            Buy a clean car or sell yours in{" "}
            <span className="text-yellow-400">60 seconds</span> — no agents, no
            wahala
          </p>
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </section>

      {/* BUYING FLOW – 3 Steps to Glory */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-2xl font-black text-center mb-20 text-gray-900">
            Buying a Car? Done in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                number: "1",
                title: "Browse & Pick Your Ride",
                desc: "Hundreds of verified Tokunbo & Nigerian Used cars. Real photos. Real prices. No fake listings.",
                icon: <Phone className="w-20 h-20" />,
              },
              {
                number: "2",
                title: "Chat Directly with Owner",
                desc: "Tap “Chat on WhatsApp” → speak to the seller instantly. No middlemen. No fake agents. Just real talk.",
                icon: <MessageCircle className="w-20 h-20" />,
                highlight: true,
              },
              {
                number: "3",
                title: "Inspect & Pay When Happy",
                desc: "Go see the car anywhere in Nigeria. Pay only when you're 100% satisfied. Your money, your rules.",
                icon: <CheckCircle className="w-20 h-20" />,
              },
            ].map((step, i) => (
              <div
                key={i}
                className={`text-center group transform transition-all duration-500 hover:scale-105 ${
                  step.highlight ? "md:scale-110" : ""
                }`}
              >
                <div
                  className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-black shadow-3xl mb-10 ${
                    step.highlight
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse"
                      : "bg-gradient-to-br from-green-600 to-emerald-600"
                  }`}
                >
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
                  {step.title}
                </h3>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-bold">
                  {step.desc}
                </p>
                <div className="mt-8 text-green-600">{step.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELLING FLOW – Even Easier */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-2xl font-black text-center mb-20 text-gray-900">
            Selling Your Car? Even Easier
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                number: "1",
                title: "Snap 5–8 Photos",
                desc: "Inside, outside, engine, papers — just take clear pics with your phone",
                icon: <Camera className="w-16 h-16" />,
              },
              {
                number: "2",
                title: "Fill 60-Second Form",
                desc: "Make, model, price, your WhatsApp — that’s literally all we need",
                icon: <Clock className="w-16 h-16" />,
              },
              {
                number: "3",
                title: "Get Buyers in Minutes",
                desc: "Your car goes live instantly. Serious buyers message you same day — sometimes in 5 minutes!",
                icon: <MessageCircle className="w-16 h-16" />,
              },
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-36 h-36 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 text-black rounded-full flex items-center justify-center text-2xl font-black shadow-3xl mb-10 group-hover:animate-bounce">
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
                  {step.title}
                </h3>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-bold">
                  {step.desc}
                </p>
                <div className="mt-8 text-yellow-600">{step.icon}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link
              href="/sell"
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black text-2xl md:text-3xl px-24 py-12 rounded-full shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              SELL MY CAR FREE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BADGES – Nigerian Pride */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-2xl font-black mb-16">
            Why 100,000+ Nigerians Trust Cars Abeg
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-2xl md:text-3xl font-black">
            <div className="flex flex-col items-center gap-4">
              <Shield size={60} className="text-green-500" />
              No Fake Listings
            </div>
            <div className="flex flex-col items-center gap-4">
              <Users size={60} className="text-yellow-400" />
              Direct Owner Contact
            </div>
            <div className="flex flex-col items-center gap-4">
              <Zap size={60} className="text-orange-500" />
              Free for Sellers
            </div>
            <div className="flex flex-col items-center gap-4">
              <MessageCircle size={60} className="text-green-400" />
              Instant WhatsApp Leads
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA – The Money Shot */}
      <section className="py-32 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-3xl font-black mb-12">
            Ready to Buy or Sell?
          </h2>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center max-w-5xl mx-auto">
            <Link
              href="/inventory"
              className="bg-white text-green-600 px-20 py-12 rounded-full text-2xl md:text-3xl font-black hover:bg-gray-100 shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              Browse Cars Now
            </Link>
            <Link
              href="/sell"
              className="bg-yellow-400 text-black px-20 py-12 rounded-full text-2xl md:text-3xl font-black hover:bg-yellow-300 shadow-3xl transform hover:scale-110 transition-all duration-300"
            >
              Sell My Car Free
            </Link>
          </div>
          <p className="text-3xl font-black mt-16 opacity-90">
            Made in Nigeria • For Nigerians • By Nigerians
          </p>
        </div>
      </section>
    </div>
  );
}
