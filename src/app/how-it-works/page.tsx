// src/app/how-it-works/page.tsx
import Link from "next/link";

export const metadata = {
  title: "How It Works – Cars Abeg • Buy or Sell in 60 Seconds",
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-7xl font-black mb-8 leading-tight">
            How Cars Abeg Works
          </h1>
          <p className="text-2xl md:text-3xl font-bold max-w-4xl mx-auto">
            Buy a clean car or sell yours in minutes — no agents, no stress, no
            wahala
          </p>
        </div>
      </section>

      {/* BUYING FLOW */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl md:text-6xl font-black text-center mb-16 text-gray-900">
            Buying a Car? Done in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                1
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Browse & Pick
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Scroll through hundreds of verified foreign-used & Nigerian-used
                cars. All photos are real. All prices are final.
              </p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                2
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Chat Instantly
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Tap “Chat on WhatsApp” → speak directly to the seller. No
                middlemen. No fake agents. Just you and the owner.
              </p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                3
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Inspect & Pay
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Go see the car anywhere in Nigeria. Pay only when you’re 100%
                satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELLING FLOW */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl md:text-6xl font-black text-center mb-16 text-gray-900">
            Selling Your Car? Even Easier
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-yellow-500 text-black rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                1
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Snap Photos
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Take 5–8 clear photos of your car (inside & outside)
              </p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-yellow-500 text-black rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                2
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Fill 60-Second Form
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Enter make, model, price, your WhatsApp — that’s it
              </p>
            </div>

            <div className="text-center">
              <div className="w-28 h-28 mx-auto bg-yellow-500 text-black rounded-full flex items-center justify-center text-6xl font-black mb-8 shadow-2xl">
                3
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Get Buyers Instantly
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Your car goes live immediately. Serious buyers message you
                within minutes
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/sell"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-black text-3xl px-20 py-9 rounded-full shadow-2xl transition transform hover:scale-105"
            >
              SELL MY CAR FREE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-3xl font-black mb-16">
            Why Thousands Trust Cars Abeg
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-2xl font-bold">
            <div>No Fake Listings</div>
            <div>Direct Owner Contact</div>
            <div>Free for Sellers</div>
            <div>Instant WhatsApp Leads</div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-green-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-6xl font-black mb-10">
            Ready to Buy or Sell?
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link
              href="/"
              className="bg-white text-green-600 px-20 py-8 rounded-full text-3xl font-black hover:bg-gray-100 transition shadow-2xl"
            >
              Browse Cars Now
            </Link>
            <Link
              href="/sell"
              className="bg-yellow-400 text-black px-20 py-8 rounded-full text-3xl font-black hover:bg-yellow-300 transition shadow-2xl"
            >
              Sell My Car Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
