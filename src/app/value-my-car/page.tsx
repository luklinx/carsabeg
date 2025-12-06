// src/app/value-my-car/page.tsx
"use client";

import { useState, ChangeEvent, ReactNode } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Brain } from "lucide-react";

interface FormData {
  make: string;
  model: string;
  year: string;
  condition: "tokunbo" | "nigerian" | "";
  mileage: string;
  grade: "full" | "mid" | "base";
  body: "first" | "touchup" | "repainted" | "accident";
  location: "Lagos" | "Abuja" | "Port Harcourt" | "Other Cities";
}

// INPUT — FULLY TYPE-SAFE
function Input({
  label,
  ...props
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-lg md:text-xl font-bold text-gray-800 mb-2">
        {label}
      </label>
      <input
        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg font-medium focus:border-green-600 focus:outline-none transition"
        {...props}
      />
    </div>
  );
}

// SELECT — NOW WITH CHILDREN SUPPORT (THIS WAS THE FIX)
function Select({
  label,
  children,
  ...props
}: {
  label: string;
  children: ReactNode;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-lg md:text-xl font-bold text-gray-800 mb-2">
        {label}
      </label>
      <select
        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg font-medium focus:border-green-600 focus:outline-none transition bg-white"
        {...props}
      >
        {children}
      </select>
    </div>
  );
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
    location: "Lagos",
  });
  const [result, setResult] = useState<{ min: number; max: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.make || !form.model || !form.year || !form.condition) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: form.make.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          condition: form.condition,
          mileage: form.mileage
            ? Number(form.mileage.replace(/,/g, ""))
            : undefined,
          grade: form.grade,
          body: form.body,
          location: form.location,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ min: data.valuation.min, max: data.valuation.max });
      } else {
        throw new Error("AI failed");
      }
    } catch {
      setError("AI is thinking... Try again or chat us on WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const carName =
    form.year && form.make && form.model
      ? `${form.year} ${form.make} ${form.model}`
      : "your car";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* HERO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm md:text-lg font-bold mb-6">
            <Brain size={24} className="animate-pulse" />
            AI-Powered • 98.7% Accurate • Real-Time Nigerian Prices
          </div>
          <h1 className="text-2xl md:text-2xl font-black text-gray-900 leading-tight">
            Value Your <span className="text-green-600">{carName}</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mt-4 font-medium">
            Get instant, accurate price in 15 seconds
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Make"
              name="make"
              value={form.make}
              onChange={handleChange}
              placeholder="Toyota"
              required
            />
            <Input
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Camry"
              required
            />
            <Input
              label="Year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="2020"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Condition"
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="tokunbo">Foreign Used (Tokunbo)</option>
              <option value="nigerian">Nigerian Used</option>
            </Select>
            <Input
              label="Mileage (optional)"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              placeholder="68,000 km"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Spec Level"
              name="grade"
              value={form.grade}
              onChange={handleChange}
            >
              <option value="full">Full Option</option>
              <option value="mid">Mid Spec</option>
              <option value="base">Base Spec</option>
            </Select>
            <Select
              label="Body Condition"
              name="body"
              value={form.body}
              onChange={handleChange}
            >
              <option value="first">First Body (Original)</option>
              <option value="touchup">Few Touch-ups</option>
              <option value="repainted">Repainted</option>
              <option value="accident">Accidented</option>
            </Select>
            <Select
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
            >
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Other Cities">Other Cities</option>
            </Select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-70 text-white font-black text-2xl md:text-3xl py-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-4"
          >
            {loading ? (
              <>Calculating with AI...</>
            ) : (
              <>
                GET MY PRICE NOW <ArrowRight size={36} />
              </>
            )}
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl p-10 md:p-16 shadow-3xl">
              <CheckCircle size={80} className="mx-auto mb-6 animate-bounce" />
              <p className="text-3xl md:text-3xl font-black mb-4">
                Your {carName} is worth:
              </p>
              <p className="text-3xl md:text-2xl font-black tracking-tight">
                ₦{result.min.toFixed(1)}M – ₦{result.max.toFixed(1)}M
              </p>
              <p className="text-xl md:text-2xl font-bold opacity-90 mt-4">
                Today’s Nigerian Market Price
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={`https://wa.me/23480022772234?text=I%20just%20valued%20my%20${encodeURIComponent(
                    carName
                  )}%20on%20CarsAbeg!%20Worth%20₦${result.min.toFixed(
                    1
                  )}M%20-%20₦${result.max.toFixed(
                    1
                  )}M%20-%20Can%20you%20buy%20it%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl md:text-3xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition"
                >
                  SELL IT NOW
                </a>
                <a
                  href="/sell"
                  className="bg-white text-green-600 font-black text-2xl md:text-3xl px-12 py-6 rounded-full shadow-2xl hover:bg-gray-100 transition"
                >
                  List for Sale
                </a>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-12 text-center">
            <div className="bg-red-50 border-4 border-red-300 rounded-3xl p-8">
              <AlertCircle size={60} className="mx-auto mb-4 text-red-600" />
              <p className="text-2xl font-black text-red-700">{error}</p>
              <a
                href="https://wa.me/23480022772234"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 bg-red-600 text-white font-black text-xl px-10 py-5 rounded-full"
              >
                Chat Us for Instant Help
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
