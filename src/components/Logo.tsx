// src/components/Logo.tsx
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface LogoProps {
  className?: string;
  showFire?: boolean; // Optional: pulse fire when new car drops
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional: path to a logo image in `public/` (e.g. `/logo.png`) */
  logoSrc?: string;
  /** Optional alt text for the image */
  alt?: string;
}

const sizeMap = {
  sm: "w-48 h-16",
  md: "w-64 h-20",
  lg: "w-96 h-28",
  xl: "w-[500px] h-36",
};

export default function Logo({
  className,
  showFire = false,
  size = "lg",
  logoSrc,
  alt,
}: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeMap[size],
        className
      )}
    >
      {/* If you want to use a static image instead of the SVG, pass `logoSrc="/logo.png"` to this component. */}
      {/* If `logoSrc` is provided render the image from `public/`, otherwise fall back to the SVG */}
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={alt ?? "Cars Abeg"}
          className="max-w-full h-auto object-contain"
        />
      ) : (
        <svg
          viewBox="0 0 800 200"
          className="w-full h-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="greenGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#1B4332" />
              <stop offset="100%" stopColor="#2D6A4F" />
            </linearGradient>
            {/* Subtle glow for premium feel */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* MAIN TEXT */}
          <g id="main-text">
            <text
              x="80"
              y="115"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="72"
              fontWeight="900"
              fill="#1B4332"
              letterSpacing="-2"
              className="tracking-tighter"
            >
              CARS
            </text>
            <text
              x="430"
              y="115"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="72"
              fontWeight="900"
              fill="#1B4332"
              letterSpacing="-2"
              className="tracking-tighter"
            >
              ABEG
            </text>
          </g>

          {/* THICK GREEN UNDERLINE */}
          <rect
            x="60"
            y="130"
            width="525"
            height="6"
            fill="url(#greenGradient)"
            rx="3"
            filter="url(#glow)"
          />

          {/* SUBTLE ACCENT LINE */}
          <rect
            x="60"
            y="142"
            width="200"
            height="3"
            fill="#2D6A4F"
            opacity="0.6"
            rx="1.5"
          />

          {/* NIGERIAN FLAG — PROUD & ELEGANT */}
          <g transform="translate(640, 100)">
            <rect x="0" y="0" width="12" height="40" fill="#008751" />
            <rect x="12" y="0" width="12" height="40" fill="#FFFFFF" />
            <rect x="24" y="0" width="12" height="40" fill="#E41E3F" />
            <rect
              x="0"
              y="0"
              width="36"
              height="40"
              fill="none"
              stroke="#1B4332"
              strokeWidth="1.2"
              opacity="0.5"
            />
          </g>

          {/* ACCENT DOT */}
          <circle cx="615" cy="105" r="4" fill="#2D6A4F" />

          {/* SUBTLE GEOMETRIC LINE */}
          <line
            x1="60"
            y1="160"
            x2="140"
            y2="160"
            stroke="#1B4332"
            strokeWidth="2"
            opacity="0.4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* OPTIONAL: FIRE ANIMATION WHEN NEW CAR DROPS */}
      {showFire && (
        <div className="absolute -top-8 -right-8 animate-ping">
          <Flame size={48} className="text-orange-500 drop-shadow-lg" />
        </div>
      )}
      {showFire && (
        <div className="absolute -top-8 -right-8 animate-pulse">
          <Flame size={48} className="text-red-600 drop-shadow-2xl" />
        </div>
      )}
    </div>
  );
}
