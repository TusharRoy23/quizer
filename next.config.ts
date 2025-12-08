import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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
    localPatterns: [
      { pathname: "/images/**" }
    ]
  },
  output: "standalone",
  env: {
    HOSTNAME: '0.0.0.0'
  },
};

export default nextConfig;
