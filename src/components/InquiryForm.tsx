// src/components/InquiryForm.tsx
"use client";

import { useState } from "react";
import { Car } from "@/types";
import { MessageCircle, Phone, X, Send } from "lucide-react";
import { formatLocation } from "@/lib/utils";

interface Props {
  car: Car;
  onClose: () => void;
}

export default function InquiryForm({ car, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const carName = `${car.year} ${car.make} ${car.model}`.trim();
    const priceText = car.price
      ? `₦${(car.price / 1_000_000).toFixed(1)}M`
      : "Price on request";

    const message = `NEW INQUIRY - CARS ABEG

  Car: ${carName}
  Price: ${priceText}
  Location: ${formatLocation(car.state, car.city, car.location)}

  Buyer Details:
  • Name: ${name || "Not provided"}
  • Phone: ${phone}
  • Budget: ₦${budget || "Not specified"}

  Please call this buyer ASAP!`;

    const whatsappUrl = `https://wa.me/2349018837909?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    // Success feedback
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <MessageCircle size={40} />
            <div>
              <h2 className="text-3xl font-black">I&apos;m Interested!</h2>
              <p className="text-lg opacity-90">Chat directly with seller</p>
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="px-6 pt-6 pb-4 bg-gray-50 border-b">
          <h3 className="text-2xl font-black text-gray-900">
            {car.year} {car.make} {car.model}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-black text-green-600">
              ₦{(car.price / 1_000_000).toFixed(1)}M
            </span>
            <span className="text-lg text-gray-600">
              • {formatLocation(car.state, car.city, car.location)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ahmed Yusuf"
              required
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:ring-4 focus:ring-green-100 transition outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Phone Number (WhatsApp)
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                size={24}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08012345678"
                required
                className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:ring-4 focus:ring-green-100 transition outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">
              Your Budget (Optional)
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 8500000"
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl text-lg focus:border-green-600 focus:ring-4 focus:ring-green-100 transition outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-black text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-105 transition-all duration-300"
            >
              {isSending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send size={28} />
                  Send via WhatsApp
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-5 border-2 border-gray-300 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

          {/* Trust */}
          <p className="text-center text-sm text-gray-600 font-medium mt-6">
            Your info is private • Seller contacts you directly • We reply in
            minutes
          </p>
        </form>
      </div>
    </div>
  );
}
