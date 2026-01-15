import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/by-category
 * Returns revenue metrics for a specific category
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category') || 'all';
        const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = searchParams.get('endDate') || new Date().toISOString();

        // Map category to product_type patterns
        const categoryPatterns: Record<string, string[]> = {
            'credit-cards': ['credit_card', 'creditcard'],
            'mutual-funds': ['mutual_fund', 'mutualfund', 'stock_broker'],
            'insurance': ['insurance'],
            'all': []
        };

        const patterns = categoryPatterns[category] || categoryPatterns['all'];

        // Build query
        let query = supabase
            .from('affiliate_clicks')
            .select('product_type, commission_earned, converted, article_id, product_id')
            .eq('converted', true)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        // Filter by category if not 'all'
        if (category !== 'all' && patterns.length > 0) {
            // Use OR conditions for multiple patterns
            const orConditions = patterns.map(pattern => `product_type.ilike.%${pattern}%`).join(',');
            // Note: Supabase doesn't support OR directly in filters, so we'll filter in code
        }

        const { data: categoryClicks } = await query;

        // Filter by category pattern if needed
        let filteredData = categoryClicks || [];
        if (category !== 'all' && patterns.length > 0) {
            filteredData = filteredData.filter(row => {
                const productType = row.product_type?.toLowerCase() || '';
                return patterns.some(pattern => productType.includes(pattern));
            });
        }

        // Calculate revenue
        const revenue = filteredData.reduce((sum, row) => sum + (Number(row.commission_earned) || 0), 0);

        // Calculate conversions
        const conversions = filteredData.length;

        // Calculate conversion rate (need total clicks for this category)
        const { data: allCategoryClicks } = await supabase
            .from('affiliate_clicks')
            .select('product_type, converted')
            .gte('created_at', startDate)
            .lte('created_at', endDate);

        let allCategoryClicksFiltered = allCategoryClicks || [];
        if (category !== 'all' && patterns.length > 0) {
            allCategoryClicksFiltered = allCategoryClicksFiltered.filter(row => {
                const productType = row.product_type?.toLowerCase() || '';
                return patterns.some(pattern => productType.includes(pattern));
            });
        }

        const totalClicks = allCategoryClicksFiltered.length;
        const conversionRate = totalClicks > 0 ? (conversions / totalClicks) * 100 : 0;

        // Top articles for this category
        const articleRevenueMap = new Map<string, { revenue: number; conversions: number }>();
        
        filteredData.forEach(row => {
            if (row.article_id) {
                const articleId = row.article_id;
                const revenue = Number(row.commission_earned) || 0;
                
                if (!articleRevenueMap.has(articleId)) {
                    articleRevenueMap.set(articleId, { revenue: 0, conversions: 0 });
                }
                
                const current = articleRevenueMap.get(articleId)!;
                current.revenue += revenue;
                current.conversions += 1;
            }
        });

        // Get article titles
        const articleIds = Array.from(articleRevenueMap.keys());
        const { data: articles } = await supabase
            .from('articles')
            .select('id, title')
            .in('id', articleIds);

        const topArticles = Array.from(articleRevenueMap.entries())
            .map(([articleId, stats]) => {
                const article = articles?.find(a => a.id === articleId);
                return {
                    articleId,
                    articleTitle: article?.title || 'Unknown Article',
                    revenue: stats.revenue,
                    conversions: stats.conversions
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Top affiliates for this category
        // Get affiliate products
        const productIds = [...new Set(filteredData.map(row => row.product_id).filter(Boolean))];
        const { data: affiliateProducts } = await supabase
            .from('affiliate_products')
            .select('id, name, company')
            .in('id', productIds);

        const affiliateRevenueMap = new Map<string, { revenue: number; conversions: number; name: string }>();
        
        filteredData.forEach(row => {
            if (row.product_id) {
                const productId = row.product_id;
                const revenue = Number(row.commission_earned) || 0;
                const affiliate = affiliateProducts?.find(p => p.id === productId);
                const affiliateName = affiliate ? `${affiliate.company} - ${affiliate.name}` : 'Unknown';
                
                if (!affiliateRevenueMap.has(productId)) {
                    affiliateRevenueMap.set(productId, { revenue: 0, conversions: 0, name: affiliateName });
                }
                
                const current = affiliateRevenueMap.get(productId)!;
                current.revenue += revenue;
                current.conversions += 1;
            }
        });

        const topAffiliates = Array.from(affiliateRevenueMap.entries())
            .map(([affiliateId, stats]) => ({
                affiliateId,
                affiliateName: stats.name,
                revenue: stats.revenue,
                conversions: stats.conversions
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        return NextResponse.json({
            category,
            revenue,
            conversions,
            conversionRate: Number(conversionRate.toFixed(2)),
            topArticles,
            topAffiliates
        });

    } catch (error) {
        console.error('Revenue by category error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category revenue data' },
            { status: 500 }
        );
    }
}
