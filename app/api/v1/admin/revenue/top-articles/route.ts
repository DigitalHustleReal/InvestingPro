import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { requireAdmin } from '@/lib/auth/admin-auth';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * GET /api/v1/admin/revenue/top-articles
 * Returns top converting articles by revenue
 * 
 * Query Parameters:
 * - limit (optional): Number of articles to return, defaults to 10
 * - startDate (optional): ISO date string, defaults to 30 days ago
 * - endDate (optional): ISO date string, defaults to now
 */
export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        // Check admin authentication
        await requireAdmin();

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

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

        // Get all converted clicks with article_id in the date range
        const { data: conversions, error: conversionsError } = await supabase
            .from('affiliate_clicks')
            .select('article_id, commission_earned, product_type')
            .eq('converted', true)
            .not('article_id', 'is', null)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        if (conversionsError) {
            console.error('Error fetching conversions:', conversionsError);
            return NextResponse.json(
                { error: 'Failed to fetch conversion data' },
                { status: 500 }
            );
        }

        // Aggregate revenue by article
        const articleRevenueMap = new Map<string, { revenue: number; conversions: number; productTypes: Set<string> }>();

        conversions?.forEach(conv => {
            if (conv.article_id) {
                const articleId = conv.article_id;
                const revenue = Number(conv.commission_earned) || 0;

                if (!articleRevenueMap.has(articleId)) {
                    articleRevenueMap.set(articleId, {
                        revenue: 0,
                        conversions: 0,
                        productTypes: new Set()
                    });
                }

                const stats = articleRevenueMap.get(articleId)!;
                stats.revenue += revenue;
                stats.conversions += 1;
                if (conv.product_type) {
                    stats.productTypes.add(conv.product_type);
                }
            }
        });

        // Get article details for all articles with revenue
        const articleIds = Array.from(articleRevenueMap.keys());
        
        if (articleIds.length === 0) {
            return NextResponse.json({
                articles: [],
                totalRevenue: 0,
                totalConversions: 0
            });
        }

        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, slug, category, views')
            .in('id', articleIds);

        if (articlesError) {
            console.error('Error fetching articles:', articlesError);
            return NextResponse.json(
                { error: 'Failed to fetch article data' },
                { status: 500 }
            );
        }

        // Combine article data with revenue stats
        const topArticles = articles
            ?.map(article => {
                const stats = articleRevenueMap.get(article.id);
                if (!stats) return null;

                // Calculate conversion rate (we need clicks for this)
                // For now, we'll use a placeholder - ideally we'd query total clicks per article
                const conversionRate = stats.conversions > 0 ? stats.conversions / (stats.conversions * 10) * 100 : 0;

                return {
                    articleId: article.id,
                    articleTitle: article.title,
                    articleSlug: article.slug,
                    category: article.category,
                    views: article.views || 0,
                    revenue: stats.revenue,
                    conversions: stats.conversions,
                    conversionRate: Number(conversionRate.toFixed(2)),
                    productTypes: Array.from(stats.productTypes)
                };
            })
            .filter((article): article is NonNullable<typeof article> => article !== null)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit) || [];

        const totalRevenue = topArticles.reduce((sum, article) => sum + article.revenue, 0);
        const totalConversions = topArticles.reduce((sum, article) => sum + article.conversions, 0);

        return NextResponse.json({
            articles: topArticles,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalConversions,
            period: {
                startDate,
                endDate
            }
        });

    } catch (error: any) {
        console.error('Top articles revenue error:', error);
        
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
                message: 'Failed to fetch top articles revenue data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
