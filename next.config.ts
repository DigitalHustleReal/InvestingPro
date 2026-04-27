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
  // Security headers — HSTS + CSP + COOP + XFO + permissions.
  // CSP allowlist covers all known third-parties (GTM, GA4, PostHog, Tawk,
  // Cuelinks, EarnKaro, Razorpay, Sentry, Supabase, Google Fonts).
  // 'unsafe-inline' + 'unsafe-eval' kept on script-src for Next.js inline
  // hydration scripts + analytics SDKs that eval string code (PostHog,
  // GTM dataLayer). Tighten with strict-dynamic + nonces in a future pass.
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://www.googletagmanager.com " +
        "https://www.google-analytics.com " +
        "https://*.posthog.com " +
        "https://cdn.cuelinks.com " +
        "https://ekaro.in " +
        "https://embed.tawk.to https://*.tawk.to " +
        "https://checkout.razorpay.com https://api.razorpay.com",
      "style-src 'self' 'unsafe-inline' " +
        "https://fonts.googleapis.com " +
        "https://embed.tawk.to",
      "font-src 'self' data: " +
        "https://fonts.gstatic.com " +
        "https://embed.tawk.to",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob:",
      "connect-src 'self' " +
        "https://*.supabase.co wss://*.supabase.co " +
        "https://*.posthog.com " +
        "https://www.google-analytics.com " +
        "https://www.googletagmanager.com " +
        "https://*.sentry.io https://*.ingest.sentry.io " +
        "https://embed.tawk.to wss://*.tawk.to " +
        "https://api.razorpay.com https://lumberjack.razorpay.com " +
        "https://www.investingpro.in",
      "frame-src 'self' " +
        "https://embed.tawk.to " +
        "https://api.razorpay.com https://checkout.razorpay.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.razorpay.com",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspDirectives },
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
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
