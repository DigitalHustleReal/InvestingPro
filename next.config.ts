import type { NextConfig } from "next";

/**
 * MINIMAL config for first Vercel deploy. Restore full config (headers, redirects, bundle analyzer) after deploy succeeds.
 * Next.js 16 defaults to Turbopack; we use custom webpack (isomorphic-dompurify alias), so build must run with: next build --webpack
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Satisfy Next 16 when webpack is used via --webpack flag (avoids Turbopack/webpack conflict message)
  turbopack: {},
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "isomorphic-dompurify": require.resolve("isomorphic-dompurify"),
    };
    return config;
  },
};

export default nextConfig;
