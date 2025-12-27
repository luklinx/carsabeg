"use client";

import Image from "next/image";
import { Phone, MessageCircle, Star, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  dealerName?: string;
  dealerPhone?: string;
  dealerAdsCount?: number;
  dealerRating?: { average: number; total: number };
  isVerified?: boolean;
  isLoggedIn?: boolean;
  make?: string;
  model?: string;
  carId?: string;
  // optional seller profile object from users table
  sellerProfile?: {
    id: string;
    full_name?: string | null;
    profile_photo_url?: string | null;
    created_at?: string | null;
  } | null;
  sellerListingsCount?: number;
}

export default function SellerCard({
  dealerName,
  dealerPhone,
  dealerAdsCount = 0,
  dealerRating = { average: 0, total: 0 },
  isVerified = false,
  isLoggedIn = false,
  make = "",
  model = "",
  carId = "",
  sellerProfile,
  sellerListingsCount,
}: Props) {
  const cleanPhone = (p?: string) =>
    p ? p.replace(/\D/g, "").replace(/^0/, "234") : "";

  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  function openWhatsAppChat() {
    const phone = cleanPhone(dealerPhone) || "";
    const text = encodeURIComponent(
      `Hi, I'm interested in your ${make} ${model}`
    );
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, "_blank");
  }

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!msg.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/seller-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car_id: carId, message: msg }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setSent(true);
        setMsg("");
        setTimeout(() => setSent(false), 3000);
      } else {
        console.error("seller-messages failed", res.status, json);
        setError(
          (json as { error?: string })?.error || "Failed to send message."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      id="contact-seller"
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg md:sticky md:top-24"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-50 shadow-sm relative">
            {sellerProfile?.profile_photo_url ? (
              <Image
                src={sellerProfile.profile_photo_url}
                alt={sellerProfile.full_name || dealerName || "Seller"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-xl font-black text-gray-700">
                  {(sellerProfile?.full_name ||
                    dealerName ||
                    "U")[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-700 uppercase">Seller</p>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 truncate flex items-center gap-2">
              <a
                href={
                  sellerProfile?.id
                    ? `/seller/${sellerProfile.id}`
                    : `/inventory?dealer=${encodeURIComponent(
                        dealerName || ""
                      )}`
                }
                className="hover:underline"
              >
                {sellerProfile?.full_name || dealerName || "Cars Abeg Dealer"}
              </a>
              {isVerified && (
                <span
                  title="Verified seller"
                  className="inline-flex items-center text-green-600"
                >
                  <CheckCircle size={16} />
                </span>
              )}
            </h3>
            <div className="text-sm text-gray-600 mt-1">
              <a
                href={`tel:${dealerPhone || "#"}`}
                className="font-black text-gray-900"
              >
                {dealerPhone || "Not provided"}
              </a>
              <div className="text-sm text-gray-600">
                Active listings:{" "}
                <a
                  href={
                    sellerProfile?.id
                      ? `/seller/${sellerProfile.id}`
                      : `/inventory?dealer=${encodeURIComponent(
                          dealerName || ""
                        )}`
                  }
                  className="font-black text-green-600 hover:underline inline-flex items-center gap-2"
                >
                  {typeof sellerListingsCount === "number"
                    ? sellerListingsCount
                    : dealerAdsCount}
                  {typeof dealerRating?.average === "number" && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      <Star size={12} className="text-amber-500" />
                      <span className="font-bold">
                        {dealerRating.average.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({dealerRating.total})
                      </span>
                    </span>
                  )}
                </a>
              </div>
              {sellerProfile?.created_at && (
                <div className="text-xs text-gray-600 mt-1">
                  Joined{" "}
                  {(() => {
                    // Use UTC-based formatting to avoid server/client timezone differences
                    const d = new Date(sellerProfile.created_at as string);
                    const months = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={openWhatsAppChat}
          className="w-half inline-flex items-center justify-center gap- bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-black text-lg"
        >
          <MessageCircle size={18} /> Chat
        </button>

        <a
          href={`tel:${dealerPhone || "#"}`}
          className="w-half inline-flex items-center justify-center gap-2 bg-white border border-gray-600 text-black ml-4 px-4 py-3 rounded-lg font-bold"
        >
          <Phone size={16} /> Call
        </a>

        {isLoggedIn && (
          <form onSubmit={handleSendMessage} className="mt-2">
            <label className="text-xs text-gray-600">Send Message</label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-200 rounded-lg resize-none"
              rows={3}
              placeholder="Write a message to the seller"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                disabled={sending}
              >
                {sending ? "Sending..." : sent ? "Sent" : "Send"}
              </button>
              <span className="text-sm text-gray-600">
                {sent ? "Message sent" : error ? error : ""}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
