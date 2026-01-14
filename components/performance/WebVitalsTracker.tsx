"use client";

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/performance/web-vitals';

/**
 * Web Vitals Tracker Component
 * Initializes Core Web Vitals tracking on client-side
 */
export default function WebVitalsTracker() {
    useEffect(() => {
        // Initialize Web Vitals tracking
        initWebVitals();
    }, []);

    // This component doesn't render anything
    return null;
}
