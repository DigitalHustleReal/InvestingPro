"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";

/**
 * Conditional Public Elements Wrapper
 *
 * Only renders public page elements (not admin)
 * - Footer
 *
 * Note: Popups (ExitIntent, CookieConsent, LeadCapture) are managed
 * in layout.tsx to prevent duplicates. Do NOT add popups here.
 */
export function ConditionalPublicElements({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  if (isAdminPage) {
    // Admin pages: No trust/email capture elements
    return <>{children}</>;
  }

  // Public pages: children + footer only (popups live in layout.tsx)
  return (
    <>
      {children}
      <PageErrorBoundary pageName="Footer">
        <Footer />
      </PageErrorBoundary>
    </>
  );
}
