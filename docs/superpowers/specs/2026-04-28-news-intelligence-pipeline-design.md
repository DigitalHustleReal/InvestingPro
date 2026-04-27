# News Intelligence Pipeline — Design Spec
**Date:** 2026-04-28  
**Status:** Approved for implementation  
**Approach:** B — Priority lane in existing pipeline  
**Target latency:** ~30 min source-to-live for confirmed spike events

---

## 1. Problem

InvestingPro has a working daily content swarm (SENSE → SERP → GAP → WRITE → PUBLISH) but it runs on fixed schedules (2–10 AM IST). When a breaking personal finance event lands — DA hike, LPG price change, RBI rate cut, gold crossing ₹72,000 — the pipeline doesn't react. Competitors publish within minutes. InvestingPro publishes 12–20 hours later, after the search traffic peak has passed.

The fix is a **priority lane**: a news event detector that monitors all personal finance sources continuously, pre-screens for real search demand, and injects confirmed events into the existing agent pipeline on-demand rather than waiting for the next daily run.

---

## 2. Scope

### In scope
- DB-configurable source registry (RSS, price poll, scrape) — add sources from admin UI without code deploy
- 15-minute polling of all active sources
- Automated spike pre-screening: Google Trends India RSS + GSC impressions delta + internal traffic signal (all free)
- SERP credit rationing: 10 credits/day, tiered by event priority
- On-demand invocation of existing agents (SerpAnalystAgent, WriterAgent, EditorAgent, PublisherAgent) — no new agents
- News-specific article anatomy injected into WriterAgent prompt per event category
- Admin dashboard: live event feed + SERP credit meter + source health panel
- IndexNow ping + sitemap invalidation + Telegram/WhatsApp alert on publish

### Out of scope (future)
- Inngest event-driven architecture (deferred — Approach C)
- Automatic social posting of news articles (handled by existing DistributionAgent)
- Video/short-form content from news events
- Multi-language news articles (Phase 16 in masterplan)

---

## 3. Architecture

```
news_sources table (admin-configurable)
        ↓ polled every 15 min
/api/cron/news-monitor
        ↓ creates news_events row (status: detected)
Free spike pre-screen — parallel, ~2 min
  ├── Google Trends India RSS (geo=IN)
  ├── GSC impressions delta (existing OAuth)
  └── analytics_events internal traffic delta
        ↓
Decision gate
  ├── 2/3 signals → consume SERP credit → full SerpAnalystAgent
  ├── 1/3 signals → free sources only (autocomplete + DuckDuckGo)
  └── 0/3 signals → enqueue to daily content_queue, skip fast-track
        ↓
/api/cron/news-pipeline (every 15 min, stateless stage-advancer)
  ├── status: analyzing  → SerpAnalystAgent.executeForEvent(eventId)
  ├── status: writing    → WriterAgent.executeForEvent(eventId)
  ├── status: editing    → EditorAgent.executeForEvent(eventId)
  └── status: publishing → PublisherAgent.executeForEvent(eventId)
        ↓
Article live → IndexNow ping → sitemap revalidate → Telegram alert
```

**Key principle:** The pipeline cron is stateless. It reads `news_events` by current status and advances each one by one stage per run. Agents are called directly with event context, not via their scheduled cron routes.

---

## 4. Source Registry

Sources are stored in `news_sources` — not hardcoded. Any RSS feed, price API, or scrape endpoint can be added from the admin UI.

### Seed sources (loaded on migration, not hardcoded in app code)

| Source | Type | Category tags | Base importance |
|--------|------|---------------|-----------------|
| PIB RSS (Finance) | rss | budget, tax_change, da_announcement, pay_commission, pension, epfo | 8 |
| PIB RSS (Labour) | rss | epf, esic, gratuity, employment | 7 |
| PIB RSS (Commerce) | rss | gold, silver, import_duty, trade | 6 |
| RBI Press Releases RSS | rss | repo_rate, banking, monetary_policy, nbfc | 9 |
| SEBI Circulars RSS | rss | mutual_fund, securities, ipo, demat | 8 |
| IRDAI RSS | rss | insurance, health_insurance, term_insurance | 7 |
| AMFI Daily NAV | price_poll | mutual_fund | 4 |
| MCX Gold price | price_poll | gold, silver | 7 |
| IOCL Fuel prices | scrape | fuel_price, lpg, petrol, diesel | 8 |
| PPAC LPG prices | scrape | lpg, fuel_price | 8 |
| Economic Times Markets RSS | rss | general_finance, markets, banking | 6 |
| NDTV Profit RSS | rss | general_finance, markets | 5 |
| Moneycontrol Economy RSS | rss | general_finance, tax_change, banking | 5 |
| Livemint RSS | rss | general_finance, markets | 5 |
| Business Standard Economy RSS | rss | general_finance, banking | 5 |
| NSE NIFTY public API | price_poll | markets, nifty | 5 |
| USD/INR exchange rate | price_poll | forex, general_finance | 4 |
| Crude oil price API | price_poll | fuel_price, inflation | 6 |

### Event scoring

Final importance score = `base_importance` × category multiplier × recency multiplier

| Condition | Multiplier |
|-----------|-----------|
| Government source (RBI, SEBI, Ministry) | ×1.2 |
| Rate/price change > 2% | ×1.3 |
| Rate/price change > 5% | ×1.5 |
| Item published < 30 min ago | ×1.1 |
| Item published > 4 hr ago | ×0.7 |

Score ≥ 7 → fast-track pipeline  
Score 4–6 → fast-track only if 2/3 spike signals confirmed  
Score < 4 → daily content_queue, no fast-track

---

## 5. Spike Pre-screening

Three free checks run in parallel after event detection. Results stored on the `news_events` row.

### 5a. Google Trends India RSS
- Endpoint: `https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN`
- Parse: compare headline keywords against trending search titles
- Match algorithm: token overlap ≥ 2 significant terms → `trends_spike: true`
- Cost: zero — public RSS, no API key

### 5b. GSC Impressions Delta
- Uses existing Google OAuth tokens (stored from GSC setup)
- Query: impressions for category-related queries, last 48h vs prior 48h
- Threshold: >40% increase → `gsc_spike: true`
- Cost: free quota (Search Analytics API — 1,200 req/min, well within budget)
- Fallback: if OAuth token expired or GSC not connected → skip, treat as false

### 5c. Internal Traffic Signal
- Query `analytics_events` table: pageviews on category-related pages
- Window: last 6 hours vs prior 6 hours same day
- Related pages identified by: article tags + calculator slug pattern matching
- Threshold: >30% increase → `internal_spike: true`
- Cost: zero — own DB query

### Decision logic
```
spike_count = trends_spike + gsc_spike + internal_spike

if spike_count >= 2:
    use_serp_credit = true → SerpAnalystAgent with paid API
elif spike_count == 1:
    use_serp_credit = false → SerpAnalystAgent with free sources only
else:
    skip fast-track → INSERT into content_queue with priority = 'normal'
```

---

## 6. SERP Credit Rationing

### Daily budget: 10 credits, resets midnight IST

| Tier | Credits | Events |
|------|---------|--------|
| Breaking reserve | 4 | Importance score 9–10 (RBI rate, Union Budget, major tax change) |
| Spike confirmed | 4 | Score 7–8 with 2/3 signals (DA hike, fuel price, gold rate) |
| Float reserve | 2 | Unexpected high-priority events that would otherwise be blocked |

### Credit check before consuming
```
SELECT news_budget - news_used AS remaining
FROM serp_credit_ledger
WHERE date = current_date;

if remaining >= 1 AND (event.importance >= 7 OR spike_count >= 2):
    consume credit
    UPDATE serp_credit_ledger SET news_used = news_used + 1
else:
    proceed with free sources
```

### Free source fallback (no credit consumed)
- Google Autocomplete (unlimited)
- DuckDuckGo HTML top-10 scrape
- People Also Ask extraction from DuckDuckGo

Quality difference: free analysis captures keyword clusters but misses competitor deep-dive. Acceptable for score 4–6 events.

---

## 7. WriterAgent — News Event Context Injection

Each event category gets a structured context block injected into the WriterAgent system prompt:

### Article anatomy for news events

```
[MONO BADGE]  {CATEGORY} · {DATE}
[PLAYFAIR H1] {Headline: what changed + impact on reader's money}

[GOLD CALLOUT BOX]
What changed: {1-sentence factual summary with numbers}
Effective: {date}
Source: {official source name}

[DATA STRIP — monospace tabular]
Before: {value}
After:  {value}
Change: {delta + percentage}

[SECTION] What this means for your money
[SECTION] How to calculate your impact → {relevant calculator link}
[SECTION] What to do next (actionable: FD / SIP / loan prepay / insurance)
[SECTION] Related products affected → {link to listing page}

[SEBI DISCLAIMER — always present]
[ARTICLE SOURCES — official source cited]
```

### Category-specific context injections

| Category | Injected data |
|----------|--------------|
| `da_announcement` | Pay matrix levels 1–18, HRA impact, PF contribution change formula |
| `fuel_price` | Average monthly vehicle fuel cost, EMI impact table if crude-driven |
| `repo_rate` | FD rate historical correlation, home loan EMI change per ₹10L |
| `gold_silver` | SGB vs ETF vs physical comparison, import duty context |
| `tax_change` | Old vs new regime recalculation table, affected 80C/80D sections |
| `mutual_fund` | Affected fund categories, AMFI data link |
| `lpg` | Monthly household budget impact (assumes 2 cylinders/month) |
| `ipo` | GMP data, subscription status, InvestingPro review link |
| `insurance_regulation` | Premium impact estimate, IRDAI circular reference |

### Quality constraints on news articles
- Minimum 600 words (news flash format not used — quality over speed)
- Must include at least one internal calculator link
- Must include at least one internal product listing link
- EditorAgent checks: SEBI disclaimer present, no investment advice language, source cited
- Quality score gate: EditorAgent rejects if quality_score < 75

---

## 8. Database Schema

### `news_sources`
```sql
CREATE TABLE news_sources (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  type              text NOT NULL CHECK (type IN ('rss', 'price_poll', 'scrape')),
  url               text NOT NULL,
  category_tags     text[] NOT NULL DEFAULT '{}',
  base_importance   integer NOT NULL DEFAULT 5 CHECK (base_importance BETWEEN 1 AND 10),
  poll_interval_m   integer NOT NULL DEFAULT 15,
  active            boolean NOT NULL DEFAULT true,
  last_polled_at    timestamptz,
  last_item_hash    text,         -- dedup: SHA256 of last seen item
  error_count       integer NOT NULL DEFAULT 0,
  last_error        text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON news_sources(active, type, last_polled_at);
```

### `news_events`
```sql
CREATE TABLE news_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id         uuid REFERENCES news_sources(id),
  source_name       text NOT NULL,
  source_url        text NOT NULL,
  headline          text NOT NULL,
  summary           text,
  raw_content       text,
  category          text NOT NULL,
  importance_score  numeric(4,1) NOT NULL DEFAULT 5,

  -- Spike signals
  trends_spike      boolean NOT NULL DEFAULT false,
  gsc_spike         boolean NOT NULL DEFAULT false,
  internal_spike    boolean NOT NULL DEFAULT false,
  spike_count       integer GENERATED ALWAYS AS (
                      trends_spike::int + gsc_spike::int + internal_spike::int
                    ) STORED,
  serp_credit_used  boolean NOT NULL DEFAULT false,
  serp_analysis_id  uuid,         -- FK to serp_analyses once that table is confirmed

  -- Pipeline state
  status            text NOT NULL DEFAULT 'detected'
                    CHECK (status IN (
                      'detected','screening','analyzing',
                      'writing','editing','publishing','published','skipped'
                    )),
  skip_reason       text,
  article_id        uuid REFERENCES articles(id),

  -- Timing
  detected_at       timestamptz NOT NULL DEFAULT now(),
  screening_at      timestamptz,
  analysis_at       timestamptz,
  writing_at        timestamptz,
  editing_at        timestamptz,
  published_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON news_events(status, detected_at DESC);
CREATE INDEX ON news_events(category, importance_score DESC);
CREATE INDEX ON news_events(article_id) WHERE article_id IS NOT NULL;
```

### `serp_credit_ledger`
```sql
CREATE TABLE serp_credit_ledger (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date            date NOT NULL DEFAULT current_date UNIQUE,
  daily_budget    integer NOT NULL DEFAULT 10,
  news_used       integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budget_not_exceeded CHECK (news_used <= daily_budget)
);

-- Auto-insert today's row on first use
CREATE OR REPLACE FUNCTION ensure_credit_ledger_row()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO serp_credit_ledger (date)
  VALUES (current_date)
  ON CONFLICT (date) DO NOTHING;
END;
$$;
```

---

## 9. API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/cron/news-monitor` | GET | Poll all active sources, create news_events |
| `/api/cron/news-pipeline` | GET | Advance events through pipeline stages |
| `/api/admin/news-intelligence` | GET | Dashboard data (feed + credits + source health) |
| `/api/admin/news-sources` | GET/POST | List + create sources |
| `/api/admin/news-sources/[id]` | PATCH/DELETE | Edit + deactivate sources |
| `/api/admin/news-events/[id]/force` | POST | Force fast-track a queued event |
| `/api/admin/news-events/[id]/skip` | POST | Dismiss a false positive |

---

## 10. Admin Dashboard — `/admin/news-intelligence`

### Panel 1 — Live event feed (polls every 30s)
Displays `news_events` ordered by `detected_at DESC`, last 48h.

Each event card shows:
- Headline + category badge + source name
- Importance score (1–10)
- Spike signals: `GSC ✓/✗` · `Trends ✓/✗` · `Internal ✓/✗`
- SERP credit indicator: `credit used` or `free sources`
- Pipeline status with elapsed time
- Action buttons: `[View article]` (published) · `[View draft]` (writing/editing) · `[Force fast-track]` (queued) · `[Skip]`

### Panel 2 — SERP credit meter
Visual bar: `news_used / daily_budget` with tier breakdown.
Resets at midnight IST — countdown shown.

### Panel 3 — Source health grid
Each active source shows: name · type · last polled · items found last poll · error state.
`[+ Add source]` button opens inline form (name, type, URL, category tags, base importance, poll interval).

---

## 11. GitHub Actions Crons

Two new workflow files:

**`cron-news-monitor.yml`** — every 15 min, 24/7
```yaml
schedule:
  - cron: '*/15 * * * *'
# calls: GET /api/cron/news-monitor
```

**`cron-news-pipeline.yml`** — every 15 min, offset by 7 min
```yaml
schedule:
  - cron: '7,22,37,52 * * * *'
# calls: GET /api/cron/news-pipeline
# Offset from monitor so pipeline runs after fresh events land
```

Both use existing `_invoke-cron.yml` reusable workflow. `CRON_SECRET` already set.

---

## 12. File Map (new files only — zero existing files modified)

```
app/
  admin/news-intelligence/
    page.tsx                      — dashboard UI
  api/
    cron/
      news-monitor/route.ts       — polls sources, creates news_events
      news-pipeline/route.ts      — stage advancer (stateless)
    admin/
      news-intelligence/route.ts  — dashboard data API
      news-sources/route.ts       — CRUD for source registry
      news-sources/[id]/route.ts  — edit/delete single source
      news-events/[id]/
        force/route.ts            — force fast-track
        skip/route.ts             — dismiss event

lib/
  news/
    source-poller.ts              — polls RSS / price APIs / scrapes
    event-classifier.ts           — scores and categorises raw items
    spike-screener.ts             — parallel Trends + GSC + internal checks
    serp-budget.ts                — credit ledger read/write
    pipeline-runner.ts            — calls agents with event context
    article-templates.ts          — category-specific prompt injections

.github/workflows/
  cron-news-monitor.yml
  cron-news-pipeline.yml

supabase/migrations/
  20260428_news_intelligence_pipeline.sql  — 3 new tables + function + indexes
```

---

## 13. Error Handling & Resilience

- **Source polling failure:** `error_count++` on `news_sources`. After 5 consecutive errors, `active = false`, admin notified via agent_suggestions entry.
- **SERP credit exceeded:** Graceful fallback to free sources. Never blocks article generation.
- **WriterAgent failure:** `status = 'writing'` stays, next pipeline run retries. After 3 retries: `status = 'skipped'`, `skip_reason = 'writer_failed'`.
- **Duplicate detection:** SHA256 hash of `(source_id + headline)` checked before insert. Duplicate silently dropped.
- **GSC token expired:** `gsc_spike` treated as false. Pipeline continues without it.
- **Pipeline cron overlap:** Each status transition uses `UPDATE ... WHERE status = '{current}'` — atomic, race-condition-safe.

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| Source-to-live latency | < 35 min for score ≥ 7 events |
| SERP credits wasted (no publish) | < 10% |
| False positive rate (events skipped after credit consumed) | < 5% |
| Article quality score (EditorAgent) | ≥ 75/100 |
| Source polling uptime | > 98% |
| GSC impressions on news articles (7-day) | Measurable within 2 weeks of launch |

---

*Spec authored: 2026-04-28. Approved by: Shiv. Ready for implementation planning.*
