import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "demo.example.com",
      },
      {
        protocol: "https",
        hostname: "tutor.example.com",
      },
    ],
  },
};

export default nextConfig;
