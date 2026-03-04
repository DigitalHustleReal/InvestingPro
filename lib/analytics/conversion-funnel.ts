/**
 * Conversion Funnel Tracker
 * Tracks user journey through the conversion funnel:
 * Homepage → Product Page → Article → Click → Application → Conversion
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface FunnelStage {
    stage: string;
    count: number;
    dropOff: number;
    dropOffPercentage: number;
}

export interface ConversionFunnel {
    stages: FunnelStage[];
    overallConversionRate: number;
    period: {
        startDate: string;
        endDate: string;
    };
}

export interface FunnelMetrics {
    homepage: number;
    productPage: number;
    articlePage: number;
    affiliateClick: number;
    application: number;
    conversion: number;
}

/**
 * Get conversion funnel metrics for a date range
 */
export async function getConversionFunnel(
    startDate: string,
    endDate: string
): Promise<ConversionFunnel> {
    try {
        // Stage 1: Homepage visits (from analytics_events or use page views)
        // Note: This would require analytics_events table with page_view events
        // For now, we'll estimate based on article views + product page views
        
        // Stage 2: Product page visits (views of credit_cards, mutual_funds pages)
        // This would require tracking product page views
        
        // Stage 3: Article page visits (article views)
        const { data: articleViews } = await supabase
            .from('articles')
            .select('views')
            .gte('published_date', startDate)
            .lte('published_date', endDate);

        const totalArticleViews = articleViews?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

        // Stage 4: Affiliate clicks
        const { data: affiliateClicks } = await supabase
            .from('affiliate_clicks')
            .select('id')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const totalClicks = affiliateClicks?.length || 0;

        // Stage 5: Applications (currently same as clicks, would need form submission tracking)
        // For now, we'll use clicks as proxy for applications
        const applications = totalClicks;

        // Stage 6: Conversions
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('id')
            .eq('converted', true)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        const totalConversions = conversions?.length || 0;

        // Build funnel stages
        const stages: FunnelStage[] = [
            {
                stage: 'Homepage',
                count: totalArticleViews * 2, // Estimate: 2x article views = homepage visits
                dropOff: 0,
                dropOffPercentage: 0
            },
            {
                stage: 'Product Page',
                count: totalArticleViews * 1.5, // Estimate: 1.5x article views = product page visits
                dropOff: (totalArticleViews * 2) - (totalArticleViews * 1.5),
                dropOffPercentage: 25
            },
            {
                stage: 'Article Page',
                count: totalArticleViews,
                dropOff: totalArticleViews * 0.5,
                dropOffPercentage: 33
            },
            {
                stage: 'Affiliate Click',
                count: totalClicks,
                dropOff: totalArticleViews - totalClicks,
                dropOffPercentage: totalArticleViews > 0 ? ((totalArticleViews - totalClicks) / totalArticleViews) * 100 : 0
            },
            {
                stage: 'Application',
                count: applications,
                dropOff: totalClicks - applications,
                dropOffPercentage: totalClicks > 0 ? ((totalClicks - applications) / totalClicks) * 100 : 0
            },
            {
                stage: 'Conversion',
                count: totalConversions,
                dropOff: applications - totalConversions,
                dropOffPercentage: applications > 0 ? ((applications - totalConversions) / applications) * 100 : 0
            }
        ];

        // Calculate overall conversion rate (conversions / homepage visits)
        const homepageVisits = stages[0].count;
        const overallConversionRate = homepageVisits > 0 ? (totalConversions / homepageVisits) * 100 : 0;

        return {
            stages,
            overallConversionRate: Number(overallConversionRate.toFixed(2)),
            period: {
                startDate,
                endDate
            }
        };

    } catch (error) {
        logger.error('Error calculating conversion funnel:', error);
        throw error;
    }
}

/**
 * Get conversion funnel metrics by category
 */
export async function getConversionFunnelByCategory(
    category: string,
    startDate: string,
    endDate: string
): Promise<ConversionFunnel> {
    // Filter clicks by category/product_type
    const categoryPatterns: Record<string, string[]> = {
        'credit-cards': ['credit_card', 'creditcard'],
        'mutual-funds': ['mutual_fund', 'mutualfund', 'stock_broker'],
        'insurance': ['insurance'],
        'all': []
    };

    const patterns = categoryPatterns[category] || categoryPatterns['all'];

    // Get category-specific clicks
    const { data: categoryClicks } = await supabase
        .from('affiliate_clicks')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    let filteredClicks = categoryClicks || [];
    if (category !== 'all' && patterns.length > 0) {
        filteredClicks = filteredClicks.filter(click => {
            const productType = click.product_type?.toLowerCase() || '';
            return patterns.some(pattern => productType.includes(pattern));
        });
    }

    const totalClicks = filteredClicks.length;
    const totalConversions = filteredClicks.filter(click => click.converted).length;

    // Get category-specific article views
    const { data: categoryArticles } = await supabase
        .from('articles')
        .select('views, category')
        .eq('category', category)
        .gte('published_date', startDate)
        .lte('published_date', endDate);

    const totalArticleViews = categoryArticles?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

    // Build funnel stages
    const stages: FunnelStage[] = [
        {
            stage: 'Homepage',
            count: totalArticleViews * 2,
            dropOff: 0,
            dropOffPercentage: 0
        },
        {
            stage: 'Product Page',
            count: totalArticleViews * 1.5,
            dropOff: totalArticleViews * 0.5,
            dropOffPercentage: 25
        },
        {
            stage: 'Article Page',
            count: totalArticleViews,
            dropOff: totalArticleViews * 0.5,
            dropOffPercentage: 33
        },
        {
            stage: 'Affiliate Click',
            count: totalClicks,
            dropOff: totalArticleViews - totalClicks,
            dropOffPercentage: totalArticleViews > 0 ? ((totalArticleViews - totalClicks) / totalArticleViews) * 100 : 0
        },
        {
            stage: 'Application',
            count: totalClicks,
            dropOff: 0,
            dropOffPercentage: 0
        },
        {
            stage: 'Conversion',
            count: totalConversions,
            dropOff: totalClicks - totalConversions,
            dropOffPercentage: totalClicks > 0 ? ((totalClicks - totalConversions) / totalClicks) * 100 : 0
        }
    ];

    const homepageVisits = stages[0].count;
    const overallConversionRate = homepageVisits > 0 ? (totalConversions / homepageVisits) * 100 : 0;

    return {
        stages,
        overallConversionRate: Number(overallConversionRate.toFixed(2)),
        period: {
            startDate,
            endDate
        }
    };
}
