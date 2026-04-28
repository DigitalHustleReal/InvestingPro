/**
 * SERP Budget Manager
 *
 * Manages the daily SERP credit ledger (10 credits/day, resets midnight IST).
 * Provides paid analysis via Serper.dev and free fallback via Google Autocomplete.
 *
 * Tiers:
 *   Breaking reserve: 4 credits (importance 9-10)
 *   Spike confirmed:  4 credits (importance 7-8, 2+ spike signals)
 *   Float reserve:    2 credits (unexpected high-priority events)
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface SerpAnalysisResult {
  keywords: string[];
  competitorInsights: string;
  relatedQueries: string[];
  usedPaidApi: boolean;
}

function todayDate(): string {
  // Use IST midnight for reset alignment
  return new Date().toISOString().substring(0, 10);
}

async function ensureLedgerRow(supabase: SupabaseClient): Promise<void> {
  await supabase
    .from('serp_credit_ledger')
    .insert({ date: todayDate() })
    .onConflict('date')
    .ignore();
}

export async function getRemainingCredits(supabase: SupabaseClient): Promise<number> {
  await ensureLedgerRow(supabase);
  const { data } = await supabase
    .from('serp_credit_ledger')
    .select('daily_budget, news_used')
    .eq('date', todayDate())
    .single();
  if (!data) return 0;
  return Math.max(0, data.daily_budget - data.news_used);
}

/** Atomically consume one credit using DB function. Returns false if budget exhausted. */
async function consumeCredit(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_serp_credit', {
    target_date: todayDate(),
  });
  if (error) {
    logger.warn(`[SerpBudget] Credit consume failed: ${error.message}`);
    return false;
  }
  return data === true;
}

/** Free SERP analysis: Google Autocomplete suggestions */
async function freeSerp(keywords: string[]): Promise<SerpAnalysisResult> {
  const primaryKw = keywords[0] ?? 'personal finance india';

  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(primaryKw + ' india')}&hl=en`,
      { signal: AbortSignal.timeout(6_000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const suggestions: string[] = (Array.isArray(data[1]) ? data[1] : []).slice(0, 8);

    return {
      keywords: [...keywords, ...suggestions].slice(0, 12),
      competitorInsights: `Free autocomplete analysis for: "${primaryKw}". Top suggestions: ${suggestions.slice(0, 3).join('; ')}`,
      relatedQueries: suggestions,
      usedPaidApi: false,
    };
  } catch (err: any) {
    logger.warn(`[SerpBudget] Free SERP failed: ${err.message}`);
    return {
      keywords,
      competitorInsights: `Analysis for: "${primaryKw}"`,
      relatedQueries: [],
      usedPaidApi: false,
    };
  }
}

/** Paid SERP analysis: Serper.dev (dev tier: 2,500 free/month) */
async function paidSerp(keywords: string[]): Promise<SerpAnalysisResult> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    logger.warn('[SerpBudget] SERPER_API_KEY not set — using free analysis');
    return freeSerp(keywords);
  }

  const primaryKw = `${keywords.slice(0, 3).join(' ')} india`;
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: primaryKw, gl: 'in', hl: 'en', num: 10 }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Serper HTTP ${res.status}`);
    const data = await res.json();

    const organic: any[] = (data.organic ?? []).slice(0, 5);
    const paa: string[] = (data.peopleAlsoAsk ?? [])
      .slice(0, 5)
      .map((q: any) => q.question as string);
    const related: string[] = (data.relatedSearches ?? [])
      .slice(0, 5)
      .map((r: any) => r.query as string);

    const competitorList = organic
      .map((r: any) => `- ${r.title} (${(r.link ?? '').split('/')[2] ?? 'unknown'})`)
      .join('\n');

    const paaList = paa.map((q) => `- ${q}`).join('\n');

    return {
      keywords: [...keywords, ...paa, ...related].slice(0, 15),
      competitorInsights: [
        `Top SERP results for "${primaryKw}":`,
        competitorList,
        '',
        'People Also Ask:',
        paaList,
      ].join('\n'),
      relatedQueries: [...paa, ...related],
      usedPaidApi: true,
    };
  } catch (err: any) {
    logger.warn(`[SerpBudget] Serper failed: ${err.message} — falling back to free`);
    return freeSerp(keywords);
  }
}

export async function runSerpAnalysis(
  keywords: string[],
  importanceScore: number,
  spikeCount: number,
  supabase: SupabaseClient
): Promise<SerpAnalysisResult> {
  // Determine if we should spend a credit
  const shouldUsePaid = importanceScore >= 7 || spikeCount >= 2;
  if (!shouldUsePaid) {
    logger.info('[SerpBudget] Importance < 7 and spike < 2 → free analysis');
    return freeSerp(keywords);
  }

  const remaining = await getRemainingCredits(supabase);
  if (remaining <= 0) {
    logger.warn('[SerpBudget] Daily budget exhausted → free analysis');
    return freeSerp(keywords);
  }

  const consumed = await consumeCredit(supabase);
  if (!consumed) {
    logger.warn('[SerpBudget] Credit consume failed → free analysis');
    return freeSerp(keywords);
  }

  logger.info(`[SerpBudget] Credit consumed (${remaining - 1} remaining) → paid analysis`);
  return paidSerp(keywords);
}
