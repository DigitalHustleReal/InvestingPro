import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get view counts by product
    const viewsQuery = supabase
      .from('product_views')
      .select('product_slug, product_id')
      .gte('viewed_at', startDate.toISOString());

    if (category) {
      // Would need to join with products table for category filtering
    }

    const { data: views, error: viewsError } = await viewsQuery;

    // Get click counts from affiliate_clicks
    const { data: clicks, error: clicksError } = await supabase
      .from('affiliate_clicks')
      .select('slug, product_id')
      .gte('clicked_at', startDate.toISOString());

    // Get conversion data
    const { data: conversions, error: convError } = await supabase
      .from('affiliate_conversions')
      .select('product_slug, commission')
      .gte('converted_at', startDate.toISOString());

    // Aggregate by product
    const productStats: Record<string, {
      views: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }> = {};

    views?.forEach(v => {
      const key = v.product_slug;
      if (!productStats[key]) productStats[key] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      productStats[key].views++;
    });

    clicks?.forEach(c => {
      const key = c.slug;
      if (!productStats[key]) productStats[key] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      productStats[key].clicks++;
    });

    conversions?.forEach(c => {
      const key = c.product_slug;
      if (!productStats[key]) productStats[key] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      productStats[key].conversions++;
      productStats[key].revenue += parseFloat(c.commission) || 0;
    });

    // Calculate totals
    const totals = {
      totalViews: Object.values(productStats).reduce((sum, p) => sum + p.views, 0),
      totalClicks: Object.values(productStats).reduce((sum, p) => sum + p.clicks, 0),
      totalConversions: Object.values(productStats).reduce((sum, p) => sum + p.conversions, 0),
      totalRevenue: Object.values(productStats).reduce((sum, p) => sum + p.revenue, 0)
    };

    // Top products by views
    const topProducts = Object.entries(productStats)
      .map(([slug, stats]) => ({
        slug,
        ...stats,
        ctr: stats.views > 0 ? ((stats.clicks / stats.views) * 100).toFixed(2) : 0,
        conversionRate: stats.clicks > 0 ? ((stats.conversions / stats.clicks) * 100).toFixed(2) : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);

    return NextResponse.json({
      success: true,
      period: { days, startDate: startDate.toISOString() },
      totals,
      topProducts,
      avgCTR: totals.totalViews > 0 ? ((totals.totalClicks / totals.totalViews) * 100).toFixed(2) : 0
    });
  } catch (error) {
    logger.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
