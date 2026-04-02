/**
 * Monetization Tracking System
 * 
 * Tracks clicks, conversions, and source pages
 * WITHOUT affecting rankings or user experience
 */

import { analyticsAPI } from '@/lib/api/client';
import { logger } from '@/lib/logger';

export interface ClickTrackingData {
    productId: string;
    productType?: string;
    articleId?: string;
    sourcePage: string;
    linkPosition: string;
    linkContext?: string;
    userAgent?: string;
    referrer?: string;
}

export interface ConversionTrackingData {
    clickId: string;
    conversionValue?: number;
    commissionEarned?: number;
    conversionType?: 'application' | 'purchase' | 'signup';
}

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(data: ClickTrackingData): Promise<string | null> {
    try {
        const response = await analyticsAPI.trackAffiliateClick(data.productId, data.articleId);

        return (response as any)?.data?.id || null;
    } catch (error) {
        logger.error('Error tracking affiliate click', error as Error, { data });
        return null;
    }
}

/**
 * Track conversion (postback from affiliate network)
 */
export async function trackConversion(data: ConversionTrackingData): Promise<boolean> {
    try {
        await analyticsAPI.track('affiliate_conversion', {
            click_id: data.clickId,
            converted: true,
            conversion_date: new Date().toISOString(),
            commission_earned: data.commissionEarned || 0,
            conversion_type: data.conversionType || 'application',
        });

        return true;
    } catch (error) {
        logger.error('Error tracking conversion', error as Error, { data });
        return false;
    }
}

/**
 * Get monetization analytics (admin only)
 */
export async function getMonetizationAnalytics(filters?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
    sourcePage?: string;
}): Promise<any> {
    try {
        // This would typically be an admin-only endpoint
        // For now, return aggregated data
        // Fetch clicks via analytics API
        const response = await analyticsAPI.track('get_monetization_analytics', {
            ...filters,
        });

        const clicks: any[] = (response as any)?.data || [];

        const totalClicks = clicks.length;
        const conversions = clicks.filter((c: any) => c.converted).length;
        const totalCommission = clicks.reduce((sum: number, c: any) =>
            sum + (c.commission_earned || 0), 0
        );

        // Group by source page
        const bySourcePage = clicks.reduce((acc: any, click: any) => {
            const page = click.source_page || 'unknown';
            acc[page] = (acc[page] || 0) + 1;
            return acc;
        }, {});

        // Group by product
        const byProduct = clicks.reduce((acc: any, click: any) => {
            const product = click.product_id || 'unknown';
            acc[product] = (acc[product] || 0) + 1;
            return acc;
        }, {});

        return {
            totalClicks,
            conversions,
            conversionRate: totalClicks > 0 ? (conversions / totalClicks) * 100 : 0,
            totalCommission,
            bySourcePage,
            byProduct,
        };
    } catch (error) {
        logger.error('Error getting monetization analytics', error as Error, { filters });
        return null;
    }
}

