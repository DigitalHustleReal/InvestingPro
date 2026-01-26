"use client";

import { useEffect } from 'react';

/**
 * Performance optimization hook for tracking Web Vitals
 * Helps monitor Core Web Vitals (LCP, FID, CLS) for homepage performance
 */
export function useWebVitals() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
            
            // Log LCP for analytics
            if (lastEntry) {
                const lcp = lastEntry.renderTime || lastEntry.loadTime;
                // Send to analytics (replace with your analytics service)
                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'LCP',
                        value: Math.round(lcp),
                    });
                }
            }
        });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
                const fid = entry.processingStart - entry.startTime;
                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'web_vitals', {
                        event_category: 'Web Vitals',
                        event_label: 'FID',
                        value: Math.round(fid),
                    });
                }
            });
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // Performance Observer not supported
        }

        return () => {
            lcpObserver.disconnect();
            fidObserver.disconnect();
        };
    }, []);
}

/**
 * Conversion tracking hook
 * Tracks user interactions for conversion optimization
 */
export function useConversionTracking() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Track section visibility for engagement metrics
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5, // Trigger when 50% visible
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.getAttribute('data-section-name');
                    if (sectionName) {
                        // Track section view
                        if (typeof window.gtag !== 'undefined') {
                            window.gtag('event', 'section_view', {
                                event_category: 'Engagement',
                                event_label: sectionName,
                            });
                        }
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('[data-section-name]');
        sections.forEach((section) => sectionObserver.observe(section));

        return () => {
            sectionObserver.disconnect();
        };
    }, []);
}

/**
 * Accessibility improvements hook
 * Adds keyboard navigation and focus management
 */
export function useAccessibility() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Skip to main content link (for screen readers)
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        return () => {
            skipLink.remove();
        };
    }, []);
}

// Extend Window interface for gtag
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
