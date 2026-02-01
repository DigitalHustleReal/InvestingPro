import type { NextConfig } from "next";

/**
 * MINIMAL config for first Vercel deploy. Restore full config (headers, redirects, bundle analyzer) after deploy succeeds.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'isomorphic-dompurify': require.resolve('isomorphic-dompurify'),
    };
    return config;
  },
};

export default nextConfig;
