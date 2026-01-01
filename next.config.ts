import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production-ready configuration
  reactStrictMode: true,
  images: {
    unoptimized: false, // Enable image optimization for production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // Redirects for canonicalization and removed routes
  async redirects() {
    // Temporarily disabled legacy redirects to fix startup
    // const { getLegacySubcategoryRedirects } = await import('./lib/navigation/legacy-migration');
    // const legacyRedirects = getLegacySubcategoryRedirects();
    
    return [
      // Alpha terminal → terminal (canonical route)
      {
        source: '/alpha-terminal',
        destination: '/terminal',
        permanent: true,
      },
      // Orphaned routes → appropriate destinations
      {
        source: '/test-preview',
        destination: '/',
        permanent: false,
      },
      {
        source: '/submit-article',
        destination: '/',
        permanent: false,
      },
      {
        source: '/guides/how-sip-works',
        destination: '/calculators/sip',
        permanent: false,
      },
      {
        source: '/savings-hub',
        destination: '/banking',
        permanent: false,
      },
      {
        source: '/savings-hub/:path*',
        destination: '/banking',
        permanent: false,
      },
      // Legacy subcategory routes → new intent-based routes
      // ...legacyRedirects,
    ];
  },
};

export default nextConfig;
