import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  basePath: "/valueble.ai",
  assetPrefix: "/valueble.ai/",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;