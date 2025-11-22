// src/components/InquiryForm.tsx
"use client";
import { useState } from "react";
import { Car } from "@/types";

interface Props {
  car: Car;
  onClose: () => void;
}

export default function InquiryForm({ car, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `New Inquiry for ${car.year} ${car.make} ${car.model}:\nName: ${name}\nPhone: ${phone}\nBudget: ₦${budget}`;
    window.open(
      `https://wa.me/2348123456789?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold">Inquire About {car.model}</h3>
      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-3 border rounded"
      />
      <input
        placeholder="Your Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full p-3 border rounded"
      />
      <input
        placeholder="Your Budget (₦)"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="w-full p-3 border rounded"
      />
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded"
        >
          Send Inquiry
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-300 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
