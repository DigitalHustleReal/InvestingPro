import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { requireAdmin } from '@/lib/auth/admin-auth';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/by-affiliate
 * Returns revenue metrics for a specific affiliate partner
 * 
 * Query Parameters:
 * - affiliateId (required): UUID of the affiliate product
 * - startDate (optional): ISO date string, defaults to 30 days ago
 * - endDate (optional): ISO date string, defaults to now
 */
export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        // Check admin authentication
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const affiliateId = searchParams.get('affiliateId');
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Validate required parameters
        if (!affiliateId) {
            return NextResponse.json(
                { error: 'affiliateId is required' },
                { status: 400 }
            );
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(affiliateId)) {
            return NextResponse.json(
                { error: 'Invalid affiliateId format. Must be a valid UUID.' },
                { status: 400 }
            );
        }

        // Validate dates
        if (startDateParam && isNaN(Date.parse(startDateParam))) {
            return NextResponse.json(
                { error: 'Invalid startDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        if (endDateParam && isNaN(Date.parse(endDateParam))) {
            return NextResponse.json(
                { error: 'Invalid endDate format. Use ISO 8601 format.' },
                { status: 400 }
            );
        }

        const startDate = startDateParam || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = endDateParam || new Date().toISOString();

        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
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

    } catch (error: any) {
        console.error('Revenue by affiliate error:', error);
        
        if (error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            return NextResponse.json(
                { 
                    error: 'Database permission error',
                    code: 'DB_PERMISSION_ERROR',
                    message: 'Unable to access revenue data. Please check database permissions.'
                },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { 
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch affiliate revenue data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
