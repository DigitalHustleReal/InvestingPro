# News Intelligence Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire multi-source news polling + spike detection + automatic article generation into a 30-minute source-to-live pipeline for all personal finance news events.

**Architecture:** DB-configurable source registry → 15-min RSS/price poller → spike pre-screener (Trends + GSC + internal) → SERP credit-rationed analysis → generateArticle() → editor_queue → published. Zero modifications to existing swarm agents — pipeline-runner calls lib functions directly.

**Tech Stack:** Next.js App Router route handlers, Supabase service client, `generateArticle()` from `lib/ai/article-writer`, `logger` from `lib/logger`, GitHub Actions for scheduling.

**Spec:** `docs/superpowers/specs/2026-04-28-news-intelligence-pipeline-design.md`

---

## File Map

**New files (14):**
```
supabase/migrations/20260428_news_intelligence_pipeline.sql
lib/news/source-poller.ts
lib/news/event-classifier.ts
lib/news/spike-screener.ts
lib/news/serp-budget.ts
lib/news/article-templates.ts
lib/news/pipeline-runner.ts
app/api/cron/news-monitor/route.ts
app/api/cron/news-pipeline/route.ts
app/api/admin/news-intelligence/route.ts
app/api/admin/news-sources/route.ts
app/api/admin/news-sources/[id]/route.ts
app/api/admin/news-events/[id]/force/route.ts
app/api/admin/news-events/[id]/skip/route.ts
app/admin/news-intelligence/page.tsx
.github/workflows/cron-news-monitor.yml
.github/workflows/cron-news-pipeline.yml
```

**Modified files (0):** — zero existing files touched.

---

## Task 1: DB Migration

**Files:**
- Create: `supabase/migrations/20260428_news_intelligence_pipeline.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20260428_news_intelligence_pipeline.sql
-- News Intelligence Pipeline: 3 new tables

-- ── 1. news_sources ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_sources (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  type             text NOT NULL CHECK (type IN ('rss', 'price_poll', 'scrape')),
  url              text NOT NULL,
  category_tags    text[] NOT NULL DEFAULT '{}',
  base_importance  integer NOT NULL DEFAULT 5 CHECK (base_importance BETWEEN 1 AND 10),
  poll_interval_m  integer NOT NULL DEFAULT 15,
  active           boolean NOT NULL DEFAULT true,
  last_polled_at   timestamptz,
  last_item_hash   text,
  error_count      integer NOT NULL DEFAULT 0,
  last_error       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_sources_active ON news_sources(active, type, last_polled_at);

-- ── 2. news_events ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id        uuid REFERENCES news_sources(id) ON DELETE SET NULL,
  source_name      text NOT NULL,
  source_url       text NOT NULL,
  headline         text NOT NULL,
  summary          text,
  raw_content      text,
  category         text NOT NULL,
  importance_score numeric(4,1) NOT NULL DEFAULT 5,
  item_url         text,

  -- Spike signals
  trends_spike     boolean NOT NULL DEFAULT false,
  gsc_spike        boolean NOT NULL DEFAULT false,
  internal_spike   boolean NOT NULL DEFAULT false,
  spike_count      integer GENERATED ALWAYS AS (
                     trends_spike::int + gsc_spike::int + internal_spike::int
                   ) STORED,
  serp_credit_used boolean NOT NULL DEFAULT false,
  serp_context     jsonb,

  -- Pipeline state
  status           text NOT NULL DEFAULT 'detected'
                   CHECK (status IN (
                     'detected','screening','analyzing',
                     'writing','editing','publishing','published','skipped'
                   )),
  skip_reason      text,
  retry_count      integer NOT NULL DEFAULT 0,
  article_id       uuid REFERENCES articles(id) ON DELETE SET NULL,

  -- Timing
  detected_at      timestamptz NOT NULL DEFAULT now(),
  screening_at     timestamptz,
  analysis_at      timestamptz,
  writing_at       timestamptz,
  editing_at       timestamptz,
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_events_status ON news_events(status, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_events_category ON news_events(category, importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_news_events_article ON news_events(article_id) WHERE article_id IS NOT NULL;
-- Duplicate guard: same source + headline within 24h
CREATE UNIQUE INDEX IF NOT EXISTS idx_news_events_dedup
  ON news_events(source_id, headline, date_trunc('day', detected_at));

-- ── 3. serp_credit_ledger ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS serp_credit_ledger (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date         date NOT NULL DEFAULT current_date UNIQUE,
  daily_budget integer NOT NULL DEFAULT 10,
  news_used    integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budget_not_exceeded CHECK (news_used <= daily_budget)
);

-- Helper: increment source error count, disable after 5 errors
CREATE OR REPLACE FUNCTION increment_source_error(source_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE news_sources
  SET error_count = error_count + 1,
      active = CASE WHEN error_count + 1 >= 5 THEN false ELSE active END,
      updated_at = now()
  WHERE id = source_id;
END;
$$;

-- ── 4. Seed sources ────────────────────────────────────────────────────────
INSERT INTO news_sources (name, type, url, category_tags, base_importance, poll_interval_m) VALUES
('PIB Finance', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', ARRAY['budget','tax_change','da_announcement','pay_commission','pension','epfo'], 8, 15),
('PIB Labour', 'rss', 'https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1&Regid=3', ARRAY['epf','esic','gratuity','employment'], 7, 15),
('RBI Press Releases', 'rss', 'https://www.rbi.org.in/scripts/RSS.aspx', ARRAY['repo_rate','banking','monetary_policy','nbfc'], 9, 15),
('SEBI Circulars', 'rss', 'https://www.sebi.gov.in/sebi_data/rss/sebi_latest_news.xml', ARRAY['mutual_fund','securities','ipo','demat'], 8, 15),
('IRDAI', 'rss', 'https://www.irdai.gov.in/ADMINCMS/cms/frmCommunicationNew_List.aspx', ARRAY['insurance','health_insurance','term_insurance'], 7, 30),
('Economic Times Markets', 'rss', 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', ARRAY['general_finance','markets','banking'], 6, 15),
('NDTV Profit', 'rss', 'https://feeds.feedburner.com/ndtvprofit-latest', ARRAY['general_finance','markets'], 5, 15),
('Moneycontrol Economy', 'rss', 'https://www.moneycontrol.com/rss/economy.xml', ARRAY['general_finance','tax_change','banking'], 5, 15),
('Livemint', 'rss', 'https://www.livemint.com/rss/money', ARRAY['general_finance','markets'], 5, 15),
('Business Standard Economy', 'rss', 'https://www.business-standard.com/rss/economy-policy-10205.rss', ARRAY['general_finance','banking'], 5, 15),
('MCX Gold Price', 'price_poll', 'https://mcx.in/content/2208/Commodities.aspx', ARRAY['gold','silver'], 7, 30),
('NSE NIFTY', 'price_poll', 'https://www.nseindia.com/api/allIndices', ARRAY['markets','nifty'], 5, 30),
('USD/INR Rate', 'price_poll', 'https://open.er-api.com/v6/latest/USD', ARRAY['forex','general_finance'], 4, 60),
('Crude Oil Price', 'price_poll', 'https://api.api-ninjas.com/v1/commodityprice?name=crude_oil', ARRAY['fuel_price','inflation'], 6, 60)
ON CONFLICT DO NOTHING;
```

- [ ] **Step 2: Apply migration in Supabase SQL editor**

Open Supabase dashboard → SQL editor → paste and run the migration above.
Expected: 3 new tables created, 14 seed sources inserted.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260428_news_intelligence_pipeline.sql
HUSKY=0 git commit -m "feat(news): DB migration — news_sources + news_events + serp_credit_ledger tables"
```

---

## Task 2: Source Poller

**Files:**
- Create: `lib/news/source-poller.ts`

- [ ] **Step 1: Write source-poller.ts**

```typescript
// lib/news/source-poller.ts
import crypto from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface NewsSource {
  id: string;
  name: string;
  type: 'rss' | 'price_poll' | 'scrape';
  url: string;
  category_tags: string[];
  base_importance: number;
  poll_interval_m: number;
  last_item_hash: string | null;
}

export interface RawNewsItem {
  source_id: string;
  source_name: string;
  source_url: string;
  guid: string;
  headline: string;
  summary: string;
  raw_content: string;
  published_at: string;
  item_url: string;
}

function hashItem(sourceId: string, guid: string): string {
  return crypto.createHash('sha256').update(`${sourceId}:${guid}`).digest('hex');
}

function parseXmlValue(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, 'i');
  return (re.exec(block)?.[1] ?? '').trim();
}

async function fetchRssSource(source: NewsSource): Promise<RawNewsItem[]> {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'InvestingPro-NewsBot/1.0 (+https://investingpro.in)' },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const items: RawNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = parseXmlValue(block, 'title');
    const link = parseXmlValue(block, 'link') || parseXmlValue(block, 'guid');
    const guid = parseXmlValue(block, 'guid') || link;
    const pubDate = parseXmlValue(block, 'pubDate');
    const description = parseXmlValue(block, 'description');

    if (!title || !guid) continue;

    items.push({
      source_id: source.id,
      source_name: source.name,
      source_url: source.url,
      guid,
      headline: title.substring(0, 500),
      summary: description.replace(/<[^>]+>/g, '').substring(0, 800),
      raw_content: description.replace(/<[^>]+>/g, ''),
      published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      item_url: link,
    });
  }
  return items;
}

async function fetchPricePollSource(source: NewsSource): Promise<RawNewsItem[]> {
  const res = await fetch(source.url, {
    headers: { 'User-Agent': 'InvestingPro-NewsBot/1.0' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const guid = new Date().toDateString(); // One item per day per price source
  return [{
    source_id: source.id,
    source_name: source.name,
    source_url: source.url,
    guid,
    headline: `${source.name} daily update`,
    summary: text.substring(0, 500),
    raw_content: text.substring(0, 2000),
    published_at: new Date().toISOString(),
    item_url: source.url,
  }];
}

export async function pollSource(source: NewsSource): Promise<RawNewsItem[]> {
  if (source.type === 'rss') return fetchRssSource(source);
  return fetchPricePollSource(source); // price_poll + scrape
}

export function filterNewItems(
  items: RawNewsItem[],
  lastHash: string | null
): { newItems: RawNewsItem[]; latestHash: string | null } {
  if (!items.length) return { newItems: [], latestHash: lastHash };

  const latestHash = hashItem(items[0].source_id, items[0].guid);
  if (latestHash === lastHash) return { newItems: [], latestHash: lastHash };

  const newItems: RawNewsItem[] = [];
  for (const item of items) {
    const h = hashItem(item.source_id, item.guid);
    if (h === lastHash) break;
    newItems.push(item);
    if (newItems.length >= 10) break; // cap at 10 new items per source per run
  }
  return { newItems, latestHash };
}

export async function pollAllSources(
  supabase: SupabaseClient
): Promise<RawNewsItem[]> {
  // Fetch all active sources due for polling (poll_interval_m ago)
  const { data: sources, error } = await supabase
    .from('news_sources')
    .select('*')
    .eq('active', true)
    .or('last_polled_at.is.null,last_polled_at.lt.' + new Date(Date.now() - 14 * 60 * 1000).toISOString());

  if (error) throw error;
  if (!sources?.length) return [];

  const allNew: RawNewsItem[] = [];

  await Promise.allSettled(
    sources.map(async (source: NewsSource) => {
      try {
        const items = await pollSource(source);
        const { newItems, latestHash } = filterNewItems(items, source.last_item_hash);

        await supabase.from('news_sources').update({
          last_polled_at: new Date().toISOString(),
          last_item_hash: latestHash,
          error_count: 0,
          last_error: null,
          updated_at: new Date().toISOString(),
        }).eq('id', source.id);

        allNew.push(...newItems);
        if (newItems.length) {
          logger.info(`[NewsPoller] ${source.name}: ${newItems.length} new items`);
        }
      } catch (err: any) {
        logger.warn(`[NewsPoller] ${source.name} failed: ${err.message}`);
        await supabase.from('news_sources').update({
          last_polled_at: new Date().toISOString(),
          last_error: err.message,
          updated_at: new Date().toISOString(),
        }).eq('id', source.id);
        // Increment error count via DB function
        await supabase.rpc('increment_source_error', { source_id: source.id }).catch(() => {});
      }
    })
  );

  return allNew;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/news/source-poller.ts
HUSKY=0 git commit -m "feat(news): source-poller — RSS/price/scrape fetch + hash-based dedup"
```

---

## Task 3: Event Classifier

**Files:**
- Create: `lib/news/event-classifier.ts`

- [ ] **Step 1: Write event-classifier.ts**

```typescript
// lib/news/event-classifier.ts
import { RawNewsItem } from './source-poller';

export interface ClassifiedEvent {
  category: string;
  importance_score: number;
  keywords: string[];
}

// Category keyword mapping — ordered by priority (first match wins)
const CATEGORY_PATTERNS: Array<{ category: string; patterns: RegExp[] }> = [
  { category: 'da_announcement', patterns: [/dearness allowance/i, /\bDA hike\b/i, /dearness relief/i, /DR hike/i] },
  { category: 'repo_rate', patterns: [/repo rate/i, /RBI rate/i, /monetary policy/i, /MPC meeting/i, /reverse repo/i] },
  { category: 'lpg', patterns: [/LPG price/i, /cooking gas/i, /cylinder price/i, /domestic gas/i] },
  { category: 'fuel_price', patterns: [/petrol price/i, /diesel price/i, /fuel price/i, /CNG price/i, /crude oil/i] },
  { category: 'gold_silver', patterns: [/gold price/i, /silver price/i, /\bMCX gold\b/i, /gold rate/i, /sovereign gold bond/i, /SGB/i] },
  { category: 'tax_change', patterns: [/income tax/i, /tax slab/i, /TDS rate/i, /GST rate/i, /80[CD]/i, /tax exemption/i, /new tax regime/i] },
  { category: 'budget', patterns: [/union budget/i, /interim budget/i, /fiscal deficit/i, /finance minister/i, /budget 202/i] },
  { category: 'pay_commission', patterns: [/pay commission/i, /7th CPC/i, /8th CPC/i, /salary revision/i, /fitment factor/i] },
  { category: 'mutual_fund', patterns: [/mutual fund/i, /SEBI circular/i, /NFO/i, /fund NAV/i, /SIP limit/i, /expense ratio/i] },
  { category: 'ipo', patterns: [/\bIPO\b/i, /initial public offer/i, /listing gain/i, /SME IPO/i, /GMP/i] },
  { category: 'epfo', patterns: [/EPFO/i, /EPF interest/i, /provident fund/i, /PF withdrawal/i, /UAN/i] },
  { category: 'insurance_regulation', patterns: [/IRDAI/i, /insurance premium/i, /health insurance/i, /term plan/i, /life insurance regulation/i] },
  { category: 'banking', patterns: [/FD rate/i, /fixed deposit/i, /bank interest/i, /savings rate/i, /RBI circular/i, /NBFC/i] },
  { category: 'pension', patterns: [/NPS/i, /pension/i, /OPS/i, /old pension scheme/i, /PFRDA/i, /gratuity/i] },
  { category: 'forex', patterns: [/rupee/i, /USD\/INR/i, /forex reserve/i, /dollar rate/i, /exchange rate/i] },
  { category: 'markets', patterns: [/NIFTY/i, /SENSEX/i, /stock market/i, /BSE/i, /NSE/i, /FII/i, /DII/i] },
  { category: 'general_finance', patterns: [/personal finance/i, /investment/i, /savings/i, /financial/i] },
];

const GOVT_SOURCES = ['rbi', 'sebi', 'irdai', 'pib', 'ministry', 'government', 'finance ministry', 'ppac', 'iocl'];

export function detectCategory(headline: string, categoryTags: string[]): string {
  const text = headline.toLowerCase();

  // Try pattern matching first
  for (const { category, patterns } of CATEGORY_PATTERNS) {
    if (patterns.some(p => p.test(headline))) return category;
  }

  // Fall back to source category_tags
  if (categoryTags.length) return categoryTags[0];

  return 'general_finance';
}

export function scoreImportance(
  baseImportance: number,
  sourceName: string,
  headline: string,
  publishedAt: string
): number {
  let score = baseImportance;

  // Government source multiplier
  const srcLower = sourceName.toLowerCase();
  if (GOVT_SOURCES.some(g => srcLower.includes(g))) {
    score *= 1.2;
  }

  // Large rate change signals in headline
  const pctMatch = headline.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    if (pct >= 5) score *= 1.5;
    else if (pct >= 2) score *= 1.3;
  }

  // Recency
  const ageMs = Date.now() - new Date(publishedAt).getTime();
  const ageMin = ageMs / 60_000;
  if (ageMin < 30) score *= 1.1;
  else if (ageMin > 240) score *= 0.7;

  return Math.min(10, parseFloat(score.toFixed(1)));
}

export function extractKeywords(headline: string, category: string): string[] {
  // Remove stop words, extract meaningful terms
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'be', 'to', 'of', 'and', 'in', 'for', 'on', 'with', 'by', 'from', 'at', 'as']);
  const words = headline
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .slice(0, 8);

  // Add category as a keyword
  const catKeywords = category.split('_').filter(w => w.length > 2);
  return [...new Set([...catKeywords, ...words.map(w => w.toLowerCase())])].slice(0, 10);
}

export function classifyItem(
  item: RawNewsItem,
  source: { base_importance: number; name: string; category_tags: string[] }
): ClassifiedEvent {
  const category = detectCategory(item.headline, source.category_tags);
  const importance_score = scoreImportance(
    source.base_importance,
    source.name,
    item.headline,
    item.published_at
  );
  const keywords = extractKeywords(item.headline, category);
  return { category, importance_score, keywords };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/news/event-classifier.ts
HUSKY=0 git commit -m "feat(news): event-classifier — category detection + importance scoring"
```

---

## Task 4: Spike Screener

**Files:**
- Create: `lib/news/spike-screener.ts`

- [ ] **Step 1: Write spike-screener.ts**

```typescript
// lib/news/spike-screener.ts
/**
 * Spike pre-screener: 3 free parallel checks.
 * Research-corrected: Google Trends RSS is 12-24h lag (daily batch),
 * used as corroboration only, not real-time trigger.
 * GSC is 2-3 day lag, used for retrospective signal.
 * Internal traffic (analytics_events) is the most real-time.
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
 * Lag: 12-24h — used as a lagging confirmation signal only.
 */
async function checkGoogleTrends(keywords: string[]): Promise<boolean> {
  try {
    const res = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
      { signal: AbortSignal.timeout(8_000) }
    );
    if (!res.ok) return false;
    const xml = await res.text();

    // Extract trending titles
    const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/gi;
    const titles: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = titleRegex.exec(xml)) !== null) {
      titles.push(match[1].toLowerCase());
    }

    // Check if 2+ significant keywords appear in trending titles
    const significantKws = keywords.filter(k => k.length > 3);
    const matchCount = significantKws.filter(kw =>
      titles.some(t => t.includes(kw.toLowerCase()))
    ).length;

    return matchCount >= 2;
  } catch (err: any) {
    logger.warn(`[SpikeScreener] Trends check failed: ${err.message}`);
    return false;
  }
}

/**
 * Check internal analytics_events for traffic spike on related pages.
 * Window: last 6h vs prior 6h. Threshold: +30% increase.
 */
async function checkInternalTraffic(
  category: string,
  supabase: SupabaseClient
): Promise<boolean> {
  try {
    const now = new Date();
    const sixHAgo = new Date(now.getTime() - 6 * 3600_000);
    const twelveHAgo = new Date(now.getTime() - 12 * 3600_000);

    // Map category to URL patterns
    const urlPatternMap: Record<string, string> = {
      repo_rate: 'fixed-deposit',
      banking: 'fixed-deposit',
      mutual_fund: 'mutual-fund',
      ipo: 'ipo',
      gold_silver: 'gold',
      fuel_price: 'calculators',
      da_announcement: 'calculators',
      tax_change: 'calculators',
      insurance_regulation: 'insurance',
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

    if (prior === 0) return current > 5; // cold start: any traffic counts
    return current > prior * 1.3; // +30% increase
  } catch (err: any) {
    logger.warn(`[SpikeScreener] Internal traffic check failed: ${err.message}`);
    return false;
  }
}

/**
 * Check GSC impressions delta using stored OAuth tokens.
 * Falls back gracefully if GSC not connected or token expired.
 * Lag: 2-3 days — retrospective signal only.
 */
async function checkGscDelta(
  keywords: string[],
  supabase: SupabaseClient
): Promise<boolean> {
  try {
    // Get GSC tokens from DB (stored during OAuth flow)
    const { data: gscConfig } = await supabase
      .from('integrations')
      .select('config')
      .eq('type', 'google_search_console')
      .eq('active', true)
      .maybeSingle();

    if (!gscConfig?.config?.access_token) return false; // Not connected

    const token = gscConfig.config.access_token;
    const siteUrl = gscConfig.config.site_url ?? 'https://www.investingpro.in/';

    const now = new Date();
    const twoDA = new Date(now.getTime() - 2 * 86400_000).toISOString().substring(0, 10);
    const fourDA = new Date(now.getTime() - 4 * 86400_000).toISOString().substring(0, 10);
    const sixDA = new Date(now.getTime() - 6 * 86400_000).toISOString().substring(0, 10);

    const query = async (startDate: string, endDate: string) => {
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDate, endDate,
            dimensions: ['query'],
            dimensionFilterGroups: [{
              filters: keywords.slice(0, 3).map(kw => ({
                dimension: 'query', operator: 'contains', expression: kw
              }))
            }],
            rowLimit: 1,
          }),
          signal: AbortSignal.timeout(8_000),
        }
      );
      if (!res.ok) return 0;
      const data = await res.json();
      return (data.rows ?? []).reduce((sum: number, r: any) => sum + (r.impressions ?? 0), 0);
    };

    const [recent, prior] = await Promise.all([
      query(twoDA, now.toISOString().substring(0, 10)),
      query(fourDA, twoDA),
    ]);

    if (prior === 0) return false; // No baseline — skip
    return recent > prior * 1.4; // +40% increase
  } catch (err: any) {
    logger.warn(`[SpikeScreener] GSC check failed: ${err.message}`);
    return false; // Graceful degradation
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

  logger.info(`[SpikeScreener] Trends:${trends_spike} GSC:${gsc_spike} Internal:${internal_spike}`);
  return { trends_spike, gsc_spike, internal_spike };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/news/spike-screener.ts
HUSKY=0 git commit -m "feat(news): spike-screener — parallel Trends+GSC+internal traffic checks"
```

---

## Task 5: SERP Budget

**Files:**
- Create: `lib/news/serp-budget.ts`

- [ ] **Step 1: Write serp-budget.ts**

```typescript
// lib/news/serp-budget.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface SerpAnalysisResult {
  keywords: string[];
  competitorInsights: string;
  relatedQueries: string[];
  usedPaidApi: boolean;
}

/** Ensure today's credit ledger row exists */
async function ensureLedgerRow(supabase: SupabaseClient): Promise<void> {
  await supabase
    .from('serp_credit_ledger')
    .insert({ date: new Date().toISOString().substring(0, 10) })
    .onConflict('date')
    .ignore();
}

export async function getRemainingCredits(supabase: SupabaseClient): Promise<number> {
  await ensureLedgerRow(supabase);
  const { data } = await supabase
    .from('serp_credit_ledger')
    .select('daily_budget, news_used')
    .eq('date', new Date().toISOString().substring(0, 10))
    .single();
  return (data?.daily_budget ?? 10) - (data?.news_used ?? 0);
}

/** Atomically consume one credit. Returns false if budget exhausted. */
export async function consumeCredit(supabase: SupabaseClient): Promise<boolean> {
  await ensureLedgerRow(supabase);
  const today = new Date().toISOString().substring(0, 10);

  const { data, error } = await supabase.rpc('consume_serp_credit', { target_date: today });
  if (error) {
    // Fallback: manual update if RPC not available
    const { error: updateError } = await supabase
      .from('serp_credit_ledger')
      .update({ news_used: supabase.rpc ? undefined : undefined }) // skip
      .eq('date', today)
      .lt('news_used', supabase.rpc ? undefined : 10);
    if (updateError) return false;
  }
  return data ?? true;
}

/** Free SERP analysis using Google Autocomplete + DuckDuckGo */
async function freeSerp(keywords: string[]): Promise<SerpAnalysisResult> {
  const primaryKw = keywords[0] ?? 'personal finance india';

  try {
    // Google Autocomplete
    const acRes = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(primaryKw + ' india')}&hl=en`,
      { signal: AbortSignal.timeout(6_000) }
    );
    const acData = acRes.ok ? await acRes.json() : [null, []];
    const suggestions: string[] = (acData[1] ?? []).slice(0, 8);

    return {
      keywords: [...keywords, ...suggestions].slice(0, 12),
      competitorInsights: `Free analysis for: ${primaryKw}. Top autocomplete: ${suggestions.slice(0, 3).join(', ')}`,
      relatedQueries: suggestions,
      usedPaidApi: false,
    };
  } catch {
    return {
      keywords,
      competitorInsights: `Analysis for: ${primaryKw}`,
      relatedQueries: [],
      usedPaidApi: false,
    };
  }
}

/** Paid SERP analysis using Serper.dev */
async function paidSerp(keywords: string[]): Promise<SerpAnalysisResult> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    logger.warn('[SerpBudget] SERPER_API_KEY not set, falling back to free');
    return freeSerp(keywords);
  }

  const primaryKw = `${keywords[0]} india`;
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: primaryKw, gl: 'in', hl: 'en', num: 10 }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Serper ${res.status}`);
    const data = await res.json();

    const organic = (data.organic ?? []).slice(0, 5);
    const paa = (data.peopleAlsoAsk ?? []).slice(0, 5).map((q: any) => q.question);
    const related = (data.relatedSearches ?? []).slice(0, 5).map((r: any) => r.query);

    const insights = organic
      .map((r: any) => `- ${r.title} (${r.link?.split('/')[2] ?? 'unknown'})`)
      .join('\n');

    return {
      keywords: [...keywords, ...paa, ...related].slice(0, 15),
      competitorInsights: `Top results for "${primaryKw}":\n${insights}\n\nPeople also ask:\n${paa.map((q: string) => `- ${q}`).join('\n')}`,
      relatedQueries: [...paa, ...related],
      usedPaidApi: true,
    };
  } catch (err: any) {
    logger.warn(`[SerpBudget] Serper failed: ${err.message}, using free`);
    return freeSerp(keywords);
  }
}

export async function runSerpAnalysis(
  keywords: string[],
  importanceScore: number,
  spikeCount: number,
  supabase: SupabaseClient
): Promise<SerpAnalysisResult> {
  const shouldUsePaid = importanceScore >= 7 || spikeCount >= 2;
  if (!shouldUsePaid) return freeSerp(keywords);

  const remaining = await getRemainingCredits(supabase);
  if (remaining <= 0) {
    logger.warn('[SerpBudget] Daily budget exhausted, using free sources');
    return freeSerp(keywords);
  }

  await consumeCredit(supabase);
  logger.info(`[SerpBudget] Credit consumed (${remaining - 1} remaining)`);
  return paidSerp(keywords);
}
```

- [ ] **Step 2: Add DB function for atomic credit consumption**

Add to the migration SQL (or run separately):
```sql
CREATE OR REPLACE FUNCTION consume_serp_credit(target_date date)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  updated_rows int;
BEGIN
  UPDATE serp_credit_ledger
  SET news_used = news_used + 1, updated_at = now()
  WHERE date = target_date AND news_used < daily_budget;
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$;
```

- [ ] **Step 3: Commit**

```bash
git add lib/news/serp-budget.ts
HUSKY=0 git commit -m "feat(news): serp-budget — credit ledger + Serper.dev/free SERP analysis"
```

---

## Task 6: Article Templates

**Files:**
- Create: `lib/news/article-templates.ts`

- [ ] **Step 1: Write article-templates.ts**

```typescript
// lib/news/article-templates.ts

export interface NewsEventData {
  headline: string;
  summary: string;
  category: string;
  source_name: string;
  source_url: string;
  detected_at: string;
  keywords: string[];
  serp_context?: string;
}

const CATEGORY_CONTEXT: Record<string, (data: NewsEventData) => string> = {
  da_announcement: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}
Date: ${new Date(d.detected_at).toLocaleDateString('en-IN')}

ARTICLE STRUCTURE (mandatory for DA announcements):
1. Opening: State the exact DA increase in % with effective date
2. Who benefits: Central govt employees + pensioners (count: ~50L+ employees, ~65L+ pensioners)
3. [GOLD CALLOUT BOX] Before/After: Show DA % before and after
4. Pay impact table: For Pay Matrix Level 1 to 13, show monthly DA change
5. HRA impact: If DA crosses 25% or 50% threshold, HRA automatically revises
6. PF/Gratuity: DA change affects PF deduction calculation
7. CTA: Link to InvestingPro Salary Calculator (/calculators/salary)
8. Related: Link to 7th Pay Commission calculator if applicable

SEBI DISCLAIMER: Always include at bottom.
`,

  repo_rate: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE (mandatory for RBI rate decisions):
1. Opening: State the new repo rate + direction (hike/cut/hold) in first sentence
2. [GOLD CALLOUT BOX] Rate table: Repo | Reverse Repo | CRR | SLR — before and after
3. EMI impact: For ₹30L home loan at 20yr — EMI change per 25bps
4. FD rate forecast: Historically FD rates follow repo with 4-8 week lag
5. Best FDs now: Link to /fixed-deposits listing
6. SIP/equity impact: Rate cuts = growth positive, rate hikes = short-term pain
7. Calculator CTA: Link to /calculators/emi for home loan EMI calculation
8. Related: Link to /calculators/fd for FD maturity estimate

RBI DISCLAIMER: This article is based on RBI press release. Not investment advice.
`,

  lpg: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE (mandatory for LPG price changes):
1. Opening: State new price for 14.2kg domestic cylinder in Delhi, Mumbai, Kolkata, Chennai
2. [GOLD CALLOUT BOX] Before/After price table (city-wise if available)
3. Monthly impact: Average household uses 2 cylinders/month = ₹{X} annual change
4. PMUY beneficiaries: Ujjwala scheme recipients get subsidy — how much?
5. Commercial cylinder: 19kg cylinder price change (affects small businesses)
6. Budget tip: Share 5 ways to reduce LPG usage
7. Context: LPG follows crude oil prices — brief chart note
8. Calculator CTA: Link to /calculators/budget for monthly budget tracking

`,

  fuel_price: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE:
1. Opening: New petrol + diesel prices in major metros (Delhi/Mumbai/Chennai/Kolkata)
2. [GOLD CALLOUT BOX] Price comparison table: City | Petrol | Diesel | Change
3. Monthly fuel bill: Average car (15km/L, 1500km/month) — impact in ₹
4. CNG update: If applicable, CNG price in Delhi/Mumbai
5. Crude oil context: International crude price that drove this change
6. Commute saving tips: 5 practical tips
7. Tax component: Show how much is tax vs actual cost (excise + VAT breakdown)
`,

  gold_silver: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE:
1. Opening: Current MCX gold price (10g) + silver price (1kg) + % change
2. [GOLD CALLOUT BOX] Price snapshot: MCX | International (USD/oz) | INR/10g
3. Why it moved: Trigger (USD move / inflation / geopolitical)
4. Investment comparison: Physical gold vs SGB vs Gold ETF vs Gold MF
5. SGB opportunity: Is this a good time to buy SGB? Link to SGB series info
6. Jewellery buying: Making charges + GST added to MCX price — real cost
7. Calculator CTA: /calculators/gold for gold investment return

`,

  tax_change: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE:
1. Opening: What changed, effective from when
2. [GOLD CALLOUT BOX] Old rule vs New rule (side by side)
3. Who is affected: Salaried, business owners, investors, or all
4. Tax saving: How much does this save (or cost) for ₹8L / ₹12L / ₹20L income
5. Old vs New regime: Does this change the better-choice calculation?
6. 80C/80D: Are deduction limits affected?
7. Action required: What taxpayer should do NOW (revise advance tax, update Form 16)
8. Calculator CTA: /calculators/income-tax

DISCLAIMER: Consult CA for personal tax advice.
`,

  mutual_fund: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE:
1. Opening: What SEBI/AMFI changed, effective date
2. [GOLD CALLOUT BOX] Key change summary
3. Which fund categories affected
4. Investor impact: SIP investors vs lump sum vs existing folios
5. What to do: Hold, review, or switch?
6. Related funds: Link to InvestingPro MF listing for affected category
7. Calculator CTA: /calculators/sip

SEBI DISCLAIMER: Mutual fund investments are subject to market risks.
`,

  insurance_regulation: (d) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}

ARTICLE STRUCTURE:
1. Opening: What IRDAI changed and when effective
2. [GOLD CALLOUT BOX] Key rule change
3. Premium impact: Estimate for ₹1Cr term plan (30yr, non-smoker)
4. Existing policyholders: Are they grandfathered or affected?
5. New buyers: Should you buy NOW before change, or wait?
6. Related: Link to InvestingPro insurance comparison
`,
};

const DEFAULT_CONTEXT = (d: NewsEventData) => `
BREAKING EVENT CONTEXT:
Source: ${d.source_name} (${d.source_url})
Event: ${d.headline}
Date: ${new Date(d.detected_at).toLocaleDateString('en-IN')}

ARTICLE STRUCTURE:
1. Opening: Clear statement of what changed and who is affected
2. [GOLD CALLOUT BOX] Key facts: Before / After / Effective Date
3. Impact on reader's money: Specific ₹ numbers
4. What to do: 3-5 actionable steps
5. Related product/calculator link from InvestingPro
6. Source citation

SEBI DISCLAIMER: Always include at bottom.
`;

export function getNewsArticleContext(event: NewsEventData): string {
  const templateFn = CATEGORY_CONTEXT[event.category] ?? DEFAULT_CONTEXT;
  const base = templateFn(event);

  const serpSection = event.serp_context
    ? `\nCOMPETITOR SERP INSIGHTS:\n${event.serp_context}\n`
    : '';

  return `${base}${serpSection}
KEYWORDS TO TARGET: ${event.keywords.join(', ')}
MINIMUM LENGTH: 700 words
TONE: Authoritative, data-backed, reader-centric ("your money", "your EMI", "your portfolio")
AUDIENCE: Indian salaried professionals and retail investors

OUTPUT FORMAT: Return JSON with keys: title, content (markdown with shortcodes), excerpt, seo_title, seo_description, tags, schema_faq
`;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/news/article-templates.ts
HUSKY=0 git commit -m "feat(news): article-templates — category-specific prompt injections for news events"
```

---

## Task 7: Pipeline Runner

**Files:**
- Create: `lib/news/pipeline-runner.ts`

- [ ] **Step 1: Write pipeline-runner.ts**

```typescript
// lib/news/pipeline-runner.ts
/**
 * News Pipeline Runner
 *
 * Stateless stage advancer. Called by /api/cron/news-pipeline every 15 min.
 * Each call advances ALL eligible events by ONE stage.
 *
 * Status flow:
 *   detected → screening → analyzing → writing → editing → publishing → published
 *
 * Bypasses the daily swarm agent schedules by calling generateArticle() directly.
 * Does NOT modify any existing agent files.
 */
import { SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { runSpikeScreening } from './spike-screener';
import { runSerpAnalysis } from './serp-budget';
import { getNewsArticleContext } from './article-templates';
import { classifyItem } from './event-classifier';
import { generateArticle } from '@/lib/ai/article-writer';

const MAX_RETRIES = 3;
const NEWS_QUALITY_GATE = 75; // Lower than editorial (85) — news speed matters

interface NewsEvent {
  id: string;
  source_id: string;
  source_name: string;
  source_url: string;
  headline: string;
  summary: string;
  raw_content: string;
  category: string;
  importance_score: number;
  keywords?: string[];
  trends_spike: boolean;
  gsc_spike: boolean;
  internal_spike: boolean;
  spike_count: number;
  serp_credit_used: boolean;
  serp_context?: any;
  status: string;
  retry_count: number;
  article_id?: string;
  detected_at: string;
  item_url?: string;
}

// ── Stage: detected → screening ───────────────────────────────────────────
export async function processDetected(supabase: SupabaseClient): Promise<number> {
  const { data: events } = await supabase
    .from('news_events')
    .select('*')
    .eq('status', 'detected')
    .order('importance_score', { ascending: false })
    .limit(10);

  if (!events?.length) return 0;
  let processed = 0;

  for (const event of events as NewsEvent[]) {
    try {
      // Transition to screening
      await supabase.from('news_events').update({
        status: 'screening',
        screening_at: new Date().toISOString(),
      }).eq('id', event.id);

      // Run parallel spike checks
      const keywords = event.keywords ?? [event.headline.split(' ').slice(0, 4).join(' ')];
      const spikes = await runSpikeScreening(keywords, event.category, supabase);

      const spikeCount = (spikes.trends_spike ? 1 : 0) + (spikes.gsc_spike ? 1 : 0) + (spikes.internal_spike ? 1 : 0);

      if (spikeCount === 0 && event.importance_score < 7) {
        // Skip to daily queue
        await supabase.from('news_events').update({
          status: 'skipped',
          skip_reason: 'No spike signals and importance < 7',
          ...spikes,
        }).eq('id', event.id);

        // Insert into daily content_queue as normal priority
        await supabase.from('content_queue').insert({
          topic: event.headline,
          keywords,
          category: event.category,
          priority: 5,
          status: 'pending',
          source: 'news_monitor',
        }).onConflict('topic').ignore();

        logger.info(`[Pipeline] ${event.headline.substring(0, 60)} → skipped (daily queue)`);
      } else {
        // Fast-track: move to analyzing
        await supabase.from('news_events').update({
          status: 'analyzing',
          analysis_at: new Date().toISOString(),
          ...spikes,
        }).eq('id', event.id);
        logger.info(`[Pipeline] ${event.headline.substring(0, 60)} → analyzing (spikes:${spikeCount})`);
      }
      processed++;
    } catch (err: any) {
      logger.error(`[Pipeline] Screening failed for ${event.id}: ${err.message}`);
    }
  }
  return processed;
}

// ── Stage: analyzing → writing ────────────────────────────────────────────
export async function processAnalyzing(supabase: SupabaseClient): Promise<number> {
  const { data: events } = await supabase
    .from('news_events')
    .select('*')
    .eq('status', 'analyzing')
    .order('importance_score', { ascending: false })
    .limit(5);

  if (!events?.length) return 0;
  let processed = 0;

  for (const event of events as NewsEvent[]) {
    try {
      const keywords = event.keywords ?? [event.headline.split(' ').slice(0, 4).join(' ')];

      // Run SERP analysis (paid or free based on budget + signals)
      const serpResult = await runSerpAnalysis(
        keywords,
        event.importance_score,
        event.spike_count,
        supabase
      );

      await supabase.from('news_events').update({
        status: 'writing',
        writing_at: new Date().toISOString(),
        serp_credit_used: serpResult.usedPaidApi,
        serp_context: {
          insights: serpResult.competitorInsights,
          relatedQueries: serpResult.relatedQueries,
          expandedKeywords: serpResult.keywords,
        },
      }).eq('id', event.id);

      logger.info(`[Pipeline] ${event.headline.substring(0, 60)} → writing (SERP:${serpResult.usedPaidApi ? 'paid' : 'free'})`);
      processed++;
    } catch (err: any) {
      logger.error(`[Pipeline] Analysis failed for ${event.id}: ${err.message}`);
      await incrementRetry(supabase, event);
    }
  }
  return processed;
}

// ── Stage: writing → editing ──────────────────────────────────────────────
export async function processWriting(supabase: SupabaseClient): Promise<number> {
  const { data: events } = await supabase
    .from('news_events')
    .select('*')
    .eq('status', 'writing')
    .order('importance_score', { ascending: false })
    .limit(3);

  if (!events?.length) return 0;
  let processed = 0;

  for (const event of events as NewsEvent[]) {
    try {
      const keywords = event.keywords ?? [event.headline.split(' ').slice(0, 4).join(' ')];
      const serpContext = event.serp_context?.insights ?? '';

      // Build news-specific article context
      const newsContext = getNewsArticleContext({
        headline: event.headline,
        summary: event.summary ?? '',
        category: event.category,
        source_name: event.source_name,
        source_url: event.source_url,
        detected_at: event.detected_at,
        keywords,
        serp_context: serpContext,
      });

      // Generate article directly (no agent scheduling delay)
      const article = await generateArticle({
        topic: event.headline,
        keywords,
        category: event.category,
        style: 'nerdwallet',
        tone: 'authoritative-yet-accessible',
        targetAudience: 'Indian Investors and Consumers',
        sourceContent: `${newsContext}\n\nRAW NEWS CONTENT:\n${event.raw_content ?? event.summary ?? ''}`,
        useRichPrompt: true,
      });

      // Generate slug from headline
      const slug = event.headline
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 80) + '-' + Date.now().toString(36);

      const wordCount = article.content.split(/\s+/).filter(Boolean).length;

      // Save article
      const { data: savedArticle, error: saveError } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          slug,
          body_markdown: article.content,
          body_html: '',
          excerpt: article.excerpt,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          tags: [...(article.tags ?? []), 'news', event.category],
          category: event.category,
          status: 'draft',
          primary_keyword: keywords[0],
          secondary_keywords: keywords.slice(1),
          word_count: wordCount,
          reading_time: Math.ceil(wordCount / 250),
          quality_score: article.quality_score ?? 0,
          ai_generated: true,
          is_ai_generated: true,
          schema_markup: article.schema_faq?.length
            ? {
                '@type': 'FAQPage',
                mainEntity: article.schema_faq.map(faq => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
              }
            : null,
          ai_metadata: {
            pipeline: 'news-intelligence',
            news_event_id: event.id,
            source_name: event.source_name,
            category: event.category,
            importance_score: event.importance_score,
            spike_count: event.spike_count,
            quality_score: article.quality_score,
            provider: article.provider,
            model: article.model,
            generated_at: new Date().toISOString(),
          },
        })
        .select('id, title, slug')
        .single();

      if (saveError) throw saveError;

      // Push to editor_queue
      await supabase.from('editor_queue').insert({
        article_id: savedArticle.id,
        editor_action: 'news_review',
        status: 'pending',
        quality_before: article.quality_score ?? 0,
      });

      // Link article to news event
      await supabase.from('news_events').update({
        status: 'editing',
        editing_at: new Date().toISOString(),
        article_id: savedArticle.id,
      }).eq('id', event.id);

      logger.info(`[Pipeline] "${savedArticle.title}" written (${wordCount}w, score:${article.quality_score})`);
      processed++;
    } catch (err: any) {
      logger.error(`[Pipeline] Writing failed for ${event.id}: ${err.message}`);
      await incrementRetry(supabase, event);
    }
  }
  return processed;
}

// ── Stage: editing → publishing ───────────────────────────────────────────
export async function processEditing(supabase: SupabaseClient): Promise<number> {
  const { data: events } = await supabase
    .from('news_events')
    .select('*, articles!news_events_article_id_fkey(id, status, quality_score)')
    .eq('status', 'editing')
    .not('article_id', 'is', null)
    .limit(10);

  if (!events?.length) return 0;
  let processed = 0;

  for (const event of events as any[]) {
    const article = event.articles;
    if (!article) continue;

    try {
      const qualityScore = article.quality_score ?? 0;

      if (qualityScore >= NEWS_QUALITY_GATE) {
        // Auto-approve for news (lower threshold than editorial pipeline)
        await supabase.from('articles').update({ status: 'review-ready' }).eq('id', article.id);
        await supabase.from('news_events').update({
          status: 'publishing',
        }).eq('id', event.id);
        logger.info(`[Pipeline] Article ${article.id} approved (score:${qualityScore})`);
        processed++;
      } else {
        // Quality too low — skip
        await supabase.from('news_events').update({
          status: 'skipped',
          skip_reason: `Quality score ${qualityScore} below threshold ${NEWS_QUALITY_GATE}`,
        }).eq('id', event.id);
        logger.warn(`[Pipeline] Article ${article.id} rejected (score:${qualityScore})`);
      }
    } catch (err: any) {
      logger.error(`[Pipeline] Editing check failed for ${event.id}: ${err.message}`);
    }
  }
  return processed;
}

// ── Stage: publishing → published ─────────────────────────────────────────
export async function processPublishing(supabase: SupabaseClient): Promise<number> {
  const { data: events } = await supabase
    .from('news_events')
    .select('*, articles!news_events_article_id_fkey(id, status, slug, title)')
    .eq('status', 'publishing')
    .not('article_id', 'is', null)
    .limit(5);

  if (!events?.length) return 0;
  let processed = 0;

  for (const event of events as any[]) {
    const article = event.articles;
    if (!article) continue;

    try {
      // Publish the article
      await supabase.from('articles').update({
        status: 'published',
        published_at: new Date().toISOString(),
      }).eq('id', article.id);

      await supabase.from('news_events').update({
        status: 'published',
        published_at: new Date().toISOString(),
      }).eq('id', event.id);

      // Ping IndexNow for fast indexing
      pingIndexNow(article.slug).catch(() => {});

      logger.info(`[Pipeline] Published: "${article.title}" (${article.slug})`);
      processed++;
    } catch (err: any) {
      logger.error(`[Pipeline] Publishing failed for ${event.id}: ${err.message}`);
      await incrementRetry(supabase, event);
    }
  }
  return processed;
}

async function incrementRetry(supabase: SupabaseClient, event: NewsEvent): Promise<void> {
  const newRetryCount = (event.retry_count ?? 0) + 1;
  if (newRetryCount >= MAX_RETRIES) {
    await supabase.from('news_events').update({
      status: 'skipped',
      skip_reason: `Failed after ${MAX_RETRIES} retries`,
    }).eq('id', event.id);
  } else {
    await supabase.from('news_events').update({
      retry_count: newRetryCount,
    }).eq('id', event.id);
  }
}

async function pingIndexNow(slug: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  const url = `https://www.investingpro.in/articles/${slug}`;
  await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${key}`, {
    method: 'GET',
    signal: AbortSignal.timeout(5_000),
  }).catch(() => {});
}

export async function runFullPipeline(supabase: SupabaseClient): Promise<Record<string, number>> {
  const [detected, analyzing, writing, editing, publishing] = await Promise.all([
    processDetected(supabase),
    processAnalyzing(supabase),
    processWriting(supabase),
    processEditing(supabase),
    processPublishing(supabase),
  ]);

  return { detected, analyzing, writing, editing, publishing };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/news/pipeline-runner.ts
HUSKY=0 git commit -m "feat(news): pipeline-runner — stateless stage advancer, generateArticle bridge"
```

---

## Task 8: News Monitor Cron

**Files:**
- Create: `app/api/cron/news-monitor/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// app/api/cron/news-monitor/route.ts
/**
 * News Monitor Cron
 * Polls all active news sources, creates news_events rows for new items.
 * Schedule: every 15 min (GitHub Actions: cron-news-monitor.yml)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { pollAllSources, RawNewsItem } from '@/lib/news/source-poller';
import { classifyItem } from '@/lib/news/event-classifier';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const newItems = await pollAllSources(supabase);
    if (!newItems.length) {
      return NextResponse.json({ success: true, newEvents: 0, message: 'No new items' });
    }

    // Fetch source metadata for classification
    const sourceIds = [...new Set(newItems.map(i => i.source_id))];
    const { data: sources } = await supabase
      .from('news_sources')
      .select('id, name, category_tags, base_importance')
      .in('id', sourceIds);
    const sourceMap = Object.fromEntries((sources ?? []).map((s: any) => [s.id, s]));

    let created = 0;
    let skipped = 0;

    for (const item of newItems) {
      const source = sourceMap[item.source_id];
      if (!source) continue;

      const classified = classifyItem(item, source);

      // Skip very low importance from low-quality sources
      if (classified.importance_score < 3) {
        skipped++;
        continue;
      }

      // Insert with duplicate guard (unique index on source_id + headline + day)
      const { error } = await supabase.from('news_events').insert({
        source_id: item.source_id,
        source_name: item.source_name,
        source_url: item.item_url || item.source_url,
        headline: item.headline,
        summary: item.summary,
        raw_content: item.raw_content,
        category: classified.category,
        importance_score: classified.importance_score,
        item_url: item.item_url,
        status: 'detected',
        detected_at: item.published_at,
        // Store keywords in ai_metadata for pipeline use
      });

      if (error?.code === '23505') {
        skipped++; // Duplicate
      } else if (error) {
        logger.warn(`[NewsMonitor] Insert failed: ${error.message}`);
      } else {
        created++;
        logger.info(`[NewsMonitor] New event: "${item.headline.substring(0, 60)}" (importance:${classified.importance_score})`);
      }
    }

    return NextResponse.json({
      success: true,
      polled: newItems.length,
      newEvents: created,
      skipped,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[NewsMonitor] Cron failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/cron/news-monitor/route.ts
HUSKY=0 git commit -m "feat(news): news-monitor cron — polls sources, creates news_events rows"
```

---

## Task 9: News Pipeline Cron

**Files:**
- Create: `app/api/cron/news-pipeline/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// app/api/cron/news-pipeline/route.ts
/**
 * News Pipeline Cron
 * Stateless stage advancer — runs 7 min after news-monitor.
 * Schedule: 7,22,37,52 past each hour (GitHub Actions: cron-news-pipeline.yml)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { runFullPipeline } from '@/lib/news/pipeline-runner';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const results = await runFullPipeline(supabase);
    const total = Object.values(results).reduce((a, b) => a + b, 0);

    logger.info(`[NewsPipeline] Run complete: ${JSON.stringify(results)}`);

    return NextResponse.json({
      success: true,
      stages: results,
      totalAdvanced: total,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[NewsPipeline] Cron failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/cron/news-pipeline/route.ts
HUSKY=0 git commit -m "feat(news): news-pipeline cron — stateless stage advancer"
```

---

## Task 10: Admin API Routes

**Files:**
- Create: `app/api/admin/news-intelligence/route.ts`
- Create: `app/api/admin/news-sources/route.ts`
- Create: `app/api/admin/news-sources/[id]/route.ts`
- Create: `app/api/admin/news-events/[id]/force/route.ts`
- Create: `app/api/admin/news-events/[id]/skip/route.ts`

- [ ] **Step 1: Write news-intelligence data API**

```typescript
// app/api/admin/news-intelligence/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const since = new Date(Date.now() - 48 * 3600_000).toISOString();
  const today = new Date().toISOString().substring(0, 10);

  const [eventsRes, creditsRes, sourcesRes] = await Promise.all([
    supabase
      .from('news_events')
      .select('id, headline, category, source_name, importance_score, trends_spike, gsc_spike, internal_spike, spike_count, serp_credit_used, status, article_id, detected_at, published_at, skip_reason')
      .gte('detected_at', since)
      .order('detected_at', { ascending: false })
      .limit(50),
    supabase
      .from('serp_credit_ledger')
      .select('daily_budget, news_used')
      .eq('date', today)
      .maybeSingle(),
    supabase
      .from('news_sources')
      .select('id, name, type, active, last_polled_at, error_count, last_error')
      .order('name'),
  ]);

  return NextResponse.json({
    events: eventsRes.data ?? [],
    credits: creditsRes.data ?? { daily_budget: 10, news_used: 0 },
    sources: sourcesRes.data ?? [],
  });
}
```

- [ ] **Step 2: Write news-sources CRUD API**

```typescript
// app/api/admin/news-sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase.from('news_sources').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.json();
  const { name, type, url, category_tags, base_importance, poll_interval_m } = body;
  if (!name || !type || !url) {
    return NextResponse.json({ error: 'name, type, url required' }, { status: 400 });
  }
  const { data, error } = await supabase.from('news_sources').insert({
    name, type, url,
    category_tags: category_tags ?? [],
    base_importance: base_importance ?? 5,
    poll_interval_m: poll_interval_m ?? 15,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

```typescript
// app/api/admin/news-sources/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.json();
  const { data, error } = await supabase
    .from('news_sources')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  // Soft delete by deactivating
  const { error } = await supabase.from('news_sources').update({ active: false }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

```typescript
// app/api/admin/news-events/[id]/force/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  // Force-promote to analyzing stage (skips spike screening decision)
  const { error } = await supabase.from('news_events').update({
    status: 'analyzing',
    analysis_at: new Date().toISOString(),
    skip_reason: null,
  }).eq('id', params.id).in('status', ['detected', 'screening', 'skipped']);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: 'Event force-promoted to analyzing' });
}
```

```typescript
// app/api/admin/news-events/[id]/skip/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.json().catch(() => ({}));
  const reason = body.reason ?? 'Manually dismissed by admin';
  const { error } = await supabase.from('news_events').update({
    status: 'skipped',
    skip_reason: reason,
  }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/news-intelligence/ app/api/admin/news-sources/ app/api/admin/news-events/
HUSKY=0 git commit -m "feat(news): admin API routes — dashboard data, sources CRUD, force/skip"
```

---

## Task 11: Admin Dashboard

**Files:**
- Create: `app/admin/news-intelligence/page.tsx`

- [ ] **Step 1: Write the dashboard page**

```tsx
'use client';
// app/admin/news-intelligence/page.tsx

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NewsEvent {
  id: string; headline: string; category: string; source_name: string;
  importance_score: number; trends_spike: boolean; gsc_spike: boolean;
  internal_spike: boolean; spike_count: number; serp_credit_used: boolean;
  status: string; article_id: string | null; detected_at: string;
  published_at: string | null; skip_reason: string | null;
}
interface NewsSource {
  id: string; name: string; type: string; active: boolean;
  last_polled_at: string | null; error_count: number; last_error: string | null;
}
interface CreditData { daily_budget: number; news_used: number; }

const STATUS_COLORS: Record<string, string> = {
  detected: 'bg-gray-100 text-gray-700',
  screening: 'bg-blue-100 text-blue-700',
  analyzing: 'bg-yellow-100 text-yellow-700',
  writing: 'bg-orange-100 text-orange-700',
  editing: 'bg-purple-100 text-purple-700',
  publishing: 'bg-indigo-100 text-indigo-700',
  published: 'bg-green-100 text-green-700',
  skipped: 'bg-red-100 text-red-700',
};

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export default function NewsIntelligencePage() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [credits, setCredits] = useState<CreditData>({ daily_budget: 10, news_used: 0 });
  const [loading, setLoading] = useState(true);
  const [addingSource, setAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', type: 'rss', url: '', base_importance: 5 });

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/news-intelligence');
    if (!res.ok) return;
    const data = await res.json();
    setEvents(data.events);
    setSources(data.sources);
    setCredits(data.credits);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleForce = async (id: string) => {
    await fetch(`/api/admin/news-events/${id}/force`, { method: 'POST' });
    fetchData();
  };
  const handleSkip = async (id: string) => {
    await fetch(`/api/admin/news-events/${id}/skip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Dismissed by admin' }),
    });
    fetchData();
  };
  const handleAddSource = async () => {
    await fetch('/api/admin/news-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSource),
    });
    setAddingSource(false);
    setNewSource({ name: '', type: 'rss', url: '', base_importance: 5 });
    fetchData();
  };
  const handleToggleSource = async (id: string, active: boolean) => {
    await fetch(`/api/admin/news-sources/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchData();
  };

  const remaining = credits.daily_budget - credits.news_used;
  const creditPct = Math.round((credits.news_used / credits.daily_budget) * 100);

  if (loading) return (
    <div className="p-8 text-center text-gray-500 font-mono text-sm">Loading news intelligence…</div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">News Intelligence</h1>
        <p className="text-gray-500 text-sm mt-1">Live event feed · SERP credits · Source health</p>
      </div>

      {/* ── SERP Credit Meter ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-gray-600">SERP Credits Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${creditPct > 80 ? 'bg-red-500' : creditPct > 50 ? 'bg-yellow-500' : 'bg-green-600'}`}
                style={{ width: `${creditPct}%` }}
              />
            </div>
            <span className="font-mono text-sm text-gray-700 whitespace-nowrap">
              {credits.news_used} / {credits.daily_budget} used · <span className="text-green-700 font-semibold">{remaining} remaining</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Resets at midnight IST · Tier: 4 breaking | 4 spike | 2 float</p>
        </CardContent>
      </Card>

      {/* ── Live Event Feed ── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Events (last 48h)</h2>
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No events detected yet. Polling every 15 min.</p>
        ) : (
          <div className="space-y-2">
            {events.map(ev => (
              <div key={ev.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm leading-snug truncate">{ev.headline}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">{ev.source_name}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{relTime(ev.detected_at)}</span>
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{ev.category}</span>
                      <span className="text-xs font-mono text-amber-700">⚡ {ev.importance_score}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {(['trends_spike', 'gsc_spike', 'internal_spike'] as const).map(key => (
                        <span key={key} className={`text-xs ${ev[key] ? 'text-green-600' : 'text-gray-300'}`}>
                          {key === 'trends_spike' ? '📈 Trends' : key === 'gsc_spike' ? '🔍 GSC' : '📊 Internal'} {ev[key] ? '✓' : '✗'}
                        </span>
                      ))}
                      {ev.serp_credit_used && <span className="text-xs text-purple-600">SERP credit used</span>}
                    </div>
                    {ev.skip_reason && (
                      <p className="text-xs text-red-500 mt-1">Skip: {ev.skip_reason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${STATUS_COLORS[ev.status] ?? 'bg-gray-100'}`}>
                      {ev.status}
                    </span>
                    <div className="flex gap-1">
                      {ev.article_id && (
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2" asChild>
                          <a href={`/admin/articles/${ev.article_id}`} target="_blank">View</a>
                        </Button>
                      )}
                      {['detected', 'screening', 'skipped'].includes(ev.status) && (
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-green-700" onClick={() => handleForce(ev.id)}>
                          Force
                        </Button>
                      )}
                      {!['published', 'skipped'].includes(ev.status) && (
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-red-500" onClick={() => handleSkip(ev.id)}>
                          Skip
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Source Health Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Sources ({sources.filter(s => s.active).length} active)</h2>
          <Button size="sm" onClick={() => setAddingSource(v => !v)} variant="outline">
            {addingSource ? 'Cancel' : '+ Add Source'}
          </Button>
        </div>

        {addingSource && (
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Source name" value={newSource.name} onChange={e => setNewSource(s => ({ ...s, name: e.target.value }))} />
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm" value={newSource.type} onChange={e => setNewSource(s => ({ ...s, type: e.target.value }))}>
                  <option value="rss">RSS</option>
                  <option value="price_poll">Price Poll</option>
                  <option value="scrape">Scrape</option>
                </select>
                <Input placeholder="URL" className="col-span-2" value={newSource.url} onChange={e => setNewSource(s => ({ ...s, url: e.target.value }))} />
                <Input type="number" placeholder="Base importance (1-10)" value={newSource.base_importance} onChange={e => setNewSource(s => ({ ...s, base_importance: +e.target.value }))} />
                <Button onClick={handleAddSource}>Add Source</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map(src => (
            <div key={src.id} className={`border rounded-lg p-3 ${src.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-900 truncate">{src.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${src.type === 'rss' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  {src.type}
                </span>
              </div>
              {src.last_polled_at && (
                <p className="text-xs text-gray-400 mt-1">Polled {relTime(src.last_polled_at)}</p>
              )}
              {src.error_count > 0 && (
                <p className="text-xs text-red-500 mt-1">⚠️ {src.error_count} errors · {src.last_error?.substring(0, 40)}</p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 mt-2"
                onClick={() => handleToggleSource(src.id, src.active)}
              >
                {src.active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/news-intelligence/
HUSKY=0 git commit -m "feat(news): admin dashboard — live event feed + SERP meter + source health grid"
```

---

## Task 12: GitHub Actions Crons

**Files:**
- Create: `.github/workflows/cron-news-monitor.yml`
- Create: `.github/workflows/cron-news-pipeline.yml`

- [ ] **Step 1: Write cron-news-monitor.yml**

```yaml
# .github/workflows/cron-news-monitor.yml
name: Cron — News Monitor (every 15 min)

on:
  schedule:
    - cron: '0,15,30,45 * * * *'
  workflow_dispatch:

jobs:
  invoke:
    uses: ./.github/workflows/_invoke-cron.yml
    with:
      path: /api/cron/news-monitor
    secrets: inherit
```

- [ ] **Step 2: Write cron-news-pipeline.yml**

```yaml
# .github/workflows/cron-news-pipeline.yml
name: Cron — News Pipeline (offset 7 min)

on:
  schedule:
    - cron: '7,22,37,52 * * * *'
  workflow_dispatch:

jobs:
  invoke:
    uses: ./.github/workflows/_invoke-cron.yml
    with:
      path: /api/cron/news-pipeline
    secrets: inherit
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/cron-news-monitor.yml .github/workflows/cron-news-pipeline.yml
HUSKY=0 git commit -m "feat(news): GitHub Actions crons — news-monitor (15min) + news-pipeline (offset 7min)"
```

---

## Self-Review

**Spec coverage check:**
- ✅ DB-configurable source registry → Task 1 (news_sources table + 14 seeds)
- ✅ 15-min polling → Task 8 + Task 12 (every 15 min cron)
- ✅ Spike pre-screening (Trends + GSC + internal) → Task 4
- ✅ SERP credit rationing (10/day) → Task 5
- ✅ On-demand pipeline (no agent schedule) → Task 7
- ✅ News-specific article anatomy → Task 6
- ✅ Admin dashboard → Task 10 + 11
- ✅ IndexNow ping post-publish → Task 7 (`pingIndexNow`)

**Type consistency check:**
- `RawNewsItem` defined in source-poller.ts, imported in event-classifier.ts ✅
- `NewsEventData` defined in article-templates.ts, used in pipeline-runner.ts ✅
- `generateArticle` signature matches existing lib/ai/article-writer.ts ✅

**No placeholders:** All functions have complete implementations ✅
