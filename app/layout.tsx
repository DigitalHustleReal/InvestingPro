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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestingPro - India's Best Financial Comparison Platform",
  description: "Compare credit cards, loans, mutual funds, and more. Make smart financial decisions with InvestingPro India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen flex flex-col bg-gray-50")}>
        <ErrorBoundaryProvider>
          <QueryProvider>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            <Navbar />
            <main className="flex-grow">
              <PageErrorBoundary pageName="Root Layout">
                {children}
              </PageErrorBoundary>
            </main>
            <Footer />
            <CookieConsent />
            <Toaster />
          </QueryProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  );
}
