import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arslanwholesale.alwaysdata.net",
      },
    ],
  },
};

export default nextConfig;
