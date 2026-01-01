import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyticsService } from '@/lib/analytics/service';
import { SEOAnalyzer } from '@/lib/analytics/seo-analyzer';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'overview';
        const articleId = searchParams.get('articleId');

        switch (type) {
            case 'overview':
                const performance = await analyticsService.getPerformanceOverview();
                return NextResponse.json(performance);

            case 'article':
                if (!articleId) {
                    return NextResponse.json({ error: 'articleId required' }, { status: 400 });
                }
                const articleAnalytics = await analyticsService.getArticleAnalytics(articleId);
                return NextResponse.json(articleAnalytics);

            case 'seo':
                if (!articleId) {
                    return NextResponse.json({ error: 'articleId required' }, { status: 400 });
                }
                // Fetch article and analyze SEO
                const { data: article, error } = await supabase
                    .from('articles')
                    .select('title, slug, excerpt, body_markdown, seo_title, seo_description, featured_image, tags')
                    .eq('id', articleId)
                    .single();

                if (error || !article) {
                    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
                }

                const seoScore = SEOAnalyzer.analyze(article);
                return NextResponse.json(seoScore);

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

    } catch (error) {
        logger.error('Analytics API error', error as Error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

// Record view endpoint
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { articleId, referrer, duration } = body;

        if (!articleId) {
            return NextResponse.json({ error: 'articleId required' }, { status: 400 });
        }

        // Get user if authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        await analyticsService.recordView(articleId, {
            referrer,
            duration,
            userId: user?.id
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        logger.error('Failed to record view', error as Error);
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
    }
}
