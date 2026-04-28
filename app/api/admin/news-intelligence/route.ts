/**
 * News Intelligence Dashboard Data API
 *
 * Returns combined data for the admin dashboard:
 * - Last 48h events (ordered by detected_at DESC)
 * - Today's SERP credit ledger
 * - All news sources with health status
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const since = new Date(Date.now() - 48 * 3_600_000).toISOString();
  const today = new Date().toISOString().substring(0, 10);

  const [eventsRes, creditsRes, sourcesRes] = await Promise.all([
    supabase
      .from('news_events')
      .select(
        'id, headline, category, source_name, importance_score, ' +
          'trends_spike, gsc_spike, internal_spike, spike_count, ' +
          'serp_credit_used, status, article_id, detected_at, published_at, skip_reason'
      )
      .gte('detected_at', since)
      .order('detected_at', { ascending: false })
      .limit(100),

    supabase
      .from('serp_credit_ledger')
      .select('daily_budget, news_used')
      .eq('date', today)
      .maybeSingle(),

    supabase
      .from('news_sources')
      .select('id, name, type, active, last_polled_at, error_count, last_error, category_tags, base_importance, poll_interval_m')
      .order('name'),
  ]);

  return NextResponse.json({
    events: eventsRes.data ?? [],
    credits: creditsRes.data ?? { daily_budget: 10, news_used: 0 },
    sources: sourcesRes.data ?? [],
  });
}
