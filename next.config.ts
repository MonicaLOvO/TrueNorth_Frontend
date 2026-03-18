import type { NextConfig } from "next";

const backendApiBaseUrl =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;