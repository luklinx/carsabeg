// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─────────────────────────────────────────────────────────────
  // IMAGES — Supabase storage (already perfect)
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
  // EXPERIMENTAL — THE GOLDEN COMBO FOR 2025
  // ─────────────────────────────────────────────────────────────
  experimental: {
    // Kills fake Turbopack source map errors in dev
    turbopack: false,

    // Fixes Suspense/CSR bailout issues with dynamic routes
    missingSuspenseWithCSRBailout: false,

    // Optional: Faster font loading (recommended)
    optimizeFonts: true,
  },

  // ─────────────────────────────────────────────────────────────
  // HEADERS — NO CACHING ON CAR DETAILS (CRITICAL!)
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

  // ─────────────────────────────────────────────────────────────
  // OPTIONAL BUT RECOMMENDED — FOR PRODUCTION
  // ─────────────────────────────────────────────────────────────
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
};

export default nextConfig;
