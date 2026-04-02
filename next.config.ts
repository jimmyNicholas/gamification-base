import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    /** Required in Next 16+ for `next/image` local src with query strings (e.g. cache bust `?v=`). Omit `search` to allow any query or none. */
    localPatterns: [
      {
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
