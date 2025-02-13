import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  images: {
    // formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_MINIO_HOSTNAME ?? "localhost",
        port: process.env.NEXT_PUBLIC_MINIO_PORT,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
