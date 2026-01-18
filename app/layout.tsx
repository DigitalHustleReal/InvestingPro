import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import Analytics from "@/components/common/Analytics";
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


// Font configurations with CSS variables
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
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
// Tracing is disabled - file exists as .disabled
// import { initializeTracing } from "@/lib/tracing/opentelemetry";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={cn(
        inter.variable,
        serif.variable,
        mono.variable,
        inter.className,
        "min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300"
      )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
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

                  <Navbar initialConfig={navConfig} />
                  <main id="main-content" className="flex-grow" tabIndex={-1}>
                    <PageErrorBoundary pageName="Root Layout">
                      <ConditionalPublicElements>
                        {children}
                      </ConditionalPublicElements>
                    </PageErrorBoundary>
                  </main>
                  <CompareBar />
                  
                  {/* 
                     AUTOMATED AFFILIATE SCRIPT (Cuelinks / Skimlinks)
                     Uncomment and add your ID here to auto-monetize 1000s of links
                  */}
                  {/* <script async src="https://cuelinks.com/js/..." /> */}
                  <Toaster />
                </NavigationProvider>
              </CompareProvider>
            </SearchProvider>
          </QueryProvider>
        </ErrorBoundaryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}