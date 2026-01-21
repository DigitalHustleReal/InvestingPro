/**
 * Affiliate Click Tracking API
 * 
 * Records affiliate link clicks for revenue attribution
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackAffiliateClick } from '@/lib/analytics/posthog-service';
import { createAPIWrapper } from '@/lib/middleware/api-wrapper';
import { withValidation } from '@/lib/middleware/validation';
import { affiliateTrackSchema } from '@/lib/validation/schemas';
import { affiliateService } from '@/lib/services/affiliate/affiliate.service';
import { logger } from '@/lib/logger';

export const POST = createAPIWrapper('/api/affiliate/track', {
    rateLimitType: 'public',
    trackMetrics: true,
})(
    withValidation(affiliateTrackSchema, undefined)(
        async (request: NextRequest, body: any, _query: unknown) => {
            try {
                // Body is already validated by middleware
                const {
                    productName,
                    productSlug,
                    category,
                    sourcePage,
                    sourceComponent,
                    affiliateLink,
                    sessionId,
                } = body;

                // Track click using service
                const result = await affiliateService.trackClick({
                    productName,
                    productSlug,
                    category,
                    sourcePage,
                    sourceComponent,
                    affiliateLink,
                    sessionId
                });

                // Also track in PostHog for real-time analytics
                if (typeof trackAffiliateClick === 'function') {
                    trackAffiliateClick(productSlug || productName, productName, category || 'unknown');
                }

                return NextResponse.json({
                    success: true,
                    ...result
                });
            } catch (error) {
                logger.error('Affiliate tracking error', error instanceof Error ? error : new Error(String(error)));
                throw error; // Let API wrapper handle error response
            }
        }
)
);

// GET endpoint for admin analytics
export const GET = createAPIWrapper('/api/affiliate/track', {
    rateLimitType: 'authenticated',
    trackMetrics: true,
})(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const supabase = await createClient();

    // Get revenue summary
    const { data: summary, error: summaryError } = await supabase
      .rpc('get_revenue_summary', { days_back: days });

    if (summaryError) {
      throw summaryError;
    }

    // Get top products
    const { data: topProducts, error: productsError } = await supabase
      .from('affiliate_top_products')
      .select('*')
      .limit(10);

    // Get daily breakdown
    const { data: dailyData, error: dailyError } = await supabase
      .from('affiliate_clicks_daily')
      .select('*')
      .limit(days);

    return NextResponse.json({
      success: true,
      period: `last ${days} days`,
      summary: summary?.[0] || {},
      topProducts: topProducts || [],
      dailyBreakdown: dailyData || [],
    });
  } catch (error) {
    logger.error('Affiliate analytics error', error instanceof Error ? error : new Error(String(error)));
    throw error; // Let API wrapper handle error response
  }
});
