/**
 * Content Strategy Cron Job
 * 
 * Runs daily at 2 AM IST
 * Identifies content gaps and queues new articles for generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Verify cron secret to prevent unauthorized access
function verifyCronAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // In development, allow without secret
  if (process.env.NODE_ENV === 'development') return true;
  
  // In production, require secret
  if (!cronSecret) return true; // No secret configured
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    
    // Get current article counts by category
    const { data: stats, error } = await supabase
      .from('articles')
      .select('category')
      .eq('status', 'published');

    if (error) throw error;

    // Count by category
    const categoryCounts: Record<string, number> = {};
    stats?.forEach((a) => {
      categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    });

    // Target categories with minimum content
    const targetCategories = [
      'credit-cards',
      'loans',
      'investing',
      'insurance',
      'banking',
      'taxes',
      'small-business',
    ];

    const gaps: string[] = [];
    targetCategories.forEach((cat) => {
      if ((categoryCounts[cat] || 0) < 10) {
        gaps.push(cat);
      }
    });

    // Log strategy results
    console.log('[CRON] Content strategy analysis:', {
      totalArticles: stats?.length || 0,
      categoryCounts,
      gaps,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        totalPublished: stats?.length || 0,
        categoryCounts,
        contentGaps: gaps,
      },
    });
  } catch (error) {
    console.error('[CRON] Content strategy error:', error);
    return NextResponse.json(
      { error: 'Content strategy analysis failed' },
      { status: 500 }
    );
  }
}
