"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import CookieConsent from '@/components/legal/CookieConsent';
import ExitIntentPopup from '@/components/common/ExitIntentPopup';
import { LeadCaptureProvider } from '@/components/engagement/LeadCaptureProvider';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';

/**
 * Conditional Public Elements Wrapper
 * 
 * Only renders trust/email capture elements on public pages (not admin)
 * - Footer (contains "Zero BS" trust banner)
 * - Newsletter ("Master the Market" email capture)
 * - Exit Intent Popup
 * - Lead Capture Provider
 */
export function ConditionalPublicElements({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin') ?? false;

    if (isAdminPage) {
        // Admin pages: No trust/email capture elements
        return <>{children}</>;
    }

    // Public pages: Include all trust/email capture elements
    return (
        <LeadCaptureProvider>
            {children}
            <PageErrorBoundary pageName="Footer">
                <Footer />
            </PageErrorBoundary>
            <CookieConsent />
            <ExitIntentPopup />
        </LeadCaptureProvider>
    );
}
