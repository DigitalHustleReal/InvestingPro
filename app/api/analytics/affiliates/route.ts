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
    const partnerId = searchParams.get('partnerId');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get affiliate partners
    let partnersQuery = supabase
      .from('affiliate_partners')
      .select('id, name, slug, commission_type, commission_rate, category, is_active');

    if (partnerId) {
      partnersQuery = partnersQuery.eq('id', partnerId);
    }

    const { data: partners, error: partnersError } = await partnersQuery;

    if (partnersError) throw partnersError;

    // Get affiliate clicks
    const clicksQuery = supabase
      .from('affiliate_clicks')
      .select('id, product_id, product_type, converted, commission_earned, created_at, conversion_date')
      .gte('created_at', startDate.toISOString());

    const { data: clicks, error: clicksError } = await clicksQuery;

    if (clicksError) throw clicksError;

    // Get affiliate links
    let links = null;
    try {
      const { data } = await supabase
        .from('affiliate_links')
        .select('id, partner_id, name, clicks, conversions, revenue');
      links = data;
    } catch (error) {
      // Table might not exist, that's okay
    }

    // Aggregate by partner
    const partnerStatsMap: Record<string, {
      id: string;
      name: string;
      commission_type: string;
      commission_rate: number;
      clicks: number;
      conversions: number;
      revenue: number;
      conversionRate: number;
    }> = {};

    partners?.forEach((partner: any) => {
      partnerStatsMap[partner.id] = {
        id: partner.id,
        name: partner.name,
        commission_type: partner.commission_type || 'cpa',
        commission_rate: partner.commission_rate || 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
      };
    });

    // Aggregate clicks and conversions
    clicks?.forEach((click: any) => {
      // Try to find partner through affiliate_products or affiliate_links
      // For now, aggregate all clicks
      // In production, you'd join with affiliate_products to get partner_id
    });

    // Aggregate by links
    links?.forEach((link: any) => {
      const partnerId = link.partner_id;
      if (partnerStatsMap[partnerId]) {
        partnerStatsMap[partnerId].clicks += link.clicks || 0;
        partnerStatsMap[partnerId].conversions += link.conversions || 0;
        partnerStatsMap[partnerId].revenue += link.revenue || 0;
      }
    });

    // Calculate conversion rates
    Object.values(partnerStatsMap).forEach((stats) => {
      stats.conversionRate = stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0;
    });

    // Get top affiliates
    const topAffiliates = Object.values(partnerStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    // Get top links
    const topLinks = (links || [])
      .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 10)
      .map((link: any) => ({
        id: link.id,
        name: link.name,
        clicks: link.clicks || 0,
        conversions: link.conversions || 0,
        revenue: link.revenue || 0,
      }));

    // Calculate totals
    const totals = {
      clicks: clicks?.length || 0,
      conversions: clicks?.filter((c: any) => c.converted).length || 0,
      revenue: clicks?.reduce((sum: number, c: any) => sum + parseFloat(c.commission_earned || '0'), 0) || 0,
      partners: partners?.length || 0,
      links: links?.length || 0,
    };

    totals.revenue += (links || []).reduce((sum: number, l: any) => sum + (l.revenue || 0), 0);

    return NextResponse.json({
      success: true,
      period: { days, startDate: startDate.toISOString() },
      totals,
      topAffiliates,
      topLinks,
      partners: Object.values(partnerStatsMap),
    });
  } catch (error: any) {
    logger.error('Affiliate analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch affiliate stats',
      details: error.message 
    }, { status: 500 });
  }
}
