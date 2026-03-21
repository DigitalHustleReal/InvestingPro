import { Inter, Outfit, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import ConditionalTopBar from "@/components/layout/ConditionalTopBar";
import AdminShell from "@/components/layout/AdminShell";
import { cn } from "@/lib/utils";
import Analytics from "@/components/common/Analytics";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics"; // Import GA
import CookieConsent from "@/components/legal/CookieConsent";
import QueryProvider from "@/components/providers/QueryProvider";
import ErrorBoundaryProvider from "@/components/providers/ErrorBoundaryProvider";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { getNavigation } from "@/lib/navigation/service";
import { SearchProvider } from "@/components/search/SearchProvider";
import { CompareProvider } from "@/contexts/CompareContext";
import CompareBar from "@/components/compare/CompareBar";
import PerformanceMonitor from "@/components/performance/PerformanceMonitor";
import { ConditionalPublicElements } from "@/components/common/ConditionalPublicElements";
import { ConditionalPublicFloating } from "@/components/common/ConditionalPublicFloating";
import ExitIntentPopup from "@/components/common/ExitIntentPopup";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import OnboardingTrigger from "@/components/profile/OnboardingTrigger";


// Font configurations with CSS variables
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
});

// ... existing code ...

import { ThemeProvider } from "@/components/theme-provider";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { initializeEventSystem } from "@/lib/events/setup";
import { initializeLogging } from "@/lib/logging/initialize";
import { validateEnvOnStartup } from "@/lib/env";
import type { Metadata } from 'next';
// Tracing is disabled - file exists as .disabled
// import { initializeTracing } from "@/lib/tracing/opentelemetry";

// Global metadata for the application
export const metadata: Metadata = {
  metadataBase: new URL('https://investingpro.in'),
  title: {
    default: 'InvestingPro - Smart Financial Decisions Made Simple',
    template: '%s | InvestingPro'
  },
  description: 'Compare credit cards, loans, mutual funds, and government schemes. Get AI-powered recommendations and expert reviews to make smarter financial decisions.',
  keywords: ['personal finance', 'credit cards', 'loans', 'mutual funds', 'investment', 'India', 'financial planning', 'government schemes'],
  authors: [{ name: 'InvestingPro Team' }],
  creator: 'InvestingPro',
  publisher: 'InvestingPro',
  verification: {
    google: 'frJEpYhU206CZdHR23QlUvVr-4SFZbllQlQ2bQ_h0Uc',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://investingpro.in',
    siteName: 'InvestingPro',
    title: 'InvestingPro - Smart Financial Decisions Made Simple',
    description: 'Compare credit cards, loans, mutual funds, and more. Get AI-powered recommendations and expert reviews.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestingPro - Smart Financial Decisions Made Simple',
    description: 'Compare credit cards, loans, mutual funds, and more. Get AI-powered recommendations and expert reviews.',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#0f172a',
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
  
  // Fetch navigation on the server
  const navConfig = await getNavigation();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body suppressHydrationWarning className={cn(
        inter.className,
        inter.variable,
        outfit.variable,
        serif.variable,
        mono.variable,
        "min-h-screen flex flex-col bg-slate-950 text-slate-50 antialiased selection:bg-cyan-500/30 selection:text-cyan-50"
      )}>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
        <ErrorBoundaryProvider>
          <QueryProvider>
            <SearchProvider>
              <CompareProvider>
                <NavigationProvider>
                  <Suspense fallback={null}>
                    <Analytics />
                    {/* <PerformanceMonitor /> */}
                  </Suspense>

                  {/* Skip to Content Link - Accessibility (UI/UX Phase 1) */}
                  <a 
                    href="#main-content" 
                    className="skip-to-content"
                  >
                    Skip to main content
                  </a>

                  <AdminShell>
                    <ConditionalTopBar initialConfig={navConfig} />
                    <main id="main-content" className="flex-grow" tabIndex={-1}>
                      <PageErrorBoundary pageName="Root Layout">
                        <ConditionalPublicElements>
                          {children}
                        </ConditionalPublicElements>
                      </PageErrorBoundary>
                    </main>
                  </AdminShell>
                  <ConditionalPublicFloating>
                    <CompareBar />
                    <WhatsAppButton />
                  </ConditionalPublicFloating>
                  {/* 
                     AUTOMATED AFFILIATE SCRIPT (Cuelinks / Skimlinks)
                     Uncomment and add your ID here to auto-monetize 1000s of links
                  */}
                  {/* <script async src="https://cuelinks.com/js/..." /> */}
                  <Toaster />
                  <ExitIntentPopup variant="wizard" />
                  <OnboardingTrigger />
                </NavigationProvider>
              </CompareProvider>
            </SearchProvider>
          </QueryProvider>
        </ErrorBoundaryProvider>
        </ThemeProvider>
        <CookieConsent />
        {/* Tawk.to Live Chat - Externalized for stability */}
        {process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID !== 'undefined' && (
          <Script id="tawk-to" strategy="afterInteractive">
            {`
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/default';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}