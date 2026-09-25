import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.wasi.co", pathname: "/**" },
      { protocol: "https", hostname: "images.wasi.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
