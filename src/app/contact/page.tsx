// src/app/contact/page.tsx
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Zap,
  Shield,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Contact Us – Cars Abeg • WhatsApp, Call or Visit",
  description:
    "Talk to real humans in minutes. No bots. No wahala. Just fast answers.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-yellow-50">
      {/* HERO – Nigerian Green Energy */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-32 md:py-44 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md px-10 py-5 rounded-full font-black text-2xl mb-10 shadow-2xl">
            <Zap className="animate-pulse" size={40} />
            WE REPLY IN UNDER 5 MINUTES
          </div>
          <h1 className="text-3xl md:text-3xl font-black leading-tight mb-8">
            Talk to Us Now
          </h1>
          <p className="text-3xl md:text-3xl font-black opacity-90 max-w-4xl mx-auto">
            No bots. No forms. Just real Nigerians ready to help you
          </p>
        </div>
      </section>

      {/* INSTANT CONTACT OPTIONS – The Real Heroes */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-7xl">
          <h2 className="text-3xl md:text-2xl font-black text-center mb-16 text-gray-900">
            Contact Us Any Way You Like
          </h2>

          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {/* WHATSAPP – KING OF NIGERIA */}
            <div className="group">
              <Link
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-3xl p-12 text-center shadow-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-green-600/50"
              >
                <MessageCircle
                  size={80}
                  className="mx-auto mb-8 animate-bounce"
                />
                <h3 className="text-2xl md:text-3xl font-black mb-6">
                  WhatsApp Us
                </h3>
                <p className="text-2xl font-bold opacity-90">
                  Fastest Reply • 24/7
                </p>
                <p className="text-3xl font-black mt-8">+234 901 883 7909</p>
                <span className="inline-block mt-6 bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-xl">
                  MOST POPULAR
                </span>
              </Link>
            </div>

            {/* PHONE CALL */}
            <div className="group">
              <a
                href="tel:+23480022772234"
                className="block bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-12 text-center shadow-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-blue-600/50"
              >
                <Phone size={80} className="mx-auto mb-8" />
                <h3 className="text-2xl md:text-3xl font-black mb-6">
                  Call Us
                </h3>
                <p className="text-2xl font-bold opacity-90">
                  Speak to a human now
                </p>
                <p className="text-3xl font-black mt-8">0800-CARS-ABEG</p>
                <p className="text-xl mt-4 opacity-80">Mon–Sat: 8AM–7PM</p>
              </a>
            </div>

            {/* VISIT OFFICE */}
            <div className="group">
              <a
                href="https://maps.google.com/?q=Cars+Abeg+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl p-12 text-center shadow-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-600/50"
              >
                <MapPin size={80} className="mx-auto mb-8" />
                <h3 className="text-2xl md:text-3xl font-black mb-6">
                  Visit Us
                </h3>
                <p className="text-2xl font-bold opacity-90">Come say hello!</p>
                <p className="text-3xl font-black mt-8">Lekki Phase 1, Lagos</p>
                <p className="text-xl mt-4 opacity-80">By appointment only</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SPEED BADGES */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-2xl font-black mb-16">
            Why People Love Contacting Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-2xl md:text-3xl font-black">
            <div className="flex flex-col items-center gap-4">
              <Clock size={60} className="text-green-400" />
              Reply in less than 5 mins
            </div>
            <div className="flex flex-col items-center gap-4">
              <Users size={60} className="text-yellow-400" />
              Real Nigerians Answer
            </div>
            <div className="flex flex-col items-center gap-4">
              <Shield size={60} className="text-green-500" />
              100% Verified Team
            </div>
            <div className="flex flex-col items-center gap-4">
              <MessageCircle size={60} className="text-green-400" />
              WhatsApp 24/7
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA – Unmissable */}
      <section className="py-32 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-3xl font-black mb-12">
            Need Help Right Now?
          </h2>
          <p className="text-3xl md:text-3xl font-black mb-16 max-w-4xl mx-auto">
            Don’t wait. Tap below and talk to us instantly.
          </p>

          <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
            <a
              href="https://wa.me/23480022772234"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-24 py-16 rounded-full text-3xl md:text-2xl font-black shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-6"
            >
              <MessageCircle size={80} className="animate-bounce" />
              CHAT ON WHATSAPP NOW
            </a>

            <a
              href="tel:+23480022772234"
              className="bg-white text-green-600 px-24 py-16 rounded-full text-3xl md:text-2xl font-black shadow-3xl hover:bg-gray-100 transition-all duration-300"
            >
              CALL US NOW
            </a>
          </div>

          <p className="text-3xl font-black mt-20 opacity-90">
            Made in Nigeria • For Nigerians • With Love
          </p>
        </div>
      </section>
    </div>
  );
}
