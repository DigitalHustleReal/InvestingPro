/**
 * Analytics Tracking Service
 * Lightweight event tracking for product views, comparisons, and conversions
 */

interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
    timestamp?: string;
}

class AnalyticsService {
    private enabled: boolean = true;
    private queue: AnalyticsEvent[] = [];

    /**
     * Track page view
     */
    trackPageView(page: string, properties?: Record<string, any>) {
        this.track('page_view', {
            page,
            ...properties
        });
    }

    /**
     * Track product view
     */
    trackProductView(productId: string, category: string, name: string) {
        this.track('product_view', {
            product_id: productId,
            category,
            product_name: name
        });
    }

    /**
     * Track product comparison
     */
    trackComparison(productIds: string[], category: string) {
        this.track('comparison_started', {
            product_ids: productIds,
            category,
            product_count: productIds.length
        });
    }

    /**
     * Track affiliate click
     */
    trackAffiliateClick(productId: string, category: string, provider: string) {
        this.track('affiliate_click', {
            product_id: productId,
            category,
            provider
        });
    }

    /**
     * Track search
     */
    trackSearch(query: string, resultsCount: number) {
        this.track('search', {
            query,
            results_count: resultsCount
        });
    }

    /**
     * Track filter usage
     */
    trackFilter(filterType: string, filterValue: string, category: string) {
        this.track('filter_applied', {
            filter_type: filterType,
            filter_value: filterValue,
            category
        });
    }

    /**
     * Track calculator usage
     */
    trackCalculator(calculatorType: string, inputs: Record<string, any>) {
        this.track('calculator_used', {
            calculator_type: calculatorType,
            ...inputs
        });
    }

    /**
     * Generic event tracker
     */
    private track(event: string, properties?: Record<string, any>) {
        if (!this.enabled) return;

        const analyticsEvent: AnalyticsEvent = {
            event,
            properties,
            timestamp: new Date().toISOString()
        };

        // Add to queue
        this.queue.push(analyticsEvent);

        // Send to analytics endpoint
        this.sendToAnalytics(analyticsEvent);

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            logger.info('[Analytics]', event, properties);
        }
    }

    /**
     * Send event to analytics backend
     */
    private async sendToAnalytics(event: AnalyticsEvent) {
        try {
            // Send to your analytics endpoint
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
        } catch (error) {
            // Silently fail - don't break UX for analytics
            logger.error('Analytics error:', error);
        }
    }

    /**
     * Flush queued events
     */
    flush() {
        // Implementation for batch sending
        this.queue = [];
    }

    /**
     * Get analytics stats (for admin dashboard)
     */
    async getStats(period: 'today' | 'week' | 'month' = 'today') {
        const response = await fetch(`/api/analytics/stats?period=${period}`);
        return response.json();
    }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Auto-track page views in Next.js
if (typeof window !== 'undefined') {
    // Track initial page load
    analytics.trackPageView(window.location.pathname);

    // Track route changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
        originalPushState.apply(window.history, args);
        analytics.trackPageView(window.location.pathname);
    };
}
