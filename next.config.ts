import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "developers.google.com",
        port: "",
        pathname: "/identity/images/g-logo.png",
      },
    ],
  },
  output: "standalone",
  env: {
    HOSTNAME: '0.0.0.0'
  },
};

export default nextConfig;
