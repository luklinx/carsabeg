// src/components/WhatsAppButton.tsx
import { Car } from "@/types";
import { MessageCircle, PhoneCall, Zap } from "lucide-react";

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

  const whatsappUrl = `https://wa.me/2349018837909?text=${encodeURIComponent(
    message
  )}`;

  // Size variants
  const sizes = {
    default: "px-8 py-5 text-lg",
    large: "px-12 py-7 text-2xl font-black",
    full: "w-full py-8 text-3xl font-black justify-center",
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500
        hover:shadow-green-600/50 hover:scale-105 active:scale-95
        ${size === "full" ? "block" : "inline-flex"} items-center gap-4
        bg-gradient-to-r from-green-600 to-emerald-600 text-white
        ${sizes[size]}
      `}
    >
      {/* Animated Background Pulse */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      {/* Icon + Text */}
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <MessageCircle
            size={size === "full" ? 48 : size === "large" ? 40 : 32}
            className="drop-shadow-lg animate-pulse"
          />
          <Zap
            size={size === "full" ? 24 : 18}
            className="absolute -top-1 -right-1 text-yellow-400 animate-ping"
          />
        </div>

        <div className="text-left">
          <div className="font-black tracking-tight">
            {size === "full" ? "CHAT NOW ON WHATSAPP" : "Inquire on WhatsApp"}
          </div>
          {size !== "full" && (
            <div className="text-sm opacity-90 font-bold">
              Reply in less than 2 mins
            </div>
          )}
        </div>
      </div>

      {/* Floating Badge */}
      {size !== "full" && (
        <span className="absolute -top-3 -right-3 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-black shadow-lg animate-bounce">
          FASTEST RESPONSE
        </span>
      )}
    </a>
  );
}
