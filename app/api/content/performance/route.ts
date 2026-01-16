/**
 * Content Performance API
 * Returns content performance metrics (views, engagement, revenue)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { requireAdmin } from '@/lib/auth/admin-auth';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const adminCheck = await requireAdmin(request);
        if (adminCheck.error) {
            return adminCheck.response;
        }

        const searchParams = request.nextUrl.searchParams;
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');
        const limitParam = searchParams.get('limit');

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
        const limit = parseInt(limitParam || '50', 10);

        if (new Date(startDate) > new Date(endDate)) {
            return NextResponse.json(
                { error: 'startDate must be before endDate' },
                { status: 400 }
            );
        }

        // Get articles with views and revenue
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, slug, category, views, published_date')
            .eq('status', 'published')
            .gte('published_date', startDate)
            .lte('published_date', endDate)
            .order('views', { ascending: false })
            .limit(limit);

        if (articlesError) {
            throw articlesError;
        }

        // Get revenue for each article
        const articleIds = articles?.map(a => a.id) || [];
        
        const { data: conversions } = await supabase
            .from('affiliate_clicks')
            .select('article_id, commission_earned')
            .eq('converted', true)
            .in('article_id', articleIds)
            .gte('conversion_date', startDate)
            .lte('conversion_date', endDate);

        // Calculate revenue per article
        const articleRevenueMap = new Map<string, number>();
        conversions?.forEach(conv => {
            if (conv.article_id) {
                const revenue = Number(conv.commission_earned) || 0;
                articleRevenueMap.set(
                    conv.article_id,
                    (articleRevenueMap.get(conv.article_id) || 0) + revenue
                );
            }
        });

        // Combine data
        const performanceData = articles?.map(article => ({
            articleId: article.id,
            articleTitle: article.title,
            articleSlug: article.slug,
            category: article.category,
            views: article.views || 0,
            revenue: articleRevenueMap.get(article.id) || 0,
            revenuePerView: (article.views || 0) > 0 
                ? ((articleRevenueMap.get(article.id) || 0) / (article.views || 1)).toFixed(4)
                : '0.0000'
        }))
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue
        || [];

        return NextResponse.json({
            articles: performanceData,
            period: {
                startDate,
                endDate
            },
            summary: {
                totalArticles: performanceData.length,
                totalViews: performanceData.reduce((sum, a) => sum + a.views, 0),
                totalRevenue: performanceData.reduce((sum, a) => sum + a.revenue, 0),
                avgRevenuePerArticle: performanceData.length > 0 
                    ? performanceData.reduce((sum, a) => sum + a.revenue, 0) / performanceData.length
                    : 0
            }
        });

    } catch (error: any) {
        console.error('Error fetching content performance:', error);
        
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch content performance data. Please try again later.'
            },
            { status: 500 }
        );
    }
}
