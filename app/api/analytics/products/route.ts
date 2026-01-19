import { NextRequest, NextResponse } from 'next/server';
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

    // Get all products
    let productsQuery = supabase
      .from('products')
      .select('id, name, slug, category, provider_name, is_active');

    if (category) {
      productsQuery = productsQuery.eq('category', category);
    }

    if (productId) {
      productsQuery = productsQuery.eq('id', productId);
    }

    const { data: products, error: productsError } = await productsQuery;

    if (productsError) throw productsError;

    // Get product views (if product_views table exists)
    let views = null;
    try {
      const { data } = await supabase
        .from('product_views')
        .select('product_id, product_slug')
        .gte('viewed_at', startDate.toISOString());
      views = data;
    } catch (error) {
      // Table might not exist, that's okay
    }

    // Get affiliate clicks for products
    let clicks = null;
    try {
      const { data } = await supabase
        .from('affiliate_clicks')
        .select('product_id, product_type, converted, commission_earned')
        .gte('created_at', startDate.toISOString());
      clicks = data;
    } catch (error) {
      // Table might not exist, that's okay
    }

    // Get conversions
    let conversions = null;
    try {
      const { data } = await supabase
        .from('affiliate_clicks')
        .select('product_id, commission_earned')
        .eq('converted', true)
        .gte('conversion_date', startDate.toISOString());
      conversions = data;
    } catch (error) {
      // Table might not exist, that's okay
    }

    // Aggregate stats by product
    const productStatsMap: Record<string, {
      id: string;
      name: string;
      slug: string;
      category: string;
      company: string;
      views: number;
      clicks: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }> = {};

    // Initialize with products
    products?.forEach((product: any) => {
      productStatsMap[product.id] = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        company: product.provider_name || 'Unknown',
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
      };
    });

    // Add views
    views?.forEach((view: any) => {
      const productId = view.product_id;
      if (productStatsMap[productId]) {
        productStatsMap[productId].views++;
      }
    });

    // Add clicks and conversions
    clicks?.forEach((click: any) => {
      const productId = click.product_id;
      if (productStatsMap[productId]) {
        productStatsMap[productId].clicks++;
        if (click.converted) {
          productStatsMap[productId].conversions++;
          productStatsMap[productId].revenue += parseFloat(click.commission_earned || '0');
        }
      }
    });

    // Calculate conversion rates
    Object.values(productStatsMap).forEach((stats) => {
      stats.conversionRate = stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0;
    });

    // Get top products by revenue
    const topProducts = Object.values(productStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    // Category stats
    const categoryStatsMap: Record<string, { views: number; clicks: number; conversions: number; revenue: number }> = {};
    Object.values(productStatsMap).forEach((stats) => {
      if (!categoryStatsMap[stats.category]) {
        categoryStatsMap[stats.category] = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
      }
      categoryStatsMap[stats.category].views += stats.views;
      categoryStatsMap[stats.category].clicks += stats.clicks;
      categoryStatsMap[stats.category].conversions += stats.conversions;
      categoryStatsMap[stats.category].revenue += stats.revenue;
    });

    const categoryStats = Object.entries(categoryStatsMap).map(([category, stats]) => ({
      category,
      ...stats,
    }));

    // Calculate totals
    const totals = {
      views: Object.values(productStatsMap).reduce((sum, p) => sum + p.views, 0),
      clicks: Object.values(productStatsMap).reduce((sum, p) => sum + p.clicks, 0),
      conversions: Object.values(productStatsMap).reduce((sum, p) => sum + p.conversions, 0),
      revenue: Object.values(productStatsMap).reduce((sum, p) => sum + p.revenue, 0),
      productCount: products?.length || 0,
    };

    return NextResponse.json({
      success: true,
      period: { days, startDate: startDate.toISOString() },
      totals,
      topProducts,
      categoryStats,
      products: Object.values(productStatsMap),
    });
  } catch (error: any) {
    console.error('Product analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch product stats',
      details: error.message 
    }, { status: 500 });
  }
}
