import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import ConditionalTopBarV2 from "@/components/v2/layout/ConditionalTopBar";
// Old: import ConditionalTopBar from "@/components/layout/ConditionalTopBar";
import MobileNav from "@/components/v2/layout/MobileNav";
// Old: import BottomMobileNav from "@/components/layout/BottomMobileNav";
import AdminShell from "@/components/layout/AdminShell";
import { cn } from "@/lib/utils";
import Analytics from "@/components/common/Analytics";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics"; // Import GA
import { PostHogProvider } from "@/lib/analytics/posthog-service";
import QueryProvider from "@/components/providers/QueryProvider";
import ErrorBoundaryProvider from "@/components/providers/ErrorBoundaryProvider";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { getNavigation } from "@/lib/navigation/service";
import { SearchProvider } from "@/components/search/SearchProvider";
import { CompareProvider } from "@/contexts/CompareContext";
import CompareBar from "@/components/compare/CompareBar";
import PerformanceMonitor from "@/components/performance/PerformanceMonitor";
import SentryInit from "@/components/monitoring/SentryInit";
import { ConditionalPublicElements } from "@/components/common/ConditionalPublicElements";
import { ConditionalPublicFloating } from "@/components/common/ConditionalPublicFloating";
import CookieConsent from "@/components/common/CookieConsent";
import ThirdPartyScripts from "@/components/monetization/ThirdPartyScripts";

// Font configurations — v3 Design System (Playfair Display + Inter + JetBrains Mono)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ... existing code ...

import { ThemeProvider } from "@/components/theme-provider";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { initializeEventSystem } from "@/lib/events/setup";
import { initializeLogging } from "@/lib/logging/initialize";
import { validateEnvOnStartup } from "@/lib/env";
import type { Metadata } from "next";
// Tracing is disabled - file exists as .disabled
// import { initializeTracing } from "@/lib/tracing/opentelemetry";

// Global metadata for the application
const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.investingpro.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "InvestingPro — Money, Decoded.",
    template: "%s | InvestingPro",
  },
  description:
    "Money, Decoded. Compare credit cards, mutual funds, loans, and use 72 free calculators. Independent ratings, transparent methodology — for India.",
  keywords: [
    "personal finance",
    "credit cards",
    "loans",
    "mutual funds",
    "investment",
    "India",
    "financial planning",
    "government schemes",
  ],
  authors: [{ name: "InvestingPro Team" }],
  creator: "InvestingPro",
  publisher: "InvestingPro",
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#D97706" }],
  },
  verification: {
    google: "frJEpYhU206CZdHR23QlUvVr-4SFZbllQlQ2bQ_h0Uc",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "InvestingPro",
    title: "InvestingPro — Money, Decoded.",
    description:
      "Money, Decoded. Independent ratings on credit cards, mutual funds, loans + 72 calculators. Transparent methodology, zero paid placements.",
    images: [
      {
        url: "/brand/wordmark-light-1024.png",
        width: 1024,
        height: 256,
        alt: "InvestingPro — Money, Decoded.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestingPro — Money, Decoded.",
    description:
      "Money, Decoded. Independent ratings + 72 calculators. Transparent methodology, zero paid placements.",
    images: ["/brand/wordmark-light-1024.png"],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#166534" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1F14" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Validate environment variables first (fails fast on missing required vars)
  validateEnvOnStartup();

  // Initialize logging (runs once per server instance)
  initializeLogging();

  // Initialize tracing (runs once per server instance)
  // Tracing is disabled - uncomment when needed
  // initializeTracing();

  // Initialize event system (runs once per server instance)
  initializeEventSystem();

  // Navigation is now handled by v2 Navbar component directly
  // const navConfig = await getNavigation();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="InvestingPro — Finance News & Guides"
          href="https://www.investingpro.in/feed.xml"
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          inter.className,
          inter.variable,
          playfair.variable,
          jetbrains.variable,
          "min-h-screen flex flex-col bg-background text-foreground antialiased",
        )}
      >
        {/* Organization JSON-LD — site-wide structured data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "InvestingPro",
              url: "https://www.investingpro.in",
              logo: "https://www.investingpro.in/brand/wordmark-light-1024.png",
              description:
                "Money, Decoded. India's transparent personal finance comparison platform — credit cards, mutual funds, loans, and 72 free calculators.",
              sameAs: [],
              email: "contact@investingpro.in",
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@investingpro.in",
                contactType: "customer support",
                availableLanguage: ["English", "Hindi"],
              },
            }),
          }}
        />
        <GoogleAnalytics
          GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PostHogProvider>
            <ErrorBoundaryProvider>
              <QueryProvider>
                <SearchProvider>
                  <CompareProvider>
                    <NavigationProvider>
                      <Suspense fallback={null}>
                        <Analytics />
                        <SentryInit />
                        {/* <PerformanceMonitor /> */}
                      </Suspense>

                      {/* Skip to Content Link - Accessibility (UI/UX Phase 1) */}
                      <a href="#main-content" className="skip-to-content">
                        Skip to main content
                      </a>

                      <AdminShell>
                        <ConditionalTopBarV2 />
                        <main
                          id="main-content"
                          className="flex-grow pb-20 md:pb-0"
                          tabIndex={-1}
                        >
                          <PageErrorBoundary pageName="Root Layout">
                            <ConditionalPublicElements>
                              {children}
                            </ConditionalPublicElements>
                          </PageErrorBoundary>
                        </main>
                      </AdminShell>
                      <ConditionalPublicFloating>
                        <CompareBar />
                        <MobileNav />
                      </ConditionalPublicFloating>
                      {/* Affiliate & ad scripts — lazy-loaded, page-aware */}
                      <ThirdPartyScripts />
                      <Toaster />
                    </NavigationProvider>
                  </CompareProvider>
                </SearchProvider>
              </QueryProvider>
            </ErrorBoundaryProvider>
          </PostHogProvider>
        </ThemeProvider>
        {/* Legal-only: Cookie consent (Accept/Decline bar). All other popups removed —
             ExitIntentPopup, WhatsAppButton, Tawk.to, OnboardingTrigger, LeadCapture.
             Audit: popups are friction. ProfileOnboarding available as opt-in on /profile. */}
        <CookieConsent />
      </body>
    </html>
  );
}
