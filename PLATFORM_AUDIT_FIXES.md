# Platform Audit & Article Table Fixes

## Summary
Fixed the admin article table to display all metric columns that were previously "ghost" (existing in database but not visible in UI).

## Changes Made

### 1. API Client Updates (`lib/api-client.ts`)
- ✅ Added `includeAllStatuses` parameter to `Article.list()` method
- ✅ Added `Article.update()` method for updating articles
- ✅ Now fetches ALL articles for admin (not just published)

### 2. Admin Articles Page (`app/admin/articles/page.tsx`)
- ✅ Updated to fetch all articles using `includeAllStatuses: true`
- ✅ Fixed `handleDelete` to use Supabase client directly (removed undefined `articleService`)

### 3. DarkThemeCMS Component (`components/admin/DarkThemeCMS.tsx`)
- ✅ **Added new columns to table:**
  - **Views** - Article view count
  - **Quality Score** - 0-100 quality score with color-coded progress bar
  - **SEO Score** - 0-100 SEO score with color-coded progress bar
  - **Research** - Indicator if article has research data (editorial_notes, keywords)
  - **Trending** - Indicator if article is trending (recent + high views)

- ✅ **Enhanced Article Interface:**
  - Added all metric fields: `quality_score`, `seo_score`, `editorial_notes`, `primary_keyword`, `secondary_keywords`, `search_intent`, `difficulty_level`, `verified_by_expert`

- ✅ **Added Helper Functions:**
  - `getScoreColor()` - Color coding for scores (green ≥80, yellow ≥60, red <60)
  - `getScoreBgColor()` - Background colors for progress bars
  - `hasResearch()` - Checks if article has research data
  - `isTrending()` - Determines if article is trending

- ✅ **Added Metrics Summary Section:**
  - Average Quality Score across all articles
  - Average SEO Score across all articles
  - Count of articles with research
  - Count of trending articles

- ✅ **Improved Table Display:**
  - Increased minimum width to accommodate all columns
  - Added icons to column headers for better visual identification
  - Color-coded score displays with progress bars
  - Visual indicators for research and trending status

### 4. Database Migration (`supabase/migrations/20260125_ensure_article_metrics_columns.sql`)
- ✅ Created migration to ensure all required columns exist:
  - `quality_score` (INTEGER)
  - `seo_score` (INTEGER)
  - `editorial_notes` (JSONB)
  - `primary_keyword` (TEXT)
  - `secondary_keywords` (TEXT[])
  - `search_intent` (TEXT with CHECK constraint)
  - `difficulty_level` (TEXT with CHECK constraint)
  - `verified_by_expert` (BOOLEAN)
  - `published_at` (TIMESTAMP) - synced from `published_date` if needed

- ✅ Added indexes for performance:
  - `idx_articles_quality_score`
  - `idx_articles_seo_score`
  - `idx_articles_views`
  - `idx_articles_primary_keyword`

## Visual Improvements

### Score Display
- **Quality & SEO Scores:**
  - Displayed as numbers (0-100)
  - Color-coded: Green (≥80), Yellow (≥60), Red (<60)
  - Progress bar visualization below score
  - Shows "—" when score is missing

### Research Indicator
- Green icon badge when article has:
  - `editorial_notes` OR
  - `primary_keyword` OR
  - `secondary_keywords` array with items

### Trending Indicator
- Orange flame icon when article:
  - Has ≥50 views AND
  - Published within last 30 days

## Next Steps

1. **Run Migration:**
   ```sql
   -- Run in Supabase SQL Editor
   \i supabase/migrations/20260125_ensure_article_metrics_columns.sql
   ```

2. **Verify Data:**
   - Check if articles have `quality_score` and `seo_score` populated
   - If missing, run scoring scripts to populate:
     - `scripts/score-all-articles.ts`
     - `lib/quality/content-quality-scorer.ts`

3. **Test the UI:**
   - Navigate to `/admin/articles`
   - Verify all columns are visible
   - Check that scores display correctly
   - Verify research and trending indicators work

## Files Modified
- `lib/api-client.ts`
- `app/admin/articles/page.tsx`
- `components/admin/DarkThemeCMS.tsx`
- `supabase/migrations/20260125_ensure_article_metrics_columns.sql` (new)

## Files Created
- `PLATFORM_AUDIT_FIXES.md` (this file)
- `supabase/migrations/20260125_ensure_article_metrics_columns.sql`
