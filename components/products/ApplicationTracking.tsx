"use client";

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface ApplicationTrackingProps {
    productId: string;
    productType: string;
    productName?: string;
    articleId?: string | null;
}

/**
 * Application Tracking Component
 * 
 * Tracks application page views and conversions
 * Can be embedded in application pages or modals
 */
export default function ApplicationTracking({
    productId,
    productType,
    productName,
    articleId
}: ApplicationTrackingProps) {
    useEffect(() => {
        // Track page view
        if (typeof window !== 'undefined') {
            // Google Analytics
            if ((window as any).gtag) {
                (window as any).gtag('event', 'application_page_view', {
                    product_id: productId,
                    product_type: productType,
                    product_name: productName,
                    article_id: articleId
                });
            }

            // Log to backend
            logger.info('Application page viewed', {
                productId,
                productType,
                productName,
                articleId,
                path: window.location.pathname
            });
        }
    }, [productId, productType, productName, articleId]);

    return null; // This is a tracking component, no UI
}
