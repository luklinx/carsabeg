/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gwoweovqllfzznmidskz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/car_images/**",
      },
    ],
  },
};

export default nextConfig;
