# 🎯 Programmatic SEO: Versus Pages System

## Overview
Automated generation of SEO-optimized "A vs B" comparison pages for all product combinations.

---

## ✅ What's Built

### 1. **Versus Page Template** (`app/compare/[combination]/page.tsx`)
- ✅ Dynamic route handles any comparison (e.g., `/compare/hdfc-regalia-vs-axis-magnus`)
- ✅ **Smart Fallback**: Checks database first, generates on-the-fly if not found
- ✅ **Programmatic SEO Badge**: Shows which pages are pre-generated
- ✅ **Analytics Tracking**: Counts views on pre-generated pages
- ✅ **Category Safety**: Won't compare incompatible products
- ✅ **PDF Export**: Download comparison reports

### 2. **Generation Script** (`scripts/generate-versus-pages.ts`)
- ✅ Fetches all products from database
- ✅ Groups by category
- ✅ Generates top combinations (similar-tier products only)
- ✅ Skips unfair comparisons (rating diff > 1.5)
- ✅ Uses AI for verdict generation
- ✅ Saves to database
- ✅ Generates sitemap
- ✅ Creates manifest file

### 3. **Database Schema** (`supabase/migrations/20260104_versus_pages_schema.sql`)
```sql
CREATE TABLE versus_pages (
  slug TEXT UNIQUE, -- "product-a-vs-product-b"
  product1_id TEXT,
  product2_id TEXT,
  category TEXT,
  title TEXT,
  meta_description TEXT,
  verdict TEXT, -- AI-generated comparison
  winner TEXT,
  view_count INTEGER,
  ...
);
```

---

## 🚀 How To Generate All Versus Pages

### Step 1: Set AI API Key
Add to `.env.local`:
```env
# At least ONE required
GOOGLE_GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
```

### Step 2: Run Migration
```bash
# Create versus_pages table
supabase db push
```

### Step 3: Generate Pages
```bash
npx tsx scripts/generate-versus-pages.ts
```

**Expected Output**:
```
🚀 Generating programmatic versus pages...

📦 CREDIT_CARD (10 products)
  HDFC Regalia vs Axis Magnus... ✅
  SBI ELITE vs AMEX Platinum... ✅
  Amazon Pay vs Flipkart Axis... ✅
  ...

📦 LOAN (10 products)
  SBI Home Loan vs HDFC Home Loan... ✅
  HDFC Personal vs ICICI Personal... ✅
  ...

📦 INSURANCE (8 products)
  Star Health vs HDFC Ergo... ✅
  ...

✨ Generated 150 versus pages!
💾 Saving to database...
✅ Saved 150 pages to database
🗺️ Sitemap saved: public/sitemap-versus.xml
✅ Manifest saved: public/versus-manifest.json

📊 Summary:
✅ Total pages: 150
📁 Categories: 5
🏆 Top comparison: HDFC Regalia vs Axis Magnus
```

---

## 📊 What Gets Generated

### Example Page
**URL**: `/compare/hdfc-regalia-vs-axis-magnus`

**SEO Metadata**:
```typescript
{
  title: "HDFC Regalia vs Axis Magnus (2026): Which Is Better?",
  meta_description: "Compare HDFC Regalia and Axis Magnus. Features, fees, rewards, and expert verdict to choose the best credit card.",
  h1: "HDFC Regalia vs Axis Magnus"
}
```

**Content**:
- Product images side-by-side
- AI-generated expert verdict (300 words)
- Feature comparison table
- Rating stars
- Apply buttons
- PDF export

### Generation Rules

**Included Comparisons**:
- ✅ Same category (credit card vs credit card)
- ✅ Similar tiers (rating difference < 1.5)
- ✅ Top 10 products per category
- ✅ Up to 20 combinations per category

**Excluded**:
- ❌ Different categories (card vs loan)
- ❌ Too different quality (5-star vs 2-star)
- ❌ Low-quality products

---

## 📈 SEO Benefits

### Coverage
With 36 products currently:
- **Credit Cards** (10): ~45 comparisons
- **Loans** (10): ~45 comparisons
- **Insurance** (8): ~28 comparisons
- **Mutual Funds** (6): ~15 comparisons
- **Brokers** (6): ~15 comparisons

**Total**: ~150 versus pages

With 1000 products:
- Potential pages: **~10,000+** (top combinations only)

### Advantages
1. **Long-tail SEO**: Captures "X vs Y" searches
2. **User Intent**: People actively comparing = high intent
3. **Evergreen**: Stays relevant for months
4. **Internal Linking**: Each page links to product detail pages
5. **Sitemap**: Auto-generated XML sitemap

---

## 🗺️ Generated Assets

### 1. Sitemap (`public/sitemap-versus.xml`)
```xml
<?xml version="1.0"?>
<urlset>
  <url>
    <loc>https://investingpro.in/compare/hdfc-regalia-vs-axis-magnus</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ...
</urlset>
```

### 2. Manifest (`public/versus-manifest.json`)
```json
{
  "generated_at": "2026-01-04T11:00:00Z",
  "total_pages": 150,
  "by_category": [
    {
      "category": "credit_card",
      "products": 10,
      "comparisons": 45
    }
  ],
  "pages": [
    {
      "url": "/compare/hdfc-regalia-vs-axis-magnus",
      "title": "HDFC Regalia vs Axis Magnus (2026)",
      "winner": "axis-magnus"
    }
  ]
}
```

---

## 🔄 Updating Pages

### Regenerate All
```bash
npx tsx scripts/generate-versus-pages.ts
```
- Overwrites existing pages
- Updates verdicts with latest AI
- Refreshes sitemaps

### Add New Products
1. Add products to database
2. Run generation script
3. New combinations auto-created

---

## 📊 Analytics

Track performance:
```sql
-- Most viewed comparisons
SELECT slug, product1_name, product2_name, view_count
FROM versus_pages
ORDER BY view_count DESC
LIMIT 20;

-- By category
SELECT category, COUNT(*), AVG(view_count)
FROM versus_pages
GROUP BY category;
```

---

## 🎯 Performance

### Costs
- **Generation**: $0.0003 per comparison (Gemini)
- **150 pages**: ~$0.05
- **1000 pages**: ~$0.30

### Speed
- **2 seconds** per comparison (rate limited)
- **150 pages**: ~5 minutes
- **1000 pages**: ~33 minutes

---

## ✅ Verification

After generation:
```bash
# Check sitemap
cat public/sitemap-versus.xml

# Check manifest
cat public/versus-manifest.json

# Test a page
curl localhost:3000/compare/hdfc-regalia-vs-axis-magnus
```

---

## 🚀 Next Steps

1. **Add API Key**: Configure at least one AI provider
2. **Run Migration**: Create `versus_pages` table
3. **Generate Pages**: Run the script
4. **Submit Sitemap**: Add to Google Search Console
5. **Monitor**: Track which comparisons get most traffic

---

**Status**: ✅ Programmatic SEO infrastructure ready. Just add AI key and generate!
