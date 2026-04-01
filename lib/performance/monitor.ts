import { logger } from '@/lib/logger';
/**
 * Performance Monitoring
 * 
 * Client-side performance monitoring and reporting
 */

export interface PerformanceMetric {
    name: string;
    value: number;
    unit: 'bytes' | 'ms' | 'score';
    timestamp: number;
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(onPerfEntry?: (metric: PerformanceMetric) => void) {
    if (typeof window === 'undefined' || !window.performance) {
        return;
    }

    // Monitor FCP (First Contentful Paint)
    try {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
                onPerfEntry?.({
                    name: 'First Contentful Paint',
                    value: entry.startTime,
                    unit: 'ms',
                    timestamp: Date.now(),
                });
            }
        });
    } catch (e: any) {
        // Ignore errors
    }

    // Monitor LCP (Largest Contentful Paint)
    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            onPerfEntry?.({
                name: 'Largest Contentful Paint',
                value: lastEntry.renderTime || lastEntry.loadTime,
                unit: 'ms',
                timestamp: Date.now(),
            });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e: any) {
        // Ignore errors
    }

    // Monitor CLS (Cumulative Layout Shift)
    try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            onPerfEntry?.({
                name: 'Cumulative Layout Shift',
                value: clsValue,
                unit: 'score',
                timestamp: Date.now(),
            });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e: any) {
        // Ignore errors
    }

    // Monitor TBT (Total Blocking Time) - approximate
    try {
        const observer = new PerformanceObserver((list) => {
            let tbt = 0;
            for (const entry of list.getEntries() as any[]) {
                if (entry.duration > 50) {
                    tbt += entry.duration - 50;
                }
            }
            if (tbt > 0) {
                onPerfEntry?.({
                    name: 'Total Blocking Time',
                    value: tbt,
                    unit: 'ms',
                    timestamp: Date.now(),
                });
            }
        });
        observer.observe({ entryTypes: ['longtask'] });
    } catch (e: any) {
        // Ignore errors
    }
}

/**
 * Get resource sizes
 */
export function getResourceSizes(): Record<string, number> {
    if (typeof window === 'undefined' || !window.performance) {
        return {};
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const sizes: Record<string, number> = {
        script: 0,
        stylesheet: 0,
        image: 0,
        font: 0,
        other: 0,
    };

    resources.forEach((resource) => {
        const size = resource.transferSize || 0;
        const initiatorType = resource.initiatorType || 'other';
        
        if (initiatorType === 'script') {
            sizes.script += size;
        } else if (initiatorType === 'css' || initiatorType === 'link') {
            sizes.stylesheet += size;
        } else if (initiatorType === 'img') {
            sizes.image += size;
        } else if (initiatorType === 'font') {
            sizes.font += size;
        } else {
            sizes.other += size;
        }
    });

    return sizes;
}

/**
 * Report performance metrics to API
 */
export async function reportPerformanceMetrics(metrics: PerformanceMetric[]) {
    try {
        await fetch('/api/performance/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metrics }),
        });
    } catch (error: any) {
        // Ignore errors in reporting
        logger.warn('Failed to report performance metrics', error);
    }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
    if (typeof window === 'undefined') {
        return;
    }

    const metrics: PerformanceMetric[] = [];

    monitorWebVitals((metric) => {
        metrics.push(metric);
        
        // Report metrics periodically (every 10 seconds or on page unload)
        if (metrics.length >= 5) {
            reportPerformanceMetrics([...metrics]);
            metrics.length = 0;
        }
    });

    // Report remaining metrics on page unload
    window.addEventListener('beforeunload', () => {
        if (metrics.length > 0) {
            // Use sendBeacon for reliable reporting on unload
            navigator.sendBeacon?.(
                '/api/performance/metrics',
                JSON.stringify({ metrics })
            );
        }
    });

    // Report resource sizes after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const sizes = getResourceSizes();
            const resourceMetrics: PerformanceMetric[] = Object.entries(sizes).map(([name, value]) => ({
                name: `Resource Size: ${name}`,
                value,
                unit: 'bytes',
                timestamp: Date.now(),
            }));
            
            if (resourceMetrics.length > 0) {
                reportPerformanceMetrics(resourceMetrics);
            }
        }, 2000);
    });
}
