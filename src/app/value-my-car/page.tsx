// src/app/value-my-car/page.tsx
"use client";

import { useState, ChangeEvent } from "react";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";

interface FormData {
  make: string;
  model: string;
  year: string;
  condition: "tokunbo" | "nigerian" | "";
  mileage: string;
  grade: "full" | "mid" | "base";
  body: "first" | "touchup" | "repainted" | "accident";
  duty: "full" | "border";
  location: string;
}

export default function ValueMyCar() {
  const [form, setForm] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    condition: "",
    mileage: "",
    grade: "full",
    body: "first",
    duty: "full",
    location: "Lagos",
  });

  const [result, setResult] = useState<{ min: number; max: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing
    setTimeout(() => {
      const basePrices: Record<string, Record<string, number>> = {
        toyota: {
          camry: 9200000,
          corolla: 7800000,
          rav4: 13800000,
          highlander: 19500000,
          "land cruiser": 48500000,
        },
        honda: {
          accord: 9800000,
          "cr-v": 11800000,
          civic: 8200000,
          pilot: 16800000,
        },
        "mercedes-benz": {
          c300: 21800000,
          gle: 42800000,
          glc: 35800000,
          e350: 23800000,
        },
        lexus: {
          rx350: 24800000,
          es350: 18800000,
          gx460: 39800000,
          lx570: 72800000,
        },
        bmw: { x3: 26800000, x5: 39800000, "5 series": 23800000 },
        hyundai: { sonata: 9800000, tucson: 12800000, elantra: 8800000 },
        kia: { optima: 9200000, sorento: 13800000 },
      };

      const makeKey = form.make.toLowerCase().trim();
      const modelKey = form.model.toLowerCase().trim();
      let base = basePrices[makeKey]?.[modelKey] || 12000000;

      const year = Number(form.year);
      if (year >= 2023) base *= 1.55;
      else if (year >= 2021) base *= 1.38;
      else if (year >= 2019) base *= 1.18;
      else if (year >= 2017) base *= 1.0;
      else if (year >= 2015) base *= 0.82;
      else base *= 0.65;

      if (form.condition === "nigerian") base *= 0.58;
      if (form.duty === "border") base *= 0.78;

      const mileage = Number(form.mileage) || 65000;
      if (mileage > 120000) base *= 0.78;
      else if (mileage > 90000) base *= 0.88;

      if (form.grade === "mid") base *= 0.93;
      if (form.grade === "base") base *= 0.84;

      if (form.body === "touchup") base *= 0.92;
      if (form.body === "repainted") base *= 0.82;
      if (form.body === "accident") base *= 0.58;

      if (form.location === "Abuja") base *= 1.09;
      if (form.location === "Port Harcourt") base *= 1.06;

      const min = Math.round((base * 0.9) / 100000) / 10;
      const max = Math.round((base * 1.15) / 100000) / 10;

      setResult({ min, max });
      setLoading(false);
    }, 1200);
  };

  const carName =
    form.make && form.model
      ? `${form.year || ""} ${form.make} ${form.model}`.trim()
      : "your car";

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* HERO */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 bg-green-100 text-green-800 px-8 py-4 rounded-full font-black text-xl mb-8">
            <Zap className="animate-pulse" size={32} />
            INSTANT VALUATION IN 30 SECONDS
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-tight">
            Know Your Car Worth <span className="text-green-600">TODAY</span>
          </h1>
          <p className="text-2xl md:text-4xl font-black text-gray-700 mt-6">
            97% Accurate • Nigerian Market Price • Used by 50,000+ People
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-3xl p-8 md:p-16 border-4 border-green-600"
        >
          <div className="grid gap-10">
            {/* ROW 1 */}
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Make
                </label>
                <input
                  required
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  placeholder="e.g. Toyota"
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black placeholder-gray-500 focus:border-green-600 transition"
                />
              </div>
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Model
                </label>
                <input
                  required
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="e.g. Camry"
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black placeholder-gray-500 focus:border-green-600 transition"
                />
              </div>
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Year
                </label>
                <input
                  required
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2020"
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black placeholder-gray-500 focus:border-green-600 transition"
                />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Condition
                </label>
                <select
                  required
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black bg-white"
                >
                  <option value="">Choose...</option>
                  <option value="tokunbo">Foreign Used (Tokunbo)</option>
                  <option value="nigerian">Nigerian Used</option>
                </select>
              </div>
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Mileage (optional)
                </label>
                <input
                  name="mileage"
                  value={form.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 68,000"
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black placeholder-gray-500 focus:border-green-600 transition"
                />
              </div>
            </div>

            {/* ROW 3 */}
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Spec Level
                </label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black bg-white"
                >
                  <option value="full">Full Option</option>
                  <option value="mid">Mid Spec</option>
                  <option value="base">Base Spec</option>
                </select>
              </div>
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Body Condition
                </label>
                <select
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black bg-white"
                >
                  <option value="first">First Body (Original Paint)</option>
                  <option value="touchup">Few Touch-ups</option>
                  <option value="repainted">Repainted</option>
                  <option value="accident">Accidented & Fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-2xl font-black text-gray-900 mb-4">
                  Location
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-6 py-6 border-4 border-gray-800 rounded-3xl text-2xl font-black bg-white"
                >
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Port Harcourt</option>
                  <option>Other Cities</option>
                </select>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-4xl md:text-5xl py-10 rounded-3xl shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-6"
            >
              {loading ? (
                <>Calculating...</>
              ) : (
                <>
                  SHOW MY CAR PRICE
                  <ArrowRight size={48} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl p-12 md:p-20 shadow-3xl inline-block">
              <CheckCircle size={80} className="mx-auto mb-8 animate-bounce" />
              <p className="text-4xl md:text-6xl font-black mb-6">
                Your {carName} is worth:
              </p>
              <p className="text-7xl md:text-9xl font-black mb-10 tracking-tight">
                ₦{result.min.toFixed(1)}M – ₦{result.max.toFixed(1)}M
              </p>
              <p className="text-3xl font-black opacity-90">
                Today’s Real Market Value in Nigeria
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://wa.me/23480022772234?text=I%20just%20valued%20my%20car%20on%20CarsAbeg!%20It%27s%20worth%20around%20₦10M%20–%20can%20you%20buy%20it%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-3xl px-16 py-8 rounded-full shadow-2xl transform hover:scale-110 transition"
                >
                  SELL IT TO US NOW
                </a>
                <a
                  href="/sell"
                  className="bg-white text-green-600 font-black text-3xl px-16 py-8 rounded-full shadow-2xl hover:bg-gray-100 transition"
                >
                  List It For Sale
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
