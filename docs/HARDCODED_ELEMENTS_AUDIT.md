# 🔍 Hardcoded Elements Audit

**Date:** January 13, 2026  
**Purpose:** Identify static/hardcoded content that should be dynamic (CMS, database, or config-driven)  
**Priority:** HIGH - Affects content management and scalability

---

## 📊 Summary

| Category | Count | Priority | Impact |
|----------|-------|----------|--------|
| **Hero Carousel Slides** | 6 slides | 🔴 HIGH | Homepage messaging |
| **Calculator Presets** | 4 presets | 🟡 MEDIUM | User experience |
| **Category Lists** | 9 categories | 🔴 HIGH | Navigation structure |
| **Tool Lists** | 4 tools | 🟡 MEDIUM | Feature discovery |
| **Risk Profiler Questions** | 6 questions | 🟡 MEDIUM | User assessment |
| **Stats/Numbers** | 10+ values | 🔴 HIGH | Social proof |
| **Page-Specific Slides** | 3+ sets | 🟡 MEDIUM | Category pages |
| **Hardcoded Text** | 50+ strings | 🟡 MEDIUM | Content updates |
| **Mock Product Data** | 3+ arrays | 🔴 HIGH | Development only |
| **News Items** | 4 items | 🟡 MEDIUM | Should be API-driven |
| **Risk Profile Definitions** | 4 profiles | 🟡 MEDIUM | Business logic |

---

## 🔴 CRITICAL: High-Priority Hardcoded Elements

### 1. Hero Carousel Slides
**File:** `components/home/HeroSection.tsx`  
**Lines:** 14-75  
**Issue:** 6 hardcoded hero slides with static content

**Current:**
```tsx
const HERO_SLIDES = [
    {
        id: "all",
        badge: "Independent • Unbiased • Expert-Reviewed",
        headline: "Find Your Perfect Financial Product",
        highlight: "In 30 Seconds",
        desc: `Compare ${STAT_STRINGS.coverage} — find the best match for your needs.`,
        // ... static CTAs, icons, gradients
    },
    // ... 5 more slides
];
```

**Should Be:**
- Stored in CMS (`hero_slides` table)
- Managed via admin panel
- A/B testable
- Scheduled/published dates
- Category-specific targeting

**Impact:** Cannot update hero messaging without code deployment

---

### 2. Platform Statistics
**File:** `lib/constants/platform-stats.ts`  
**Issue:** Hardcoded user metrics, ratings, product counts

**Current:**
```ts
export const PLATFORM_STATS = {
  usersHelped: '2.1M+',
  productsTracked: '500+',
  banksPartnered: '50+',
  rating: '4.9',
  // ... all hardcoded
}
```

**Should Be:**
- Calculated from database (aggregate queries)
- Real-time or cached (updated daily)
- Admin-configurable overrides
- Historical tracking

**Impact:** Stats become outdated, requires code changes to update

---

### 3. Category Discovery Grid
**File:** `components/home/CategoryDiscovery.tsx`  
**Lines:** 18-73  
**Issue:** 9 hardcoded category cards

**Current:**
```tsx
const categories = [
    {
        title: "Credit Cards",
        icon: CreditCard,
        description: "Compare reward rates, cashback & fees",
        href: "/credit-cards"
    },
    // ... 8 more hardcoded
];
```

**Should Be:**
- From `categories` table in database
- Order managed via admin (drag-drop)
- Featured/priority flags
- Dynamic icons (from category metadata)

**Impact:** Cannot add/remove/reorder categories without code changes

---

### 4. Navigation Configuration
**File:** `lib/navigation/config.ts` (if exists)  
**Issue:** Navigation structure hardcoded

**Should Be:**
- Database-driven navigation
- Admin-manageable menu structure
- Dynamic category/intent/collection hierarchy
- A/B testable menu items

**Impact:** Navigation changes require developer

---

## 🟡 MEDIUM: Calculator & Tool Presets

### 5. SIP Calculator Presets
**File:** `components/calculators/SIPCalculatorWithInflation.tsx`  
**Lines:** 358-363  
**Issue:** 4 hardcoded preset scenarios

**Current:**
```tsx
{[
    { label: "₹10L Investment", monthlyInvestment: 1000000, years: 10, return: 12 },
    { label: "Short Term", monthlyInvestment: 500000, years: 5, return: 10 },
    { label: "Long Term", monthlyInvestment: 2000000, years: 15, return: 12 },
    { label: "High Return", monthlyInvestment: 1000000, years: 10, return: 15 },
]}
```

**Should Be:**
- From `calculator_presets` table
- Admin-configurable
- Category-specific presets
- User-saved presets

**Impact:** Cannot customize calculator examples per user segment

---

### 6. Risk Profiler Questions
**File:** `app/risk-profiler/page.tsx`  
**Lines:** 27-88  
**Issue:** 6 hardcoded questions with static options

**Current:**
```tsx
const questions = [
    {
        id: 1,
        question: "What is your investment experience?",
        options: [
            { label: "Just starting out", value: 0 },
            // ... hardcoded options
        ]
    },
    // ... 5 more questions
];
```

**Should Be:**
- From `risk_profiler_questions` table
- Admin-editable questions
- Dynamic scoring weights
- Multi-language support
- Question variants for A/B testing

**Impact:** Cannot update risk assessment without code changes

---

### 7. Featured Tools List
**File:** `components/home/FeaturedTools.tsx`  
**Lines:** 7-44  
**Issue:** 4 hardcoded tool cards

**Current:**
```tsx
const tools = [
    {
        name: "SIP Analytics",
        description: "Project multi-year wealth growth...",
        icon: Calculator,
        href: "/calculators"
    },
    // ... 3 more hardcoded
];
```

**Should Be:**
- From `featured_tools` table
- Admin-manageable
- Priority/order configurable
- Analytics-driven (most used tools)
- Personalized per user

**Impact:** Cannot promote new tools or reorder without code

---

## 🟡 MEDIUM: Page-Specific Content

### 8. Mutual Funds Page Slides
**File:** `app/mutual-funds/page.tsx`  
**Lines:** 57-85  
**Issue:** 3 hardcoded category hero slides

**Current:**
```tsx
const MF_SLIDES = [
    {
        id: '1',
        title: "Top Rated Mutual Funds",
        subtitle: "High Growth",
        description: "Discover funds that have consistently beaten...",
        // ... hardcoded
    },
    // ... 2 more
];
```

**Should Be:**
- From `category_hero_slides` table
- Per-category configuration
- Admin-editable
- Dynamic based on trending products

**Impact:** Each category page needs code changes for hero updates

---

### 9. Fund Categories Filter
**File:** `app/mutual-funds/page.tsx`  
**Line:** 42  
**Issue:** Hardcoded category filter list

**Current:**
```tsx
const FUND_CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "ELSS", "Index"];
```

**Should Be:**
- From database (distinct categories from funds table)
- Dynamic based on available funds
- Admin-configurable display order

**Impact:** New fund categories won't appear in filter

---

### 10. Risk Level Colors Mapping
**File:** `app/mutual-funds/page.tsx`  
**Lines:** 44-51  
**Issue:** Hardcoded risk level → color mapping

**Current:**
```tsx
const riskColors: Record<string, string> = {
    "Low": "bg-success-50 text-success-700 border-success-100",
    "Moderate": "bg-secondary-50 text-secondary-700 border-secondary-100",
    // ... hardcoded mappings
};
```

**Should Be:**
- From design system config
- Theme-aware
- Centralized in Tailwind config
- Admin-overridable per category

**Impact:** Risk level styling changes require code updates

---

## 🟡 MEDIUM: Text & Copy

### 11. Hardcoded Comparison Numbers
**Found In:**
- `components/home/HeroSection.tsx`: "100+ cards", "25+ insurers", "50+ banks", "50+ calculators"
- Various product pages: "Compare X products"

**Issue:** Numbers become outdated as product catalog grows

**Should Be:**
- Calculated: `SELECT COUNT(*) FROM products WHERE category = 'credit_card'`
- Cached with TTL
- Real-time or near-real-time updates

**Impact:** Misleading user expectations if numbers are wrong

---

### 12. Badge Text
**Found In:**
- "Independent • Unbiased • Expert-Reviewed"
- "Rewards • Cashback • Lounge Access"
- "Term Life • Health • Motor"

**Issue:** Marketing copy hardcoded in components

**Should Be:**
- From CMS content blocks
- Per-category badges
- Admin-editable
- A/B testable

**Impact:** Marketing messaging changes require developer

---

### 13. CTA Button Text
**Found In:**
- "Compare Cards", "Check Eligibility", "Start Investing"
- Various CTAs across hero slides and pages

**Issue:** Call-to-action text hardcoded

**Should Be:**
- From CMS (`cta_variants` table)
- A/B testable
- Context-aware (user segment, page type)
- Analytics-driven optimization

**Impact:** Cannot optimize conversion without code changes

---

### 14. Calculator Descriptions
**Found In:**
- "Calculate returns on systematic investment plan with inflation adjustment"
- Various calculator page descriptions

**Issue:** Feature descriptions hardcoded

**Should Be:**
- From CMS articles or `calculator_metadata` table
- SEO-optimized per calculator
- Admin-editable

**Impact:** SEO and feature updates require code changes

---

### 15. Mock Product Data (Development Only) ⚠️
**File:** `lib/data.ts`  
**Lines:** 3-175  
**Issue:** Hardcoded credit cards and loans arrays (3+ products)

**Current:**
```tsx
export const CREDIT_CARDS: CreditCard[] = [
    {
        id: "cc_hdfc_regalia_gold",
        slug: "hdfc-regalia-gold",
        name: "HDFC Regalia Gold",
        provider: "HDFC Bank",
        rating: 4.8,
        reviewsCount: 1250,
        // ... full product data hardcoded
    },
    // ... 2 more credit cards
];

export const LOANS: Loan[] = [
    // ... hardcoded loan data
];
```

**Should Be:**
- ✅ Already using database (`products` table) for production
- ⚠️ This file should be:
  - Removed, OR
  - Moved to `lib/data.dev.ts` with `DEV_ONLY` flag
  - Clearly documented as mock data
- Used only for development/testing/Storybook

**Impact:** 
- Risk of using mock data in production
- Confusion between mock and real data
- Maintenance burden (duplicate data)

**Action:** Mark file as `DEV_ONLY` or remove entirely

---

### 16. News Sentiment Items 🔴
**File:** `components/home/NewsSentiment.tsx`  
**Lines:** 8-45  
**Issue:** 4 hardcoded news items with fake data

**Current:**
```tsx
const newsItems = [
    {
        id: 1,
        source: "Bloomberg",
        title: "RBI Holds Repo Rate at 6.5%, Focuses on Inflation Control",
        time: "2h ago", // Hardcoded
        sentiment: "positive",
        score: 0.85,
        tag: "Economy"
    },
    // ... 3 more fake news items
];
```

**Should Be:**
- From news API integration (NewsAPI, Alpha Vantage, etc.)
- Real-time financial news feed
- Sentiment analysis via AI (OpenAI/Anthropic)
- Cached with 15-minute TTL
- Fallback to "No news available" if API fails

**Impact:** 
- Shows fake/stale news to users
- Misleading information
- Bad user trust
- Legal risk if news is inaccurate

**Priority:** HIGH - Remove fake news immediately

---

### 18. Calculator Badge Text
**File:** `components/calculators/SIPCalculatorWithInflation.tsx`  
**Lines:** 165-171  
**Issue:** Hardcoded "Free" and "No Registration" badges

**Current:**
```tsx
<Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100">
    <CheckCircle2 className="w-3 h-3 mr-1" /> Free
</Badge>
<Badge variant="secondary" className="bg-secondary-50 text-secondary-700 border-secondary-200 hover:bg-secondary-100 text-[10px]">
    No Registration
</Badge>
```

**Should Be:**
- From calculator metadata table
- Per-calculator badges
- Admin-configurable
- A/B testable (e.g., "Free" vs "No Signup Required")

**Impact:** Cannot customize messaging per calculator

---

### 19. Tax Savings Amount
**File:** `app/mutual-funds/page.tsx`  
**Line:** 70  
**Issue:** Hardcoded "Save ₹46,800"

**Current:**
```tsx
subtitle: "Save ₹46,800",
```

**Should Be:**
- Calculated: Max tax savings under Section 80C (₹1.5L × 31% = ₹46,500)
- Or from config/env variable
- Updated annually with tax rate changes

**Impact:** Tax amount becomes outdated if tax rates change

---

## 📊 Complete Hardcoded Elements List

### By File:

| File | Hardcoded Elements | Count | Priority |
|------|-------------------|-------|----------|
| `components/home/HeroSection.tsx` | Hero slides | 6 | 🔴 HIGH |
| `components/home/CategoryDiscovery.tsx` | Category cards | 9 | 🔴 HIGH |
| `components/home/FeaturedTools.tsx` | Tool cards | 4 | 🟡 MEDIUM |
| `components/home/NewsSentiment.tsx` | News items | 4 | 🔴 HIGH |
| `components/calculators/SIPCalculatorWithInflation.tsx` | Presets, badges | 6 | 🟡 MEDIUM |
| `app/risk-profiler/page.tsx` | Questions, profiles | 10+ | 🟡 MEDIUM |
| `app/mutual-funds/page.tsx` | Slides, categories, tax amount | 5 | 🟡 MEDIUM |
| `lib/constants/platform-stats.ts` | All stats | 10+ | 🔴 HIGH |
| `lib/data.ts` | Mock products | 3+ arrays | ⚠️ DEV ONLY |

---

## 🎯 Immediate Actions Required

### 🔴 CRITICAL (Do Today):
1. **Remove fake news** from `NewsSentiment.tsx` - Replace with API or remove component
2. **Mark `lib/data.ts`** as DEV_ONLY or remove
3. **Move platform stats** to database with API endpoint

### 🟡 HIGH (This Week):
4. **Hero slides** → CMS table
5. **Category discovery** → Database query
6. **Platform stats** → Real-time aggregates

### 🟢 MEDIUM (Next Sprint):
7. Calculator presets → Admin-configurable
8. Risk profiler questions → CMS
9. Featured tools → Analytics-driven

---

## 📝 Migration Checklist

### Database Setup:
- [ ] Create `hero_slides` table
- [ ] Create `calculator_presets` table
- [ ] Create `risk_profiler_questions` table
- [ ] Create `featured_content` table
- [ ] Create `platform_stats` table
- [ ] Create `cta_variants` table

### Admin Interfaces:
- [ ] Hero slides manager
- [ ] Calculator presets editor
- [ ] Risk profiler question editor
- [ ] Platform stats dashboard
- [ ] CTA variant manager
- [ ] Category discovery manager

### Component Updates:
- [ ] Replace `HERO_SLIDES` with API call
- [ ] Replace `categories` array with database query
- [ ] Replace `newsItems` with news API
- [ ] Replace `tools` array with database query
- [ ] Replace `questions` with database query
- [ ] Replace `MF_SLIDES` with category-specific query
- [ ] Replace `PLATFORM_STATS` with API call

### Data Migration:
- [ ] Export current hero slides to JSON
- [ ] Import to database
- [ ] Export calculator presets
- [ ] Import to database
- [ ] Export risk profiler questions
- [ ] Import to database
- [ ] Verify all data migrated correctly

---

*This audit identifies all hardcoded elements that should be dynamic for better content management, scalability, and non-technical team empowerment*

### 17. Risk Profile Definitions
**File:** `app/risk-profiler/page.tsx`  
**Lines:** 90+  
**Issue:** Hardcoded risk profile calculations

**Should Be:**
- Configurable scoring algorithm
- Admin-editable risk bands
- Dynamic profile descriptions
- Personalized recommendations

**Impact:** Cannot adjust risk assessment logic without code

---

## 🟢 LOW: Configuration & Constants

### 15. Animation Durations
**File:** `lib/constants/animations.ts`  
**Status:** ✅ Already centralized (good!)

**Note:** This is correctly centralized - keep as is.

---

### 16. Color Tokens
**File:** `tailwind.config.ts`  
**Status:** ✅ Already centralized (good!)

**Note:** Design system tokens are correctly centralized.

---

### 17. Social Media Links
**Found In:** Footer, admin dashboard  
**Issue:** Social URLs hardcoded

**Should Be:**
- Environment variables or config
- Admin-configurable
- Per-environment (dev/staging/prod)

---

## 📋 Remediation Priority Matrix

### Phase 1: Critical (Week 1)
1. **Hero Carousel Slides** → CMS table
2. **Platform Statistics** → Database aggregates
3. **Category Discovery** → Database query
4. **Navigation Config** → Database-driven

### Phase 2: High Impact (Week 2)
5. **Comparison Numbers** → Real-time counts
6. **Category Hero Slides** → CMS per category
7. **CTA Text Variants** → CMS + A/B testing

### Phase 3: Optimization (Week 3)
8. **Calculator Presets** → Admin-configurable
9. **Risk Profiler Questions** → CMS-managed
10. **Featured Tools** → Analytics-driven

### Phase 4: Polish (Week 4)
11. **Badge Text** → CMS content blocks
12. **Tool Descriptions** → CMS articles
13. **Social Links** → Config/env vars

---

## 🗄️ Database Schema Recommendations

### New Tables Needed:

```sql
-- Hero Slides (CMS-managed)
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY,
    category_id TEXT, -- nullable for homepage
    slide_order INTEGER,
    badge_text TEXT,
    headline TEXT,
    highlight_text TEXT,
    description TEXT,
    primary_cta_text TEXT,
    primary_cta_href TEXT,
    secondary_cta_text TEXT,
    secondary_cta_href TEXT,
    gradient_class TEXT,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Calculator Presets
CREATE TABLE calculator_presets (
    id UUID PRIMARY KEY,
    calculator_type TEXT, -- 'sip', 'emi', etc.
    label TEXT,
    preset_data JSONB, -- { monthlyInvestment: 1000000, years: 10, ... }
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Risk Profiler Questions
CREATE TABLE risk_profiler_questions (
    id UUID PRIMARY KEY,
    question_order INTEGER,
    question_text TEXT,
    question_type TEXT, -- 'single_choice', 'multiple_choice'
    options JSONB, -- [{ label: "...", value: 0 }, ...]
    scoring_weights JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Featured Tools/Content
CREATE TABLE featured_content (
    id UUID PRIMARY KEY,
    content_type TEXT, -- 'tool', 'category', 'article'
    title TEXT,
    description TEXT,
    icon_name TEXT, -- Lucide icon name
    href TEXT,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    analytics_weight DECIMAL, -- For smart ordering
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform Statistics (with history)
CREATE TABLE platform_stats (
    id UUID PRIMARY KEY,
    stat_key TEXT UNIQUE, -- 'users_helped', 'products_tracked'
    stat_value TEXT, -- '2.1M+'
    numeric_value BIGINT, -- 2100000
    last_updated TIMESTAMP DEFAULT NOW(),
    update_source TEXT -- 'manual', 'aggregate', 'api'
);

-- CTA Variants (A/B testing)
CREATE TABLE cta_variants (
    id UUID PRIMARY KEY,
    context TEXT, -- 'hero_primary', 'product_card', etc.
    variant_text TEXT,
    variant_href TEXT,
    is_active BOOLEAN DEFAULT true,
    display_weight INTEGER DEFAULT 50, -- For A/B split
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 Implementation Plan

### Step 1: Create Database Tables (2 hours)
- Run migration scripts for new tables
- Set up RLS policies
- Seed initial data

### Step 2: Build Admin Interfaces (8 hours)
- Hero slides manager
- Calculator presets editor
- Risk profiler question editor
- Platform stats dashboard
- CTA variant manager

### Step 3: Update Components (12 hours)
- Replace hardcoded arrays with database queries
- Add loading states
- Implement fallbacks for missing data
- Add error handling

### Step 4: Migration Script (4 hours)
- Export current hardcoded data
- Import to database
- Verify data integrity

### Step 5: Testing (4 hours)
- Test all dynamic content loads
- Verify admin interfaces
- Test edge cases (empty data, etc.)

**Total Effort:** ~30 hours

---

## ✅ Quick Wins (Can Do Now)

### 1. Move Stats to Environment Variables
**File:** `lib/constants/platform-stats.ts`

```ts
// Use env vars with database fallback
export const PLATFORM_STATS = {
  usersHelped: process.env.NEXT_PUBLIC_USERS_HELPED || '2.1M+',
  productsTracked: process.env.NEXT_PUBLIC_PRODUCTS_TRACKED || '500+',
  // ... with database query as fallback
}
```

### 2. Create Stats API Endpoint
**File:** `app/api/stats/route.ts`

```ts
export async function GET() {
  const stats = await calculateRealStats();
  return Response.json(stats);
}
```

### 3. Add Stats Cache
- Cache stats for 1 hour
- Update via cron job
- Real-time for admin, cached for public

---

## 📊 Impact Assessment

### Before (Hardcoded):
- ❌ Content updates require developer
- ❌ Cannot A/B test messaging
- ❌ Stats become outdated
- ❌ No personalization
- ❌ Difficult to scale content

### After (Dynamic):
- ✅ Non-technical team can update content
- ✅ A/B testing framework ready
- ✅ Real-time accurate statistics
- ✅ Personalized experiences
- ✅ Scalable content management

---

## 🎯 Next Steps

1. **Review this audit** with team
2. **Prioritize** which elements to make dynamic first
3. **Design database schema** for selected items
4. **Build admin interfaces** for content management
5. **Migrate existing data** from code to database
6. **Update components** to use dynamic data
7. **Test thoroughly** before deployment

---

*This audit identifies all hardcoded elements that should be dynamic for better content management and scalability*
