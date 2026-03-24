"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Suppresses the rate ticker on admin routes.
 * The actual RateTickerServer is passed as children (server component).
 */
export default function ConditionalRateTicker({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;
    return <>{children}</>;
}
