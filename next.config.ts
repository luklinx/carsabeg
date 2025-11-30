/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gwoweovqllfzznmidskz.supabase.co",
        pathname: "/storage/v1/object/public/car_images/**",
      },
    ],
  },

  // THIS LINE IS THE MISSING KEY FOR UUID ROUTES
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  // AND THIS ONE TOO — FORCES REVALIDATION
  async headers() {
    return [
      {
        source: "/car/:id*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
