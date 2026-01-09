/**
 * Affiliate Click Tracking API
 * 
 * Records affiliate link clicks for revenue attribution
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackAffiliateClick } from '@/lib/analytics/posthog-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      productName,
      productSlug,
      category,
      sourcePage,
      sourceComponent,
      affiliateLink,
      sessionId,
    } = body;

    if (!productName || !sourcePage) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, sourcePage' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Record in database
    const { data, error } = await supabase.rpc('record_affiliate_click', {
      p_product_name: productName,
      p_product_slug: productSlug || null,
      p_category: category || null,
      p_source_page: sourcePage,
      p_source_component: sourceComponent || 'unknown',
      p_session_id: sessionId || null,
      p_affiliate_link: affiliateLink || null,
    });

    if (error) {
      console.error('[AFFILIATE] Database error:', error);
      // Don't fail - still track in PostHog
    }

    // Also track in PostHog for real-time analytics
    if (typeof trackAffiliateClick === 'function') {
      trackAffiliateClick(productSlug || productName, productName, category || 'unknown');
    }

    return NextResponse.json({
      success: true,
      clickId: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AFFILIATE] Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin analytics
export async function GET(request: NextRequest) {
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
    console.error('[AFFILIATE] Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
