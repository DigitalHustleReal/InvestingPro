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
    const brandId = searchParams.get('brandId');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get products grouped by company/brand
    const productsQuery = supabase
      .from('products')
      .select('id, name, provider_name, category, is_active');

    if (brandId) {
      // If you have a brands table, join here
      // For now, filter by provider_name
    }

    const { data: products, error: productsError } = await productsQuery;

    if (productsError) throw productsError;

    // Get affiliate clicks for products
    const { data: clicks } = await supabase
      .from('affiliate_clicks')
      .select('product_id, converted, commission_earned')
      .gte('created_at', startDate.toISOString())
      .catch(() => ({ data: null }));

    // Get product views
    const { data: views } = await supabase
      .from('product_views')
      .select('product_id')
      .gte('viewed_at', startDate.toISOString())
      .catch(() => ({ data: null }));

    // Aggregate by brand/company
    const brandStatsMap: Record<string, {
      name: string;
      products: number;
      views: number;
      clicks: number;
      conversions: number;
      revenue: number;
      activePromotions: number;
      impressions: number;
    }> = {};

    // Initialize brands from products
    products?.forEach((product: any) => {
      const brandName = product.provider_name || 'Unknown Brand';
      if (!brandStatsMap[brandName]) {
        brandStatsMap[brandName] = {
          name: brandName,
          products: 0,
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          activePromotions: 0,
          impressions: 0,
        };
      }
      brandStatsMap[brandName].products++;
      if (product.is_active) {
        brandStatsMap[brandName].activePromotions++;
      }
    });

    // Aggregate views
    views?.forEach((view: any) => {
      // Find product to get brand
      const product = products?.find((p: any) => p.id === view.product_id);
      if (product && brandStatsMap[product.provider_name]) {
        brandStatsMap[product.provider_name].views++;
        brandStatsMap[product.provider_name].impressions++;
      }
    });

    // Aggregate clicks and conversions
    clicks?.forEach((click: any) => {
      const product = products?.find((p: any) => p.id === click.product_id);
      if (product && brandStatsMap[product.provider_name]) {
        brandStatsMap[product.provider_name].clicks++;
        if (click.converted) {
          brandStatsMap[product.provider_name].conversions++;
          brandStatsMap[product.provider_name].revenue += parseFloat(click.commission_earned || '0');
        }
      }
    });

    // Get top brands
    const topBrands = Object.values(brandStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20)
      .map((brand, idx) => ({
        id: `brand-${idx}`,
        ...brand,
      }));

    // Get active promotions (products with active status)
    const promotions = products
      ?.filter((p: any) => p.is_active)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        brand: p.provider_name,
        category: p.category,
        status: 'active',
      })) || [];

    // Calculate totals
    const totals = {
      brands: Object.keys(brandStatsMap).length,
      products: products?.length || 0,
      activePromotions: promotions.length,
      views: Object.values(brandStatsMap).reduce((sum, b) => sum + b.views, 0),
      clicks: Object.values(brandStatsMap).reduce((sum, b) => sum + b.clicks, 0),
      conversions: Object.values(brandStatsMap).reduce((sum, b) => sum + b.conversions, 0),
      revenue: Object.values(brandStatsMap).reduce((sum, b) => sum + b.revenue, 0),
      impressions: Object.values(brandStatsMap).reduce((sum, b) => sum + b.impressions, 0),
    };

    return NextResponse.json({
      success: true,
      period: { days, startDate: startDate.toISOString() },
      totals,
      topBrands,
      promotions,
      brands: Object.values(brandStatsMap),
    });
  } catch (error: any) {
    console.error('Brand analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch brand stats',
      details: error.message 
    }, { status: 500 });
  }
}
