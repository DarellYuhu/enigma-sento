import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make Konva & react-konva work
    return config;
  },
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
