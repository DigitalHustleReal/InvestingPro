import { DM_Sans, DM_Mono } from "next/font/google";
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
import CookieConsent from "@/components/legal/CookieConsent";

// Font configurations — v2 Design System (DM Sans + DM Mono + Georgia system)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

// Georgia is a system font — no import needed, declared in CSS

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
export const metadata: Metadata = {
  metadataBase: new URL("https://investingpro.in"),
  title: {
    default: "InvestingPro - Smart Financial Decisions Made Simple",
    template: "%s | InvestingPro",
  },
  description:
    "Compare credit cards, loans, mutual funds, and government schemes. Get AI-powered recommendations and expert reviews to make smarter financial decisions.",
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
  verification: {
    google: "frJEpYhU206CZdHR23QlUvVr-4SFZbllQlQ2bQ_h0Uc",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://investingpro.in",
    siteName: "InvestingPro",
    title: "InvestingPro - Smart Financial Decisions Made Simple",
    description:
      "Compare credit cards, loans, mutual funds, and more. Get AI-powered recommendations and expert reviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestingPro - Smart Financial Decisions Made Simple",
    description:
      "Compare credit cards, loans, mutual funds, and more. Get AI-powered recommendations and expert reviews.",
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
          href="https://investingpro.in/feed.xml"
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          dmSans.className,
          dmSans.variable,
          dmMono.variable,
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
              url: "https://investingpro.in",
              logo: "https://investingpro.in/logo.png",
              description:
                "India's free personal finance comparison platform. Compare credit cards, mutual funds, loans, and use 75+ financial calculators.",
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
                      {/* Cuelinks — auto-monetizes outbound links to bank/AMC/insurer sites */}
                      <script
                        async
                        src="https://cdn.cuelinks.com/cuelinks-sdk.js"
                        data-publisher-id="244238"
                      />
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
