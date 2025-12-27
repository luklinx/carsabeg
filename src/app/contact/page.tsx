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
  Mail,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us – Cars Abeg • WhatsApp, Call or Visit",
  description:
    "Talk to real humans in minutes. No bots. No wahala. Just fast answers.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-yellow-50">
      {/* HERO — compact */}
      <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-black text-base mb-6 shadow">
            <Zap className="animate-pulse" size={28} />
            Reply within minutes
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight mb-3">
            Contact Cars Abeg
          </h1>
          <p className="text-sm md:text-base opacity-90 max-w-3xl mx-auto">
            Real people, fast replies. Chat on WhatsApp, call, or send us a
            message below.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS — compact cards */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-gray-900">
            Quick ways to reach us
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link
              href="https://wa.me/2349018837909"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-green-600 text-white rounded-lg p-4 md:p-5 shadow hover:scale-102 transition-transform"
            >
              <MessageCircle size={28} className="mt-1" />
              <div className="text-left">
                <div className="font-black">WhatsApp</div>
                <div className="text-xs opacity-90">Fast replies • 24/7</div>
                <div className="text-sm mt-2 font-bold">+234 901 883 7909</div>
              </div>
            </Link>

            <a
              href="tel:+2349018837909"
              className="flex items-start gap-3 bg-white border rounded-lg p-4 md:p-5 shadow-sm hover:shadow transition"
            >
              <Phone size={28} className="text-amber-700 mt-1" />
              <div className="text-left">
                <div className="font-black text-amber-900">Call</div>
                <div className="text-xs opacity-90">Mon–Sat 8AM–7PM</div>
                <div className="text-sm mt-2 font-bold">0800-CARS-ABEG</div>
              </div>
            </a>

            <a
              href="mailto:support@carsabeg.ng"
              className="flex items-start gap-3 bg-white border rounded-lg p-4 md:p-5 shadow-sm hover:shadow transition"
            >
              <Mail size={28} className="text-amber-700 mt-1" />
              <div className="text-left">
                <div className="font-black text-amber-900">Email</div>
                <div className="text-xs opacity-90">Support & billing</div>
                <div className="text-sm mt-2 font-bold">
                  support@carsabeg.ng
                </div>
              </div>
            </a>

            <a
              href="https://maps.google.com/?q=Cars+Abeg+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white border rounded-lg p-4 md:p-5 shadow-sm hover:shadow transition"
            >
              <MapPin size={28} className="text-amber-700 mt-1" />
              <div className="text-left">
                <div className="font-black text-amber-900">Office</div>
                <div className="text-xs opacity-90">By appointment</div>
                <div className="text-sm mt-2 font-bold">
                  Lekki Phase 1, Lagos
                </div>
              </div>
            </a>
          </div>

          <div className="mt-6 text-center text-xs text-amber-800">
            <Link href="/faqs" className="font-semibold text-amber-900">
              See support FAQs
            </Link>{" "}
            •{" "}
            <Link href="/support" className="font-semibold text-amber-900">
              Contact Support
            </Link>
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
              href="https://wa.me/2349018837909"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-24 py-16 rounded-full text-3xl md:text-2xl font-black shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-6"
            >
              <MessageCircle size={80} className="animate-bounce" />
              CHAT ON WHATSAPP NOW
            </a>

            <a
              href="tel:+2349018837909"
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
