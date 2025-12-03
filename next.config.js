// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─────────────────────────────────────────────────────────────
  // IMAGES — Supabase (keep this)
  // ─────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gwoweovqllfzznmidskz.supabase.co",
        pathname: "/storage/v1/object/public/car_images/**",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // THESE ARE NOW TOP-LEVEL (NO LONGER IN experimental)
  // ─────────────────────────────────────────────────────────────
  swcMinify: true, // ← moved out
  optimizeFonts: true, // ← moved out

  // ─────────────────────────────────────────────────────────────
  // TURBOPACK — you cannot disable it anymore in 16.0.3
  // It is now default and permanent in dev
  // The fake source-map error is a known Turbopack bug → will be fixed soon
  // Just ignore it or downgrade to Next.js 15 if it annoys you
  // ─────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────
  // HEADERS — NO CACHING ON CAR PAGES (still 100% valid)
  // ─────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/car/:id*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/inventory",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
