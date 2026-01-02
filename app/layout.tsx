import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import Analytics from "@/components/common/Analytics";
import CookieConsent from "@/components/common/CookieConsent";
import QueryProvider from "@/components/providers/QueryProvider";
import ErrorBoundaryProvider from "@/components/providers/ErrorBoundaryProvider";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { getNavigation } from "@/lib/navigation/service";
import InfiniteTicker from "@/components/market/InfiniteTicker";
import { SearchProvider } from "@/components/search/SearchProvider";
import { CompareProvider } from "@/components/products/CompareContext";
import CompareFloatingBar from "@/components/products/CompareFloatingBar";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch navigation on the server
  const navConfig = await getNavigation();

  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        serif.variable,
        mono.variable,
        inter.className,
        "min-h-screen flex flex-col bg-gray-50"
      )}>
        <ErrorBoundaryProvider>
          <QueryProvider>
            <SearchProvider>
              <CompareProvider>
                <Suspense fallback={null}>
                  <Analytics />
                </Suspense>
                <InfiniteTicker />
                <Navbar initialConfig={navConfig} />
                <main className="flex-grow">
                  <PageErrorBoundary pageName="Root Layout">
                    {children}
                  </PageErrorBoundary>
                </main>
                <CompareFloatingBar />
                
                {/* 
                   AUTOMATED AFFILIATE SCRIPT (Cuelinks / Skimlinks)
                   Uncomment and add your ID here to auto-monetize 1000s of links
                */}
                {/* <script async src="https://cuelinks.com/js/..." /> */}
                <Footer />
                <CookieConsent />
                <Toaster />
              </CompareProvider>
            </SearchProvider>
          </QueryProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  );
}
