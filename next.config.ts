import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_MINIO_HOSTNAME ?? "",
        port: process.env.NEXT_PUBLIC_MINIO_PORT,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
