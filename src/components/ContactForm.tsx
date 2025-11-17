// src/components/ContactForm.tsx
"use client"; // This makes it a Client Component

import { useState } from "react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    // WhatsApp redirect
    const whatsappUrl = `https://wa.me/2348123456789?text=Name: ${encodeURIComponent(
      name
    )}%0APhone: ${encodeURIComponent(phone)}%0AMessage: ${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-600"
        disabled={isSubmitting}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        required
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-600"
        disabled={isSubmitting}
      />
      <textarea
        name="message"
        placeholder="Message"
        rows={5}
        required
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-600"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send via WhatsApp"}
      </button>
    </form>
  );
}
