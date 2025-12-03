// src/components/WhatsAppButton.tsx
import { Car } from "@/types";
import { MessageCircle, Zap } from "lucide-react";

interface Props {
  car: Car;
  size?: "default" | "large" | "full";
}

export default function WhatsAppButton({ car, size = "default" }: Props) {
  const carName = `${car.year} ${car.make} ${car.model}`.trim();
  const priceText = car.price
    ? `₦${(car.price / 1_000_000).toFixed(1)}M`
    : "Price on request";

  const message = `HELLO CARS ABEG!
I'm VERY interested in your:
${carName}
Price: ${priceText}
Location: ${car.location || "Not specified"}
Condition: ${car.condition}
Is this car still available?
Can you send more photos/video?
When can I come and inspect?
Thank you!`;

  const whatsappUrl = `https://wa.me/23480022772234?text=${encodeURIComponent(
    message
  )}`;

  // 50% SLIMMER SIZES — NEW 2025 STANDARD
  const sizes = {
    default: "px-5 py-3 text-base", // was px-8 py-5 text-lg
    large: "px-8 py-4 text-xl font-bold", // was px-12 py-7 text-2xl
    full: "w-full py-5 text-xl font-bold justify-center", // was py-8 text-3xl
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300
        hover:shadow-green-500/50 hover:scale-105 active:scale-95
        ${size === "full" ? "block" : "inline-flex"} items-center gap-3
        bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold
        ${sizes[size]}
      `}
    >
      {/* Subtle pulse */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

      <div className="relative flex items-center gap-3">
        {/* Icon — 50% smaller but still proud */}
        <div className="relative">
          <MessageCircle
            size={size === "full" ? 36 : size === "large" ? 32 : 26} // was 48/40/32
            className="drop-shadow-md"
          />
          <Zap
            size={size === "full" ? 18 : 14} // was 24/18
            className="absolute -top-1 -right-1 text-yellow-400 animate-ping"
          />
        </div>

        {/* Text */}
        <div>
          <div className="tracking-tight leading-tight">
            {size === "full"
              ? "CHAT ON WHATSAPP"
              : size === "large"
              ? "Chat Now"
              : "WhatsApp"}
          </div>
          {size === "default" && (
            <div className="text-xs opacity-90">Fast reply</div>
          )}
        </div>
      </div>

      {/* Badge — only on small/medium */}
      {size !== "full" && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[10px] font-black shadow-md animate-bounce">
          FAST
        </span>
      )}
    </a>
  );
}
