import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/by-affiliate
 * Returns revenue metrics for a specific affiliate partner
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const affiliateId = searchParams.get('affiliateId');
        const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = searchParams.get('endDate') || new Date().toISOString();

        if (!affiliateId) {
            return NextResponse.json(
                { error: 'affiliateId is required' },
                { status: 400 }
            );
        }

        // Get affiliate product details
        const { data: affiliateProduct } = await supabase
            .from('affiliate_products')
            .select('id, name, company, commission_rate, type')
            .eq('id', affiliateId)
            .single();

        if (!affiliateProduct) {
            return NextResponse.json(
                { error: 'Affiliate partner not found' },
                { status: 404 }
            );
        }

        // Get all clicks for this affiliate
        const { data: allClicks } = await supabase
            .from('affiliate_clicks')
            .select('*')
            .eq('product_id', affiliateId)
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        const totalClicks = allClicks?.length || 0;

        // Get conversions for this affiliate
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('commission_earned, product_type, article_id')
            .eq('product_id', affiliateId)
            .eq('converted', true)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        const totalConversions = conversions?.length || 0;
        const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

        // Calculate revenue
        const revenue = conversions?.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0) || 0;

        // Category breakdown
        const categoryBreakdown = {
            creditCards: 0,
            mutualFunds: 0,
            insurance: 0
        };

        conversions?.forEach(conv => {
            const revenue = Number(conv.commission_earned) || 0;
            const productType = conv.product_type?.toLowerCase() || '';
            
            if (productType.includes('credit_card') || productType.includes('creditcard')) {
                categoryBreakdown.creditCards += revenue;
            } else if (productType.includes('mutual_fund') || productType.includes('mutualfund') || productType.includes('stock_broker')) {
                categoryBreakdown.mutualFunds += revenue;
            } else if (productType.includes('insurance')) {
                categoryBreakdown.insurance += revenue;
            }
        });

        // Top articles for this affiliate
        const articleRevenueMap = new Map<string, number>();
        
        conversions?.forEach(conv => {
            if (conv.article_id) {
                const articleId = conv.article_id;
                const revenue = Number(conv.commission_earned) || 0;
                
                if (!articleRevenueMap.has(articleId)) {
                    articleRevenueMap.set(articleId, 0);
                }
                
                articleRevenueMap.set(articleId, (articleRevenueMap.get(articleId) || 0) + revenue);
            }
        });

        // Get article titles
        const articleIds = Array.from(articleRevenueMap.keys());
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title')
            .in('id', articleIds);

        const topArticles = Array.from(articleRevenueMap.entries())
            .map(([articleId, revenue]) => {
                const article = articles?.find(a => a.id === articleId);
                return {
                    articleId,
                    articleTitle: article?.title || 'Unknown Article',
                    revenue
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        return NextResponse.json({
            affiliateId,
            affiliateName: `${affiliateProduct.company} - ${affiliateProduct.name}`,
            revenue,
            conversions: totalConversions,
            conversionRate: Number(conversionRate.toFixed(2)),
            commissionRate: affiliateProduct.commission_rate || 0,
            categoryBreakdown,
            topArticles
        });

    } catch (error) {
        console.error('Revenue by affiliate error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch affiliate revenue data' },
            { status: 500 }
        );
    }
}
