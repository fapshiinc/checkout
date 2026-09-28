import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: "/preview",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' http://localhost:8080 http://127.0.0.1:8080 https://dashboard.fapshi.com https://*.fapshi.com",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "live.fapshi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sandbox.fapshi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.fapshi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "production1-dot-api-fapshi.uc.r.appspot.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
