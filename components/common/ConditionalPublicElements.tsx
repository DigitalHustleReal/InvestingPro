"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import TrustRail from "@/components/v2/layout/TrustRail";
import PageErrorBoundary from "@/components/common/PageErrorBoundary";

/**
 * Conditional Public Elements Wrapper
 *
 * Only renders public page elements (not admin)
 * - TrustRail (above footer on every public page)
 * - Footer
 */
export function ConditionalPublicElements({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin") ?? false;

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <PageErrorBoundary pageName="TrustRail">
        <TrustRail />
      </PageErrorBoundary>
      <PageErrorBoundary pageName="Footer">
        <Footer />
      </PageErrorBoundary>
    </>
  );
}
