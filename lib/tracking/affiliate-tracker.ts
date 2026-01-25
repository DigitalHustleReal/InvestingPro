/**
 * Affiliate Click Tracker
 * 
 * Tracks affiliate link clicks for revenue attribution.
 * Logs to affiliate_clicks table in Supabase.
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';

export interface AffiliateClickData {
    // Product info
    productId?: string;
    productSlug?: string;
    productName: string;
    category?: string;
    providerName?: string;
    
    // Source info
    sourcePage: string;
    sourceUrl?: string;
    sourceComponent?: string; // 'product_card', 'comparison_table', 'article_cta', 'sidebar'
    articleId?: string;
    
    // User info (optional)
    userId?: string;
    sessionId?: string;
    
    // Affiliate details
    affiliateLink?: string;
    affiliateNetwork?: string; // 'direct', 'cuelinks', 'vcommission', 'admitad'
    
    // UTM params
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
}

/**
 * Generate a simple session ID for anonymous tracking
 */
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('affiliate_session_id');
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('affiliate_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Extract UTM parameters from URL
 */
function getUtmParams(): { 
    utmSource?: string; 
    utmMedium?: string; 
    utmCampaign?: string; 
    utmContent?: string; 
} {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    return {
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        utmContent: params.get('utm_content') || undefined,
    };
}

/**
 * Track an affiliate click
 * 
 * @param data - Click data to track
 * @returns Click ID if successful, null if failed
 */
export async function trackAffiliateClick(data: AffiliateClickData): Promise<string | null> {
    try {
        const supabase = createClient();
        const utmParams = getUtmParams();
        
        const clickData = {
            product_id: data.productId || null,
            product_slug: data.productSlug || null,
            product_name: data.productName,
            category: data.category || null,
            provider_name: data.providerName || null,
            
            source_page: data.sourcePage,
            source_url: data.sourceUrl || (typeof window !== 'undefined' ? window.location.href : null),
            source_component: data.sourceComponent || null,
            article_id: data.articleId || null,
            
            session_id: data.sessionId || getSessionId(),
            user_id: data.userId || null,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            
            affiliate_link: data.affiliateLink || null,
            affiliate_network: data.affiliateNetwork || 'direct',
            
            utm_source: data.utmSource || utmParams.utmSource || null,
            utm_medium: data.utmMedium || utmParams.utmMedium || null,
            utm_campaign: data.utmCampaign || utmParams.utmCampaign || null,
            utm_content: data.utmContent || utmParams.utmContent || null,
            
            conversion_status: 'pending',
        };
        
        const { data: result, error } = await supabase
            .from('affiliate_clicks')
            .insert(clickData)
            .select('id')
            .single();
        
        if (error) {
            logger.error('Failed to track affiliate click', error);
            return null;
        }
        
        logger.debug('Affiliate click tracked', { clickId: result.id, product: data.productName });
        return result.id;
        
    } catch (error) {
        logger.error('Error tracking affiliate click', error instanceof Error ? error : new Error(String(error)));
        return null;
    }
}

/**
 * Track click and redirect to affiliate link
 * Use this for immediate redirect after tracking
 */
export async function trackAndRedirect(
    data: AffiliateClickData,
    targetUrl: string
): Promise<void> {
    // Fire and forget - don't wait for tracking
    trackAffiliateClick({
        ...data,
        affiliateLink: targetUrl,
    }).catch(() => {
        // Ignore errors - don't block redirect
    });
    
    // Redirect immediately
    if (typeof window !== 'undefined') {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
}

/**
 * Get click statistics for a product
 */
export async function getProductClickStats(productId: string): Promise<{
    totalClicks: number;
    conversions: number;
    conversionRate: number;
} | null> {
    try {
        const supabase = createClient();
        
        const [clicksRes, conversionsRes] = await Promise.all([
            supabase
                .from('affiliate_clicks')
                .select('id', { count: 'exact', head: true })
                .eq('product_id', productId),
            supabase
                .from('affiliate_clicks')
                .select('id', { count: 'exact', head: true })
                .eq('product_id', productId)
                .eq('conversion_status', 'converted'),
        ]);
        
        const totalClicks = clicksRes.count || 0;
        const conversions = conversionsRes.count || 0;
        
        return {
            totalClicks,
            conversions,
            conversionRate: totalClicks > 0 ? Math.round((conversions / totalClicks) * 100 * 10) / 10 : 0,
        };
        
    } catch (error) {
        logger.error('Error getting product click stats', error instanceof Error ? error : new Error(String(error)));
        return null;
    }
}

/**
 * Get click statistics for a time period
 */
export async function getClicksOverview(days: number = 7): Promise<{
    totalClicks: number;
    uniqueSessions: number;
    topProducts: { name: string; clicks: number }[];
    topSources: { source: string; clicks: number }[];
} | null> {
    try {
        const supabase = createClient();
        const since = new Date();
        since.setDate(since.getDate() - days);
        
        const { data, error } = await supabase
            .from('affiliate_clicks')
            .select('id, product_name, source_page, session_id')
            .gte('created_at', since.toISOString());
        
        if (error) throw error;
        if (!data) return null;
        
        // Calculate stats
        const uniqueSessions = new Set(data.map(d => d.session_id)).size;
        
        // Top products
        const productCounts: Record<string, number> = {};
        data.forEach(d => {
            productCounts[d.product_name] = (productCounts[d.product_name] || 0) + 1;
        });
        const topProducts = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, clicks]) => ({ name, clicks }));
        
        // Top sources
        const sourceCounts: Record<string, number> = {};
        data.forEach(d => {
            sourceCounts[d.source_page] = (sourceCounts[d.source_page] || 0) + 1;
        });
        const topSources = Object.entries(sourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([source, clicks]) => ({ source, clicks }));
        
        return {
            totalClicks: data.length,
            uniqueSessions,
            topProducts,
            topSources,
        };
        
    } catch (error) {
        logger.error('Error getting clicks overview', error instanceof Error ? error : new Error(String(error)));
        return null;
    }
}
