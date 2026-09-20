import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdf-parse'],
  webpack: (config) => {
    config.externals.push('pdf-parse');
    return config;
  },
  outputFileTracingRoot: path.join(__dirname, "./"),
};

export default nextConfig;
