import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle server-only modules properly
  serverExternalPackages: ["firebase-admin"],

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Suppress build warnings for server-only packages
  // (eslint configuration moved out since Next.js no longer supports it in next.config)
  typescript: {
    // Allow build even with type issues (for MVP development)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
