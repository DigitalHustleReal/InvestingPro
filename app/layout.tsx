import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"] });

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
      <body className={cn(inter.className, "min-h-screen flex flex-col bg-gray-50")}>
        <ErrorBoundaryProvider>
          <QueryProvider>
            <SearchProvider>
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
              <Footer />
              <CookieConsent />
              <Toaster />
            </SearchProvider>
          </QueryProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  );
}
