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
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "investingpro.in" },
      { protocol: "https", hostname: "www.investingpro.in" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "isomorphic-dompurify": require.resolve("isomorphic-dompurify"),
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/article/:slug",
        destination: "/articles/:slug",
        permanent: true,
      },
      // Defensive 301s for legacy /tools/* paths that some external links may
      // still reference. The Hero CTAs themselves now point to /calculators/*
      // directly. These redirects only kick in if someone shares an old URL.
      {
        source: "/tools/regime-calculator",
        destination: "/calculators/old-vs-new-tax",
        permanent: true,
      },
      {
        source: "/tools/retirement-calculator",
        destination: "/calculators/retirement",
        permanent: true,
      },
      {
        source: "/tools/nps-calculator",
        destination: "/calculators/nps",
        permanent: true,
      },
      {
        source: "/tools/emergency-fund",
        destination: "/calculators/financial-health-score",
        permanent: true,
      },
      {
        source: "/tools/credit-card-finder",
        destination: "/credit-cards/find-your-card",
        permanent: true,
      },
    ];
  },
  // Best-Practices: HSTS + COOP + XFO + a few sane defaults.
  // CSP intentionally omitted for now — needs careful 3rd-party audit
  // (GTM + PostHog + Tawk + Cuelinks/EarnKaro) to avoid breaking analytics.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
