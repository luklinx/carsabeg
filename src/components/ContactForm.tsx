// src/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, phone, message } = formData;

    const text = `Hello CARS ABEG!%0A%0A*Name:* ${encodeURIComponent(
      name
    )}%0A*Phone:* ${encodeURIComponent(
      phone
    )}%0A%0A*Message:* %0A${encodeURIComponent(message)}%0A%0AThanks!`;

    const whatsappUrl = `https://wa.me/2348123456789?text=${text}`;

    // Open WhatsApp instantly
    window.open(whatsappUrl, "_blank");

    // Reset form
    setFormData({ name: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-8 py-4 rounded-full font-black text-lg mb-6">
          <MessageCircle size={28} />
          Chat With Us on WhatsApp
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900">
          Got Questions? We&apos;re Here 24/7
        </h2>
        <p className="text-xl text-gray-600 mt-4">
          Send us a message — we reply in under 5 minutes
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-bold text-gray-800 mb-3"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Chinedu Okonkwo"
            className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-lg font-bold text-gray-800 mb-3"
          >
            Phone Number (WhatsApp)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="e.g. 08012345678"
            className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-lg font-bold text-gray-800 mb-3"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Hi, I want to list my car / I saw a car I like / I need help..."
            className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button — Dubizzle Level */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-6 rounded-2xl font-black text-2xl md:text-3xl shadow-2xl flex items-center justify-center gap-4 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={32} />
              Opening WhatsApp...
            </>
          ) : (
            <>
              <Send size={32} />
              Send Message via WhatsApp
            </>
          )}
        </button>

        {/* Trust Badge */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm font-medium">
            We reply in{" "}
            <span className="text-green-600 font-black">under 5 minutes</span> •
            24/7 Support
          </p>
        </div>
      </form>
    </div>
  );
}
