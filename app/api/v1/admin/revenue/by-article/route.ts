import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/by-article
 * Returns revenue metrics for a specific article
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('articleId');
        const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = searchParams.get('endDate') || new Date().toISOString();

        if (!articleId) {
            return NextResponse.json(
                { error: 'articleId is required' },
                { status: 400 }
            );
        }

        // Get article details
        const { data: article } = await supabase
            .from('articles')
            .select('id, title')
            .eq('id', articleId)
            .single();

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        // Get all clicks for this article
        const { data: allClicks } = await supabase
            .from('affiliate_clicks')
            .select('*')
            .eq('article_id', articleId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const totalClicks = allClicks?.length || 0;

        // Get conversions for this article
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('commission_earned, product_id')
            .eq('article_id', articleId)
            .eq('converted', true)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        const totalConversions = conversions?.length || 0;
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

        // Calculate revenue
        const revenue = conversions?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;

        // Affiliate breakdown
        const productIds = [...new Set(conversions?.map(c => c.product_id).filter(Boolean) || [])];
        const { data: affiliateProducts } = await supabase
            .from('affiliate_products')
            .select('id, name, company')
            .in('id', productIds);

        const affiliateBreakdownMap = new Map<string, { revenue: number; conversions: number; name: string }>();
        
        conversions?.forEach(conv => {
            if (conv.product_id) {
                const productId = conv.product_id;
                const revenue = Number(conv.commission_earned) || 0;
                const affiliate = affiliateProducts?.find(p => p.id === productId);
                const affiliateName = affiliate ? `${affiliate.company} - ${affiliate.name}` : 'Unknown';
                
                if (!affiliateBreakdownMap.has(productId)) {
                    affiliateBreakdownMap.set(productId, { revenue: 0, conversions: 0, name: affiliateName });
                }
                
                const current = affiliateBreakdownMap.get(productId)!;
                current.revenue += revenue;
                current.conversions += 1;
            }
        });

        const affiliateBreakdown = Array.from(affiliateBreakdownMap.entries())
            .map(([affiliateId, stats]) => ({
                affiliateId,
                affiliateName: stats.name,
                revenue: stats.revenue,
                conversions: stats.conversions
            }))
            .sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            articleId,
            articleTitle: article.title,
            revenue,
            conversions: totalConversions,
            conversionRate: Number(conversionRate.toFixed(2)),
            clicks: totalClicks,
            affiliateBreakdown
        });

    } catch (error) {
        console.error('Revenue by article error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch article revenue data' },
            { status: 500 }
        );
    }
}
