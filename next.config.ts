import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_MINIO_HOSTNAME ?? "",
        port: process.env.NEXT_PUBLIC_MINIO_PORT,
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
