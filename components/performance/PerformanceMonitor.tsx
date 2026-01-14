'use client';

/**
 * Performance Monitor Component
 * 
 * Client-side component that initializes performance monitoring
 */

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance/monitor';

export default function PerformanceMonitor() {
    useEffect(() => {
        // Initialize performance monitoring on client side
        initPerformanceMonitoring();
    }, []);

    // This component doesn't render anything
    return null;
}
