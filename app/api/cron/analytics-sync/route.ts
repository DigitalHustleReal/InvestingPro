/**
 * Analytics Sync Cron Job
 * 
 * Runs every 6 hours
 * Syncs analytics data and calculates content performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get top performing articles by views
    const { data: topArticles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, views, category')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(20);

    if (articlesError) throw articlesError;

    // Get articles needing attention (published but low/no views)
    const { data: lowPerformers, error: lowError } = await supabase
      .from('articles')
      .select('id, title, slug, views, published_at')
      .eq('status', 'published')
      .lt('views', 10)
      .order('published_at', { ascending: true })
      .limit(20);

    if (lowError) throw lowError;

    // Calculate overall stats
    const { count: totalPublished } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const { count: totalDrafts } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    const analytics = {
      totalPublished: totalPublished || 0,
      totalDrafts: totalDrafts || 0,
      topPerformers: topArticles?.slice(0, 5).map((a: any) => ({
        title: a.title,
        views: a.views,
        category: a.category,
      })),
      needsAttention: lowPerformers?.length || 0,
    };

    logger.info('[CRON] Analytics sync:', analytics);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analytics,
    });
  } catch (error) {
    logger.error('[CRON] Analytics sync error:', error);
    return NextResponse.json(
      { error: 'Analytics sync failed' },
      { status: 500 }
    );
  }
}
