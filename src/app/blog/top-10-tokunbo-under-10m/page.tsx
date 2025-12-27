// src/app/blog/top-10-tokunbo-under-10m/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Top 10 Foreign Used Cars Under ₦10 Million in Nigeria (November 2025 Live Prices)",
  description:
    "The cleanest, most reliable foreign-used cars you can buy right now in Lagos, Abuja & PH under 10 million naira.",
};

export default function Top10TokunboUnder10M() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-green-600 font-black text-lg mb-4 tracking-wider">
            UPDATED — 27 NOVEMBER 2025
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">
            Top 10 Foreign Used Cars Under ₦10 Million in Nigeria
            <br className="hidden md:block" />
            <span className="text-green-600">(November 2025 Live Prices)</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto">
            These are the cleanest, most reliable foreign-used cars you can
            drive home TODAY without spending up to 10 million naira.
          </p>
        </header>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-6 text-xl md:text-2xl font-black">Rank</th>
                <th className="p-6 text-xl md:text-2xl font-black">
                  Car + Nickname
                </th>
                <th className="p-6 text-xl md:text-2xl font-black">Year</th>
                <th className="p-6 text-xl md:text-2xl font-black">
                  Lagos Price
                </th>
                <th className="p-6 text-xl md:text-2xl font-black">
                  Why It Wins in 2025
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  rank: 1,
                  car: "Toyota Corolla “Baby Boy”",
                  year: "2015–2018",
                  price: "₦7.4M – ₦9.8M",
                  why: "Parts cost ₦2k, fuel economy king, zero headache for 10 years",
                },
                {
                  rank: 2,
                  car: "Honda Accord “Evil Spirit”",
                  year: "2008–2012",
                  price: "₦5.9M – ₦7.8M",
                  why: "V6 power, still turns heads on Third Mainland Bridge",
                },
                {
                  rank: 3,
                  car: "Toyota Camry “Big Daddy/Orobo”",
                  year: "2007–2011",
                  price: "₦5.6M – ₦7.6M",
                  why: "Soft suspension, AC chills like Canada, family favourite",
                },
                {
                  rank: 4,
                  car: "Toyota Camry “Muscle”",
                  year: "2012–2017",
                  price: "₦8.8M – ₦9.9M",
                  why: "Sharp face, leather seats, reverse camera — looks ₦18M",
                },
                {
                  rank: 5,
                  car: "Honda CR-V",
                  year: "2010–2014",
                  price: "₦7.2M – ₦9.6M",
                  why: "High ground clearance, perfect for Lagos & Abuja bad roads",
                },
                {
                  rank: 6,
                  car: "Toyota RAV4 “Small Boy”",
                  year: "2008–2012",
                  price: "₦6.8M – ₦9.2M",
                  why: "Ladies’ favourite, strong 4WD, never stuck in flood",
                },
                {
                  rank: 7,
                  car: "Honda Civic",
                  year: "2012–2016",
                  price: "₦6.9M – ₦9.4M",
                  why: "Sharp handling, low fuel, Yahoo boys’ second choice",
                },
                {
                  rank: 8,
                  car: "Mercedes-Benz C300",
                  year: "2008–2012",
                  price: "₦7.5M – ₦9.8M",
                  why: "Enter any hotel and valet will fight to park it",
                },
                {
                  rank: 9,
                  car: "Toyota Venza",
                  year: "2009–2013",
                  price: "₦8.5M – ₦9.9M",
                  why: "Panoramic roof, thumbstart — people think it’s 2020 model",
                },
                {
                  rank: 10,
                  car: "Lexus RX330/350 (old body)",
                  year: "2007–2009",
                  price: "₦7.8M – ₦9.7M",
                  why: "Quiet cabin, bulletproof engine, “big man” status",
                },
              ].map((item) => (
                <tr key={item.rank} className="hover:bg-gray-50 transition">
                  <td className="p-6 text-2xl font-black text-green-600">
                    {item.rank}
                  </td>
                  <td className="p-6 text-xl md:text-2xl font-bold text-gray-900">
                    {item.car}
                  </td>
                  <td className="p-6 text-lg md:text-xl text-gray-700">
                    {item.year}
                  </td>
                  <td className="p-6 text-xl md:text-2xl font-black text-green-600">
                    {item.price}
                  </td>
                  <td className="p-6 text-lg md:text-xl text-gray-700">
                    {item.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bonus Section */}
        <section className="bg-green-50 rounded-3xl p-10 md:p-16 mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
            Hidden Gems Under ₦10M (Bonus)
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              "Acura MDX 2008–2010 → ₦7.2M–₦9.3M",
              "Hyundai Sonata 2011–2014 → ₦6.3M–₦8.2M",
              "Mazda CX-7/CX-9 → ₦7.0M–₦9.0M",
            ].map((gem) => (
              <div key={gem} className="bg-white rounded-2xl p-8 shadow-xl">
                <p className="text-xl md:text-2xl font-black text-gray-900">
                  {gem.split("→")[0]}
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {gem.split("→")[1]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="text-center mb-20">
          <h2 className="text-2xl md:text-3xl font-black mb-10">
            Pro Tips Before You Pay
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              "Original customs duty papers (not photocopy)",
              "Clean VIN number check",
              "Scanning ₦15k–₦25k — NEVER skip!",
            ].map((tip) => (
              <div
                key={tip}
                className="bg-black text-white rounded-2xl p-8 text-xl font-bold"
              >
                {tip}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-black text-3xl md:text-2xl px-16 py-10 rounded-full shadow-2xl transition transform hover:scale-105"
          >
            SEE ALL TOKUNBO CARS UNDER ₦10M RIGHT NOW
          </Link>
          <p className="mt-8 text-2xl font-bold text-gray-700">
            Your next clean ride is one WhatsApp message away.
          </p>
        </div>
      </div>
    </article>
  );
}
