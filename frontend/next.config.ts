import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep standalone for SSR support
  output: 'standalone',

  // Native MongoDB driver must not be bundled for server routes (fixes broken MongoClient/.db() in prod)
  serverExternalPackages: ["mongodb"],

  async redirects() {
    return [
      {
        source: "/staff-dashboard/order",
        destination: "/staff-dashboard/inventory",
        permanent: true,
      },
    ];
  },

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Ensure trailing slashes are handled correctly
  trailingSlash: false,

  // Image optimization settings
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
