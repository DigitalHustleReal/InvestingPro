/**
 * Spike Pre-Screener
 *
 * Three free parallel checks run after event detection.
 * Research-corrected timings:
 *   - Google Trends RSS: 12-24h lag — lagging corroboration only, not real-time trigger
 *   - GSC impressions: 2-3 day lag — retrospective validator
 *   - Internal traffic: real-time — primary signal
 *
 * Decision:
 *   spike_count >= 2 → use SERP credit (paid analysis)
 *   spike_count == 1 → free sources only
 *   spike_count == 0 && importance < 7 → skip to daily queue
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface SpikeResult {
  trends_spike: boolean;
  gsc_spike: boolean;
  internal_spike: boolean;
}

/**
 * Check Google Trends India daily RSS for keyword corroboration.
 * Lag: 12-24h (daily batch). Used as lagging confirmation.
 */
async function checkGoogleTrends(keywords: string[]): Promise<boolean> {
  try {
    const res = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
      { signal: AbortSignal.timeout(8_000) }
    );
    if (!res.ok) return false;
    const xml = await res.text();

    // Extract trending titles from RSS
    const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi;
    const titles: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = titleRegex.exec(xml)) !== null) {
      const title = match[1].toLowerCase().trim();
      if (title && title !== 'google trends') titles.push(title);
    }

    // Match: 2+ significant keywords appear in trending titles
    const significantKws = keywords.filter((k) => k.length > 3);
    const matchCount = significantKws.filter((kw) =>
      titles.some((t) => t.includes(kw.toLowerCase()))
    ).length;

    return matchCount >= 2;
  } catch (err: any) {
    logger.warn(`[SpikeScreener] Trends check failed: ${err.message}`);
    return false;
  }
}

/**
 * Check internal analytics_events for traffic spike on category-related pages.
 * Window: last 6h vs prior 6h. Threshold: +30% increase.
 */
async function checkInternalTraffic(
  category: string,
  supabase: SupabaseClient
): Promise<boolean> {
  try {
    const now = new Date();
    const sixHAgo = new Date(now.getTime() - 6 * 3_600_000);
    const twelveHAgo = new Date(now.getTime() - 12 * 3_600_000);

    // Map news category → URL path pattern on InvestingPro
    const urlPatternMap: Record<string, string> = {
      repo_rate: 'fixed-deposit',
      banking: 'fixed-deposit',
      mutual_fund: 'mutual-fund',
      ipo: 'ipo',
      gold_silver: 'gold',
      fuel_price: 'calculators',
      lpg: 'calculators',
      da_announcement: 'calculators',
      tax_change: 'calculators/income-tax',
      insurance_regulation: 'insurance',
      pension: 'calculators',
      epfo: 'calculators',
      pay_commission: 'calculators/salary',
      markets: 'mutual-fund',
      forex: 'articles',
      general_finance: 'articles',
    };
    const pattern = urlPatternMap[category] ?? 'articles';

    const [currentRes, priorRes] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sixHAgo.toISOString())
        .ilike('page', `%${pattern}%`),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', twelveHAgo.toISOString())
        .lt('created_at', sixHAgo.toISOString())
        .ilike('page', `%${pattern}%`),
    ]);

    const current = currentRes.count ?? 0;
    const prior = priorRes.count ?? 0;

    if (prior === 0) return current > 10; // Cold start: any meaningful traffic counts
    return current > prior * 1.3; // +30% increase threshold
  } catch (err: any) {
    logger.warn(`[SpikeScreener] Internal traffic check failed: ${err.message}`);
    return false;
  }
}

/**
 * Check GSC impressions delta for keyword categories.
 * Lag: 2-3 days. Used as retrospective validator.
 * Gracefully skips if GSC not connected or token expired.
 */
async function checkGscDelta(
  keywords: string[],
  supabase: SupabaseClient
): Promise<boolean> {
  try {
    // Look for GSC integration in integrations table
    const { data: gscConfig } = await supabase
      .from('integrations')
      .select('config')
      .eq('type', 'google_search_console')
      .eq('active', true)
      .maybeSingle();

    if (!gscConfig?.config?.access_token) return false; // GSC not connected

    const token = gscConfig.config.access_token as string;
    const siteUrl = (gscConfig.config.site_url as string) ?? 'https://www.investingpro.in/';

    const now = new Date();
    const fmt = (d: Date) => d.toISOString().substring(0, 10);
    const twoDaysAgo = fmt(new Date(now.getTime() - 2 * 86_400_000));
    const fourDaysAgo = fmt(new Date(now.getTime() - 4 * 86_400_000));
    const today = fmt(now);

    const queryGsc = async (startDate: string, endDate: string): Promise<number> => {
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: ['query'],
            dimensionFilterGroups: [
              {
                filters: keywords.slice(0, 3).map((kw) => ({
                  dimension: 'query',
                  operator: 'contains',
                  expression: kw,
                })),
              },
            ],
            rowLimit: 1,
          }),
          signal: AbortSignal.timeout(8_000),
        }
      );
      if (!res.ok) return 0;
      const data = await res.json();
      return (data.rows ?? []).reduce(
        (sum: number, r: any) => sum + (r.impressions ?? 0),
        0
      );
    };

    const [recent, prior] = await Promise.all([
      queryGsc(twoDaysAgo, today),
      queryGsc(fourDaysAgo, twoDaysAgo),
    ]);

    if (prior === 0) return false; // No baseline to compare against
    return recent > prior * 1.4; // +40% increase threshold
  } catch (err: any) {
    logger.warn(`[SpikeScreener] GSC check failed (non-fatal): ${err.message}`);
    return false; // Always graceful — pipeline continues without GSC
  }
}

export async function runSpikeScreening(
  keywords: string[],
  category: string,
  supabase: SupabaseClient
): Promise<SpikeResult> {
  const [trends_spike, internal_spike, gsc_spike] = await Promise.all([
    checkGoogleTrends(keywords),
    checkInternalTraffic(category, supabase),
    checkGscDelta(keywords, supabase),
  ]);

  const spikeCount = (trends_spike ? 1 : 0) + (internal_spike ? 1 : 0) + (gsc_spike ? 1 : 0);
  logger.info(
    `[SpikeScreener] Category:${category} → Trends:${trends_spike} Internal:${internal_spike} GSC:${gsc_spike} (total:${spikeCount})`
  );

  return { trends_spike, gsc_spike, internal_spike };
}
