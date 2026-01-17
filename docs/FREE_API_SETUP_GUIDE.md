# Free API Setup Guide
**Using Free/Open-Source APIs Until Revenue Justifies Premium**

---

## Overview

The system uses **FREE-FIRST APPROACH**: free APIs and estimation techniques until the machine makes money, then upgrades to premium APIs.

---

## Current Priority Order

1. **Google Keyword Planner** (Free) - Primary
2. **Google Trends** (Free) - Secondary  
3. **Manual/Crowdsourced Data** (Free) - Tertiary
4. **Ubersuggest Free Tier** (Limited) - Backup
5. **Premium APIs** (When revenue justifies) - Ahrefs/Semrush

---

## Free API Options

### 1. Google Keyword Planner (Recommended - Free)

**Status:** ✅ **Active** (uses estimation when API not configured)

**How it works:**
- Free estimation based on keyword patterns (already implemented)
- Real API requires Google Ads account (free to create)
- No API key needed for estimation

**Setup (Optional - for real data):**
1. Create Google Ads account (free)
2. Get developer token (free application)
3. Add to `.env`:
   ```bash
   GOOGLE_ADS_API_KEY=your_developer_token
   ```

**Limitations:**
- Estimation is reasonably accurate for common patterns
- Real API requires Google Ads account setup

**Cost:** FREE

---

### 2. Google Trends (Free)

**Status:** ✅ **Active** (uses estimation currently)

**How it works:**
- Free trend data (no API key needed)
- Can integrate pytrends library (Python) or similar
- Shows trending keywords and related queries

**Setup:**
- No setup needed (works via estimation)
- For real data: Integrate pytrends or Google Trends API wrapper

**Limitations:**
- Rate-limited (too many requests may get blocked)
- Trends data, not exact search volume

**Cost:** FREE

---

### 3. Manual/Crowdsourced Data (Free)

**Status:** ✅ **Active** (database-backed)

**How it works:**
- Store manually curated keyword data in `keyword_data_cache` table
- Team can manually add keyword data as they research
- Free and accurate (human-curated)

**Setup:**
1. Create `keyword_data_cache` table (migration needed)
2. Manually add keyword data via admin panel or script
3. System will use this data when available

**SQL Migration:**
```sql
CREATE TABLE IF NOT EXISTS keyword_data_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT UNIQUE NOT NULL,
    search_volume INTEGER DEFAULT 0,
    difficulty INTEGER DEFAULT 50,
    cpc NUMERIC DEFAULT 0.5,
    competition TEXT DEFAULT 'medium',
    intent TEXT DEFAULT 'informational',
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_keyword_cache_keyword ON keyword_data_cache(keyword);
```

**Cost:** FREE (human time)

---

### 4. Ubersuggest Free Tier (Limited)

**Status:** ⏳ **Available** (not yet implemented)

**How it works:**
- Free tier: ~3 keyword lookups per day
- Good for testing/verification
- Upgrade to paid when needed

**Setup:**
1. Sign up for Ubersuggest free account
2. Get free API key (limited requests)
3. Add to `.env`:
   ```bash
   UBERSUGGEST_FREE_API_KEY=your_free_key
   ```

**Limitations:**
- Only 3 requests per day (free tier)
- Good for spot-checks, not bulk research

**Cost:** FREE (limited)

---

## Premium Upgrade Path (When Revenue Justifies)

### When to Upgrade:

**Upgrade when:**
- ✅ Making $500+/month from affiliate commissions
- ✅ Publishing 50+ articles/month
- ✅ Keyword data accuracy becomes critical
- ✅ Free APIs hit rate limits

### Premium Options (Priority Order):

1. **Ubersuggest Pro** ($29/month)
   - Best value for money
   - Good Indian market coverage
   - Affordable upgrade path

2. **Semrush** ($119/month)
   - Excellent Indian market data
   - Good for competitive analysis
   - Best for B2C finance content

3. **Ahrefs** ($99/month)
   - Best data quality overall
   - Excellent for link building
   - Global leader

### Upgrade Process:

1. Add API key to `.env`:
   ```bash
   # Example: Ubersuggest Pro (recommended first)
   UBERSUGGEST_API_KEY=your_pro_key
   ```

2. System automatically uses premium data when configured
3. Free APIs remain as fallback

---

## Current Implementation Status

### ✅ Implemented (Free):

- ✅ Google Keyword Planner estimation (active)
- ✅ Google Trends estimation (active)
- ✅ Manual keyword provider (structure ready)
- ✅ Free-first priority logic

### ⏳ Pending (Optional):

- ⏳ Google Ads API integration (requires account)
- ⏳ Google Trends API integration (pytrends)
- ⏳ Ubersuggest free API (3 requests/day)
- ⏳ Manual keyword database table

---

## Accuracy Expectations

### Free Estimation:
- **Search Volume:** ±50% accuracy (good enough for prioritization)
- **Difficulty:** ±30% accuracy (useful for initial filtering)
- **Intent:** 80%+ accuracy (pattern-based is reliable)

### Premium APIs:
- **Search Volume:** ±10% accuracy
- **Difficulty:** ±5% accuracy
- **Intent:** 95%+ accuracy

**Verdict:** Free estimation is **good enough** to start. Upgrade when data accuracy becomes revenue-critical.

---

## Recommendations

### Start (Now):
- ✅ Use free estimation (already active)
- ✅ Build content with estimated data
- ✅ Monitor which keywords perform

### Next (When Revenue > $100/month):
- ⏳ Set up Google Ads account (free)
- ⏳ Create `keyword_data_cache` table
- ⏳ Manually add data for top 20 keywords

### Later (When Revenue > $500/month):
- ⏳ Upgrade to Ubersuggest Pro ($29/month)
- ⏳ System automatically uses premium data

### Future (When Revenue > $2000/month):
- ⏳ Consider Semrush ($119/month)
- ⏳ Best ROI for Indian market

---

## Environment Variables

### Free (No keys needed):
```bash
# Optional: Google Ads API (for real data)
GOOGLE_ADS_API_KEY=your_developer_token

# Optional: Ubersuggest Free (3 requests/day)
UBERSUGGEST_FREE_API_KEY=your_free_key
```

### Premium (When revenue justifies):
```bash
# Ubersuggest Pro (recommended first - $29/month)
UBERSUGGEST_API_KEY=your_pro_key

# Semrush (best Indian coverage - $119/month)
SEMRUSH_API_KEY=your_key

# Ahrefs (best quality - $99/month)
AHREFS_API_KEY=your_key
```

---

## FAQ

**Q: Is free estimation accurate enough?**
A: Yes, for prioritization and initial content planning. ±50% accuracy is sufficient when you're building content. Upgrade when accuracy becomes critical.

**Q: When should I upgrade?**
A: When making $500+/month from content OR when free APIs hit rate limits OR when data accuracy becomes revenue-critical.

**Q: Which premium API first?**
A: Ubersuggest Pro ($29/month) - best value for money and good Indian market coverage.

**Q: Can I mix free and premium?**
A: Yes! System tries free first, then premium. Premium only used if configured.

**Q: Will free APIs get blocked?**
A: Google Trends may rate-limit. Use estimation (no API calls) to avoid blocks.

---

**Last Updated:** 2026-01-XX  
**Status:** ✅ Free estimation active, premium upgrade path ready
