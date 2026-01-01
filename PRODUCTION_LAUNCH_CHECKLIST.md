# InvestingPro Production Launch Checklist
**Target:** 99% Perfection + Full Automation  
**Created:** December 31, 2025  
**Goal:** Production-ready financial comparison platform (India's NerdWallet)

---

## 🎯 Executive Summary

This checklist covers:
- ✅ 127 actionable tasks across 10 categories
- 🔑 22 API integrations with credentials needed
- 🤖 8 automation pipelines to configure
- 🚀 Complete deployment roadmap
- 📊 Post-launch monitoring setup

**Estimated Timeline:** 8-12 weeks (2-3 engineers)

---

## Table of Contents

1. [Critical Bug Fixes (P0)](#1-critical-bug-fixes-p0---week-1)
2. [Security & Compliance](#2-security--compliance---week-1-2)
3. [Feature Completion](#3-feature-completion---week-2-4)
4. [API Integrations & Credentials](#4-api-integrations--credentials---week-3-5)
5. [Automation & AI Setup](#5-automation--ai-setup---week-4-6)
6. [Public-Facing UI/UX](#6-public-facing-uiux-refinement---week-5-7)
7. [Testing & QA](#7-testing--qa---week-6-8)
8. [Performance Optimization](#8-performance-optimization---week-7-9)
9. [Deployment & Infrastructure](#9-deployment--infrastructure---week-9-10)
10. [Post-Launch & Monitoring](#10-post-launch--monitoring---ongoing)

---

## 1. Critical Bug Fixes (P0) - Week 1

### 🔴 Immediate Blockers (Day 1-3)

- [ ] **1.1 Fix Article Editor Crash**
  - File: `components/admin/ArticleEditor.tsx`
  - Error: `TypeError: Cannot read properties of undefined (reading 'charAt')`
  - Action: Add null checks before string operations
  - Test: Edit 10+ articles with various content formats
  - Success: Can edit all articles without errors

- [ ] **1.2 Implement Media Library**
  - Route: `/admin/media` (currently 404)
  - Features needed:
    - [ ] File upload (drag-drop + browse)
    - [ ] Image preview grid
    - [ ] Search and filter
    - [ ] Bulk operations (delete, move)
    - [ ] Image editing (crop, resize)
    - [ ] Alt text editor
  - Integration: Supabase Storage
  - Test: Upload 50 images, verify retrieval

- [ ] **1.3 Fix Dashboard NaN/Undefined Values**
  - File: `app/admin/page.tsx`
  - Issues:
    ```typescript
    // Lines to fix (add null coalescing):
    value: statsData?.total_articles ?? 0,
    change: `+${statsData?.articles_this_month ?? 0} this month`,
    value: Number(statsData?.total_views ?? 0).toLocaleString(),
    ```
  - Action: Add `?? 0` operators to all metric calculations
  - Test: View dashboard with empty database

- [ ] **1.4 Update Next.js (Security Vulnerability)**
  - Current: `next@16.0.8` (high severity CVE)
  - Target: `next@16.1.1` or latest
  - Command: `npm install next@latest`
  - Test: `npm run build` succeeds, all routes work

- [ ] **1.5 Fix Admin Authentication Bypass**
  - File: `middleware.ts` (lines 23-31)
  - Issue: Auth disabled when `NODE_ENV !== 'production'`
  - Action:
    ```typescript
    // Add explicit flag instead of NODE_ENV check
    const BYPASS_AUTH = process.env.ADMIN_AUTH_BYPASS === 'true';
    if (BYPASS_AUTH) {
        console.warn('⚠️ ADMIN AUTH BYPASSED - DEVELOPMENT ONLY');
        return response;
    }
    ```
  - Set `ADMIN_AUTH_BYPASS=false` in production `.env`

### ⚠️ High Priority Bugs (Day 4-7)

- [ ] **1.6 Remove Console.log Statements**
  - Files: `app/admin/login/page.tsx` (9 instances)
  - Replace with: `lib/logger.ts` structured logging
  - Command: Search project for `console.log` and replace

- [ ] **1.7 Fix TypeScript `any` Types**
  - Priority files:
    - [ ] `components/ui/select.tsx` (all props)
    - [ ] `components/ui/sheet.tsx`
    - [ ] `components/visuals/*.tsx` (chart data)
    - [ ] `components/admin/*` (event handlers)
  - Create proper interfaces for each

- [ ] **1.8 Fix ESLint Errors**
  - Command: `npm run lint`
  - Fix all errors before proceeding
  - Enable pre-commit hooks

- [ ] **1.9 Remove Duplicate Config Files**
  - Delete: `next.config.js` (keep only `next.config.ts`)
  - Verify: Build still works

- [ ] **1.10 Clean Root Directory**
  - Move 50+ SQL files to: `archive/sql-scripts/`
  - Move implementation docs to: `archive/implementation-history/`
  - Keep only: README, LICENSE, core configs

---

## 2. Security & Compliance - Week 1-2

### 🔒 Authentication & Authorization

- [ ] **2.1 Implement Proper Admin User Management**
  - [ ] Create admin user registration flow
  - [ ] Email verification required
  - [ ] Password strength requirements (min 12 chars, special chars)
  - [ ] Two-factor authentication (2FA) optional
  - [ ] Session timeout (30 minutes idle)

- [ ] **2.2 Row-Level Security (RLS) Policies**
  - Files: `lib/supabase/*.sql`
  - [ ] Audit all RLS policies
  - [ ] Test with non-admin user
  - [ ] Verify admins can CRUD all data
  - [ ] Verify public users can only read published content

- [ ] **2.3 Content Security Policy (CSP)**
  - File: `next.config.ts`
  - Add CSP headers:
    ```typescript
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.openai.com;"
    }
    ```

- [ ] **2.4 HTTPS Only (HSTS)**
  - Add to `next.config.ts`:
    ```typescript
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
    }
    ```

- [ ] **2.5 Input Sanitization**
  - [ ] Install: `npm install dompurify isomorphic-dompurify`
  - [ ] Sanitize all user inputs in article editor
  - [ ] Sanitize URL parameters
  - [ ] Prevent XSS in comments/reviews

- [ ] **2.6 Rate Limiting**
  - [ ] API routes: 100 requests/minute per IP
  - [ ] Login attempts: 5 failures = 15-minute lockout
  - [ ] Implementation: Use Vercel Edge Config or Upstash Redis

### 📋 Compliance (India-Specific)

- [ ] **2.7 SEBI Disclaimers**
  - [ ] Add on all product comparison pages
  - [ ] Template: "Investment is subject to market risks. Please read all scheme related documents carefully before investing."
  - [ ] Footer disclaimer on every page

- [ ] **2.8 RBI Compliance (if offering loan comparisons)**
  - [ ] Add: "Loans are subject to approval and terms & conditions."
  - [ ] Partner verification documents

- [ ] **2.9 IRDAI Compliance (insurance)**
  - [ ] Insurance product disclaimers
  - [ ] "Insurance is subject to underwriting and terms & conditions."

- [ ] **2.10 Cookie Consent (GDPR/DPDP Act)**
  - Component: `components/common/CookieConsent.tsx` (exists ✅)
  - [ ] Test consent flow
  - [ ] Log consent to database
  - [ ] Respect user preferences

- [ ] **2.11 Privacy Policy**
  - Route: `/privacy`
  - [ ] Complete India-specific privacy policy
  - [ ] Include: Data collection, usage, sharing, deletion
  - [ ] Legal review recommended

- [ ] **2.12 Terms of Service**
  - Route: `/terms`
  - [ ] Affiliate disclosure
  - [ ] Limitation of liability
  - [ ] Dispute resolution

- [ ] **2.13 Affiliate Disclosure**
  - [ ] Add to all product pages: "We may earn commission from links on this page."
  - [ ] "How We Make Money" page at `/how-we-make-money`

---

## 3. Feature Completion - Week 2-4

### 📝 CMS Core Features

- [ ] **3.1 Content Calendar**
  - Route: `/admin/content-calendar`
  - Features:
    - [ ] Calendar view (month/week/day)
    - [ ] Drag-drop article scheduling
    - [ ] Status indicators (draft/scheduled/published)
    - [ ] Filter by category/author
    - [ ] Export to CSV
  - Library: Consider `react-big-calendar`

- [ ] **3.2 Article Revisions/Version History**
  - [ ] Store previous versions in `article_revisions` table
  - [ ] "Restore" button to rollback
  - [ ] Diff view (compare versions)
  - [ ] Auto-save every 30 seconds

- [ ] **3.3 User Management Page**
  - Route: `/admin/users`
  - [ ] List all users (admins, contributors)
  - [ ] Assign roles (admin, editor, contributor)
  - [ ] Activity log per user
  - [ ] Suspend/activate users

- [ ] **3.4 Settings Page**
  - Route: `/admin/settings`
  - Tabs:
    - [ ] General (site name, tagline, logo)
    - [ ] SEO defaults (meta description template)
    - [ ] Social media (default share images)
    - [ ] Analytics (Google Analytics ID, tracking codes)
    - [ ] Email (SMTP settings for notifications)

- [ ] **3.5 Bulk Operations**
  - [ ] Multi-select on article listing
  - [ ] Bulk actions: Publish, Draft, Delete, Change Category
  - [ ] Confirmation dialog before bulk delete

- [ ] **3.6 Advanced Search**
  - [ ] Global search (Cmd+K) in admin
  - [ ] Search articles, pages, media by keyword
  - [ ] Recent searches
  - [ ] Keyboard navigation

- [ ] **3.7 Comments/Review Moderation**
  - Route: `/admin/review-queue`
  - [ ] Approve/reject user reviews
  - [ ] Flag spam
  - [ ] Bulk actions

### 🎨 Public-Facing Features

- [ ] **3.8 Product Detail Pages**
  - Missing routes:
    - [ ] `/mutual-funds/[slug]` - Individual fund pages
    - [ ] `/credit-cards/[slug]` - Card detail pages
    - [ ] `/loans/[slug]` - Loan product pages
  - Required data:
    - [ ] Product images/logos
    - [ ] Full specifications
    - [ ] User reviews
    - [ ] Expert ratings
    - [ ] "Apply Now" CTAs

- [ ] **3.9 Comparison Tool**
  - Route: `/compare`
  - [ ] Select 2-3 products to compare
  - [ ] Side-by-side table
  - [ ] Export comparison as PDF/image
  - [ ] Share comparison (unique URL)

- [ ] **3.10 Advanced Calculators**
  - Existing: SIP, EMI (basic)
  - Add:
    - [ ] Income Tax calculator
    - [ ] Home Loan EMI with amortization
    - [ ] FD interest calculator with inflation
    - [ ] Retirement planning calculator
    - [ ] PPF calculator
  - All calculators need:
    - [ ] Visual charts (Recharts)
    - [ ] Export results as PDF
    - [ ] Save calculations (logged-in users)

- [ ] **3.11 User Accounts (Public)**
  - Routes: `/signup`, `/login`, `/profile`
  - Features:
    - [ ] Google OAuth (already configured ✅)
    - [ ] Email/password signup
    - [ ] Profile management
    - [ ] Saved comparisons
    - [ ] Watchlist (favorite products)
    - [ ] Calculation history

- [ ] **3.12 Newsletter Signup**
  - Component: `HomeNewsletterSection` (exists ✅)
  - Backend integration:
    - [ ] Choose platform (Mailchimp/ConvertKit/Substack)
    - [ ] API integration
    - [ ] Double opt-in flow
    - [ ] Auto-send weekly digest

### 📊 Analytics & Tracking

- [ ] **3.13 Performance Tracking Dashboard**
  - Component: `ContentPerformanceTracking.tsx` (exists, needs testing)
  - [ ] Verify charts render correctly
  - [ ] Add export to Excel
  - [ ] Add date range custom picker

- [ ] **3.14 A/B Testing Framework**
  - [ ] Choose tool (Vercel Edge Config or PostHog)
  - [ ] Test: Headlines, CTAs, layouts
  - [ ] Admin UI to create tests

---

## 4. API Integrations & Credentials - Week 3-5

### 🔑 Required API Keys & Credentials

Create a `.env.production` file with all credentials. **NEVER commit to Git.**

### 4.1 Core Infrastructure

- [ ] **Supabase (Database & Auth)**
  - Status: ✅ Already configured
  - Credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI... (server-side only)
    ```
  - [ ] Verify production instance separate from dev
  - [ ] Enable database backups (daily)

- [ ] **Vercel (Hosting)**
  - [ ] Create production deployment
  - [ ] Add custom domain (investingpro.in)
  - [ ] Enable analytics
  - [ ] Set environment variables in Vercel dashboard

### 4.2 AI & Content Generation

- [ ] **OpenAI API**
  - Purpose: AI article generation
  - Signup: https://platform.openai.com/signup
  - Credentials:
    ```env
    OPENAI_API_KEY=sk-...
    OPENAI_MODEL=gpt-4-turbo  # or gpt-3.5-turbo for cost savings
    ```
  - Cost: ~$0.01-0.03 per article (gpt-3.5) / $0.10-0.30 (gpt-4)
  - [ ] Set monthly spending limit ($100/month to start)
  - [ ] Monitor usage in admin dashboard

- [ ] **Google Gemini API (Alternative/Backup)**
  - Purpose: Alternative AI provider
  - Signup: https://makersuite.google.com/app/apikey
  - Credentials:
    ```env
    GOOGLE_GEMINI_API_KEY=AIzaSy...
    ```
  - Cost: Free tier available (60 requests/minute)

### 4.3 SEO & Search

- [ ] **Google Search Console**
  - Purpose: Search performance tracking, indexing
  - Setup:
    1. Go to: https://search.google.com/search-console
    2. Add property: investingpro.in
    3. Verify ownership (DNS TXT record or HTML file)
    4. Submit sitemap: https://investingpro.in/sitemap.xml
  - Credentials:
    ```env
    # OAuth for API access (optional)
    GOOGLE_SEARCH_CONSOLE_CLIENT_ID=...
    GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=...
    ```
  - [ ] Monitor: Impressions, clicks, CTR, average position
  - [ ] Check for indexing errors weekly

- [ ] **Google Trends API**
  - Purpose: Trending keywords for content ideas
  - Method: Use `google-trends-api` npm package (unofficial)
  - Install: `npm install google-trends-api`
  - No credentials required (public data)
  - Implementation:
    ```typescript
    import googleTrends from 'google-trends-api';
    const trends = await googleTrends.interestOverTime({
      keyword: 'mutual funds india',
      geo: 'IN'
    });
    ```
  - [ ] Create cron job to fetch daily
  - [ ] Store in `trends` table

- [ ] **Ahrefs/SEMrush API (Optional, Paid)**
  - Purpose: Keyword research, competitor analysis
  - Ahrefs API: $99/month - https://ahrefs.com/api
  - SEMrush API: $119/month - https://www.semrush.com/api-analytics/
  - Credentials:
    ```env
    AHREFS_API_KEY=...
    # OR
    SEMRUSH_API_KEY=...
    ```
  - [ ] Use for keyword difficulty scores
  - [ ] Track competitor rankings

### 4.4 Analytics & Tracking

- [ ] **Google Analytics 4**
  - Purpose: User behavior tracking
  - Setup:
    1. Go to: https://analytics.google.com/
    2. Create property for investingpro.in
    3. Get Measurement ID
  - Credentials:
    ```env
    NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
    ```
  - Component: `components/common/Analytics.tsx` (exists ✅)
  - [ ] Verify tag firing (Google Tag Assistant)
  - [ ] Set up custom events:
    - Article view
    - Calculator usage
    - Product comparison
    - "Apply Now" button clicks
    - Newsletter signup

- [ ] **Google Tag Manager (GTM) - Optional**
  - Purpose: Manage all tracking tags
  - Setup: https://tagmanager.google.com/
  - Credentials:
    ```env
    NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
    ```
  - [ ] Add GA4, Facebook Pixel, other tags via GTM

- [ ] **Microsoft Clarity / Hotjar**
  - Purpose: Session recordings, heatmaps
  - Clarity (FREE): https://clarity.microsoft.com/
  - Hotjar (Paid): https://www.hotjar.com/
  - Credentials:
    ```env
    NEXT_PUBLIC_CLARITY_PROJECT_ID=...
    # OR
    NEXT_PUBLIC_HOTJAR_ID=...
    ```
  - [ ] Watch 20+ sessions to find UX issues

### 4.5 Social Media Integration

- [ ] **Facebook/Instagram API**
  - Purpose: Auto-post articles, fetch insights
  - Setup:
    1. Create Facebook App: https://developers.facebook.com/
    2. Generate Access Token (Page Access Token)
  - Credentials:
    ```env
    FACEBOOK_APP_ID=...
    FACEBOOK_APP_SECRET=...
    FACEBOOK_PAGE_ACCESS_TOKEN=... (long-lived)
    INSTAGRAM_BUSINESS_ACCOUNT_ID=...
    ```
  - [ ] Implement auto-posting in `/api/social/facebook`
  - [ ] Fetch engagement metrics for dashboard

- [ ] **Twitter API (X)**
  - Purpose: Auto-tweet articles
  - Setup: https://developer.twitter.com/en/portal/petition/essential/basic-info
  - Credentials:
    ```env
    TWITTER_API_KEY=...
    TWITTER_API_SECRET=...
    TWITTER_ACCESS_TOKEN=...
    TWITTER_ACCESS_TOKEN_SECRET=...
    TWITTER_BEARER_TOKEN=...
    ```
  - Cost: Free tier (1,500 tweets/month)
  - [ ] Auto-tweet on article publish

- [ ] **LinkedIn API**
  - Purpose: Share articles to LinkedIn page
  - Setup: https://www.linkedin.com/developers/apps
  - Credentials:
    ```env
    LINKEDIN_CLIENT_ID=...
    LINKEDIN_CLIENT_SECRET=...
    LINKEDIN_ACCESS_TOKEN=...
    LINKEDIN_ORGANIZATION_ID=...
    ```
  - [ ] Share article with rich preview

- [ ] **YouTube Data API**
  - Purpose: Fetch video stats for dashboard
  - Setup: https://console.cloud.google.com/
  - Credentials:
    ```env
    YOUTUBE_API_KEY=...
    YOUTUBE_CHANNEL_ID=...
    ```
  - [ ] Display subscriber count, views in admin

### 4.6 Financial Data APIs

- [ ] **NSE/BSE Market Data**
  - Purpose: Live stock prices, mutual fund NAVs
  - Options:
    1. Alpha Vantage (Free): https://www.alphavantage.co/
    2. Yahoo Finance (Unofficial): `yahoo-finance2` npm package
    3. NSE India API (Official, requires approval)
  - Credentials:
    ```env
    ALPHA_VANTAGE_API_KEY=... (free tier: 25 requests/day)
    ```
  - [ ] Implement in `/api/market-data`
  - [ ] Cache data for 15 minutes (avoid rate limits)

- [ ] **AMFI Mutual Fund Data**
  - Purpose: Daily mutual fund NAVs
  - URL: https://www.amfiindia.com/spages/NAVAll.txt
  - No API key required (public data)
  - [ ] Scrape daily via cron job
  - [ ] Parse and store in database

- [ ] **Banking/Loan Rate Aggregator**
  - Options:
    1. BankBazaar API (requires partnership)
    2. Manual scraping (selenium/puppeteer)
  - [ ] Implement scraper for interest rates
  - [ ] Update weekly

### 4.7 Monetization & Affiliate

- [ ] **Affiliate Networks**
  - Sign up for:
    - [ ] Amazon Associates (https://affiliate.amazon.in/)
    - [ ] Commission Junction (https://www.cj.com/)
    - [ ] Impact Radius (for insurance/finance)
  - Credentials:
    ```env
    AMAZON_AFFILIATE_ID=investingpro-21
    CJ_DEVELOPER_KEY=...
    IMPACT_ACCOUNT_SID=...
    IMPACT_AUTH_TOKEN=...
    ```
  - [ ] Track clicks and conversions
  - [ ] Store in `affiliate_products` table

- [ ] **Payment Gateway (for premium features)**
  - Razorpay (India-specific): https://razorpay.com/
  - Credentials:
    ```env
    RAZORPAY_KEY_ID=rzp_live_...
    RAZORPAY_KEY_SECRET=...
    ```
  - [ ] Implement for premium calculator exports

### 4.8 Email & Notifications

- [ ] **Transactional Email (SendGrid/Postmark)**
  - Purpose: User notifications, password resets
  - SendGrid: https://sendgrid.com/ ($15/month for 50k emails)
  - Credentials:
    ```env
    SENDGRID_API_KEY=SG....
    SENDGRID_FROM_EMAIL=noreply@investingpro.in
    ```
  - Templates needed:
    - [ ] Welcome email
    - [ ] Password reset
    - [ ] Article published notification
    - [ ] Monthly newsletter

- [ ] **Newsletter Platform (Mailchimp/ConvertKit)**
  - Purpose: Email marketing
  - ConvertKit: https://convertkit.com/ ($29/month)
  - Credentials:
    ```env
    CONVERTKIT_API_KEY=...
    CONVERTKIT_FORM_ID=... (for signup form)
    ```
  - [ ] Embed signup form on homepage
  - [ ] Auto-add subscribers to sequence

### 4.9 Error Monitoring

- [ ] **Sentry (Error Tracking)**
  - Purpose: Real-time error monitoring
  - Setup: https://sentry.io/ (Free tier: 5k errors/month)
  - Credentials:
    ```env
    SENTRY_DSN=https://...@sentry.io/...
    ```
  - Install: `npm install @sentry/nextjs`
  - Init: `npx @sentry/wizard@latest -i nextjs`
  - [ ] Configure in middleware.ts
  - [ ] Test: Trigger error, verify in Sentry dashboard

- [ ] **LogRocket (Session Replay)**
  - Purpose: Debug user issues
  - Setup: https://logrocket.com/ ($99/month)
  - Credentials:
    ```env
    LOGROCKET_APP_ID=...
    ```
  - [ ] Record sessions with errors only (to save quota)

### 4.10 Uptime & Performance

- [ ] **UptimeRobot (Free Monitoring)**
  - Purpose: Alert if site goes down
  - Setup: https://uptimerobot.com/
  - [ ] Monitor every 5 minutes
  - [ ] Alert via email/SMS on downtime

- [ ] **Vercel Analytics (Built-in)**
  - Purpose: Core Web Vitals, performance
  - [ ] Enable in Vercel dashboard (free)
  - [ ] Monitor LCP, FID, CLS scores

---

## 5. Automation & AI Setup - Week 4-6

### 🤖 Content Automation Pipelines

- [ ] **5.1 RSS Feed Importer**
  - Files: `lib/rss-import/*`
  - Configuration:
    ```typescript
    // Add RSS feeds to database
    const feeds = [
      { name: 'Moneycontrol News', url: 'https://www.moneycontrol.com/rss/latestnews.xml' },
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms' },
      { name: 'Livemint', url: 'https://www.livemint.com/rss/money' }
    ];
    ```
  - [ ] Create cron job: `/api/cron/rss-import` (runs every 6 hours)
  - [ ] Parse feed items
  - [ ] Generate unique articles using AI
  - [ ] Save as drafts for review
  - [ ] Test: Import 10 articles, verify uniqueness

- [ ] **5.2 Trend-Based Article Generator**
  - Integration: Google Trends API
  - Workflow:
    1. Fetch trending keywords (finance India)
    2. Score by relevance (mutual fund > credit card > loan)
    3. Check if topic already covered
    4. Generate article outline (AI)
    5. Write full article (AI)
    6. Add to review queue
  - Frequency: Daily at 9 AM IST
  - [ ] Create `/api/cron/trend-articles`
  - [ ] Implement in `lib/automation/trend-generator.ts`

- [ ] **5.3 Product Data Scraper**
  - Targets:
    - Mutual fund NAVs (AMFI)
    - Credit card offers (BankBazaar, Paisabazaar)
    - Loan rates (bank websites)
  - Implementation:
    - [ ] `lib/scraper/mutual-funds.ts` - AMFI scraper
    - [ ] `lib/scraper/credit-cards.ts` - Card offers
    - [ ] `lib/scraper/loans.ts` - Interest rates
  - Frequency: Daily at 1 AM IST
  - [ ] Handle rate limits (sleep between requests)
  - [ ] Store change history for trend analysis

- [ ] **5.4 Auto-Publishing Scheduler**
  - Features:
    - [ ] Queue system for scheduled articles
    - [ ] Publish at specific date/time
    - [ ] Auto-share to social media on publish
    - [ ] Send newsletter if flagged
  - Implementation:
    - [ ] Cron job: `/api/cron/publish-scheduled` (runs every 15 minutes)
    - [ ] Check `articles` table for `status='scheduled'` and `publish_date <= NOW()`
    - [ ] Update status to 'published'
    - [ ] Trigger social sharing

- [ ] **5.5 SEO Auto-Optimizer**
  - Features:
    - [ ] Generate meta descriptions (AI)
    - [ ] Suggest internal links
    - [ ] Image alt text generation
    - [ ] Readability scoring
    - [ ] Keyword density check
  - Component: `components/admin/SEOScoreCalculator.tsx` (exists ✅)
  - [ ] Integrate with article editor
  - [ ] Show SEO score (0-100) in real-time

- [ ] **5.6 Broken Link Checker**
  - [ ] Crawl all published articles
  - [ ] Check external links (HTTP 200?)
  - [ ] Report broken links in admin dashboard
  - [ ] Suggest replacements
  - Frequency: Weekly
  - Library: Consider `broken-link-checker` npm package

- [ ] **5.7 Image Optimization Pipeline**
  - [ ] Compress uploads (use `browser-image-compression` ✅ already installed)
  - [ ] Generate multiple sizes (thumbnail, medium, large)
  - [ ] Convert to WebP format
  - [ ] Lazy-load images on frontend
  - [ ] Alt text auto-generation (AI)

- [ ] **5.8 Social Media Auto-Posting**
  - Trigger: Article published
  - Platforms:
    - [ ] Facebook Page post
    - [ ] Twitter tweet with hashtags
    - [ ] LinkedIn company update
    - [ ] Instagram Story (optional, image + link)
  - Template:
    ```
    🚀 New on InvestingPro: {article_title}
    
    {excerpt}
    
    Read more: {url}
    
    #FinancialPlanning #InvestingIndia
    ```
  - Implementation: `/api/social/auto-post.ts`

### 🧠 AI Configuration

- [ ] **5.9 OpenAI Prompt Templates**
  - File: `lib/ai/financialExpertPrompts.ts` (exists ✅)
  - Review and optimize prompts:
    - [ ] Article generation
    - [ ] Meta description
    - [ ] Social media captions
    - [ ] Product descriptions
  - Test: Generate 20 articles, measure quality (manual review)

- [ ] **5.10 AI Rate Limiting**
  - [ ] Implement queue system (avoid API overload)
  - [ ] Max 10 AI generations per minute
  - [ ] Retry logic with exponential backoff
  - [ ] Monitor costs in admin dashboard

---

## 6. Public-Facing UI/UX Refinement - Week 5-7

### 🎨 Design System Fixes

- [ ] **6.1 Product Card CTA Colors**
  - File: `components/ui/ProductCard.tsx`
  - Change: `bg-blue-600` → `bg-primary-600` (brand green)
  - Affected: All product comparison pages

- [ ] **6.2 Add Product Images/Logos**
  - [ ] Partner with providers for brand assets
  - [ ] Create placeholder images for missing logos
  - [ ] Display in product cards
  - [ ] Ensure proper aspect ratios

- [ ] **6.3 Add Editorial Voice**
  - [ ] "Why We Recommend" section on product cards
  - [ ] Expert pick badges
  - [ ] Pros/Cons lists
  - Template:
    ```tsx
    <div className="editorial-pick">
      <Badge>Expert Pick</Badge>
      <p className="why-we-like">
        "High cashback rate and zero annual fee make this 
        ideal for everyday spenders."
      </p>
    </div>
    ```

- [ ] **6.4 Trust Signals**
  - Add to all comparison pages:
    - [ ] "How We Make Money" link
    - [ ] Last updated date
    - [ ] Expert rating methodology link
    - [ ] SEBI disclaimer
  - [ ] Create "About Our Ratings" page

- [ ] **6.5 User Reviews Integration**
  - [ ] Display user ratings on product cards
  - [ ] Star rating average
  - [ ] Review count
  - [ ] "Write a Review" CTA
  - [ ] Moderation queue for reviews

### 📱 Mobile Optimization

- [ ] **6.6 Responsive Testing**
  - Test on:
    - [ ] iPhone SE (375px)
    - [ ] iPhone 12/13 (390px)
    - [ ] Android (360px)
    - [ ] iPad (768px)
  - Fix:
    - [ ] Table overflow (horizontal scroll)
    - [ ] Button touch targets (min 44px)
    - [ ] Font sizes (min 16px)

- [ ] **6.7 Mobile Navigation**
  - [ ] Hamburger menu functionality
  - [ ] Touch-friendly dropdowns
  - [ ] Sticky "Compare" bar at bottom

### 🌐 Internationalization (i18n)

- [ ] **6.8 Hindi Language Support**
  - Library: `next-intl` (already installed ✅)
  - [ ] Translate homepage
  - [ ] Translate calculator labels
  - [ ] Translate navigation
  - [ ] Language switcher in header
  - Files needed:
    - `messages/en.json`
    - `messages/hi.json`

- [ ] **6.9 Regional Language Expansion (Future)**
  - [ ] Tamil
  - [ ] Telugu
  - [ ] Marathi
  - [ ] Bengali

### ⚡ Performance

- [ ] **6.10 Image Optimization**
  - [ ] Use Next.js Image component everywhere
  - [ ] WebP format with JPEG fallback
  - [ ] Lazy loading below fold
  - [ ] CDN (Vercel automatic)

- [ ] **6.11 Code Splitting**
  - [ ] Lazy load admin components
  - [ ] Dynamic imports for heavy widgets
  - [ ] Separate chart library bundle

---

## 7. Testing & QA - Week 6-8

### 🧪 Automated Testing

- [ ] **7.1 Unit Tests**
  - Framework: Jest (configured ✅)
  - Coverage target: 80% for business logic
  - Priority:
    - [ ] `lib/ranking/engine.ts` - Ranking algorithm
    - [ ] `lib/data.ts` - Financial calculators
    - [ ] `lib/cms/article-service.ts` - CMS operations
  - Command: `npm test`

- [ ] **7.2 Integration Tests**
  - [ ] API route tests
  - [ ] Database operations
  - [ ] Authentication flow
  - Library: Consider `supertest`

- [ ] **7.3 E2E Tests (Critical Flows)**
  - Framework: Playwright or Cypress
  - Scenarios:
    - [ ] User signup → Login → Profile update
    - [ ] Admin login → Create article → Publish
    - [ ] Product comparison → Compare 3 cards → Apply
    - [ ] Calculator usage → Save result
  - [ ] Run before each deployment

### 🔍 Manual Testing

- [ ] **7.4 Cross-Browser Testing**
  - Test on:
    - [ ] Chrome (latest)
    - [ ] Safari (macOS, iOS)
    - [ ] Firefox
    - [ ] Edge
    - [ ] Samsung Internet (Android)

- [ ] **7.5 Accessibility Testing**
  - Tools:
    - [ ] Lighthouse audit (score 90+)
    - [ ] axe DevTools
    - [ ] WAVE browser extension
  - Checks:
    - [ ] Keyboard navigation (no mouse)
    - [ ] Screen reader (NVDA/JAWS)
    - [ ] Color contrast (WCAG AA)
    - [ ] Focus indicators visible

- [ ] **7.6 User Acceptance Testing (UAT)**
  - Recruit 10 beta users:
    - [ ] 5 general users (product comparison)
    - [ ] 3 admin users (CMS testing)
    - [ ] 2 accessibility users (screen reader)
  - [ ] Create feedback form
  - [ ] Fix critical issues
  - [ ] Iterate based on feedback

### 📊 Load Testing

- [ ] **7.7 Performance Testing**
  - Tool: Apache JMeter or k6
  - Scenarios:
    - [ ] 100 concurrent users on homepage
    - [ ] 50 users running calculators simultaneously
    - [ ] 10 admins editing articles
  - Metrics:
    - Response time < 2 seconds
    - Error rate < 1%
  - [ ] Identify bottlenecks
  - [ ] Optimize slow queries

### 🔒 Security Testing

- [ ] **7.8 Penetration Testing**
  - [ ] SQL injection attempts
  - [ ] XSS attack vectors
  - [ ] CSRF token validation
  - [ ] Brute force login attempts
  - [ ] File upload validation
  - Tool: OWASP ZAP or Burp Suite

- [ ] **7.9 Dependency Audit**
  - [ ] Run `npm audit`
  - [ ] Fix all high/critical vulnerabilities
  - [ ] Update outdated packages
  - [ ] Remove unused dependencies

---

## 8. Performance Optimization - Week 7-9

### ⚡ Frontend Performance

- [ ] **8.1 Lighthouse Score Optimization**
  - Target scores:
    - Performance: 90+
    - Accessibility: 90+
    - Best Practices: 90+
    - SEO: 100
  - [ ] Run audit on 10 key pages
  - [ ] Fix all recommendations

- [ ] **8.2 Core Web Vitals**
  - Targets (75th percentile):
    - LCP (Largest Contentful Paint): < 2.5s
    - FID (First Input Delay): < 100ms
    - CLS (Cumulative Layout Shift): < 0.1
  - [ ] Measure with Vercel Analytics
  - [ ] Optimize heavy components

- [ ] **8.3 Bundle Size Optimization**
  - Tools: `@next/bundle-analyzer`
  - [ ] Enable: `ANALYZE=true npm run build`
  - [ ] Identify large dependencies
  - [ ] Lazy load recharts (only on calculator pages)
  - [ ] Remove unused CSS

### 🗄️ Backend Performance

- [ ] **8.4 Database Indexing**
  - Critical indexes:
    ```sql
    CREATE INDEX idx_articles_status ON articles(status);
    CREATE INDEX idx_articles_published_date ON articles(published_date);
    CREATE INDEX idx_articles_category ON articles(category);
    CREATE INDEX idx_affiliate_products_clicks ON affiliate_products(clicks DESC);
    ```
  - [ ] Analyze slow queries (> 500ms)
  - [ ] Add indexes for frequently queried columns

- [ ] **8.5 Query Optimization**
  - [ ] Replace `SELECT *` with specific columns
  - [ ] Use pagination (limit/offset)
  - [ ] Avoid N+1 queries (use joins)
  - [ ] Cache frequently accessed data

- [ ] **8.6 Caching Strategy**
  - Levels:
    1. **Browser Cache**: Set headers on static assets
    2. **CDN Cache**: Vercel Edge Network (automatic)
    3. **Application Cache**: React Query (configured ✅)
    4. **Database Cache**: Redis (optional)
  - [ ] Implement Redis for:
    - Mutual fund NAVs (cache 1 hour)
    - Product listings (cache 15 minutes)
    - Trending articles (cache 5 minutes)
  - Provider: Upstash Redis (free tier available)

### 📦 Asset Optimization

- [ ] **8.7 Image Pipeline**
  - [ ] All images converted to WebP
  - [ ] Responsive image sizes (srcset)
  - [ ] Compression (80% quality)
  - [ ] Lazy loading (below fold)

- [ ] **8.8 Font Loading**
  - [ ] Use `next/font` for Google Fonts (already configured ✅)
  - [ ] Subset fonts (Latin + Devanagari)
  - [ ] Preload critical fonts
  - [ ] font-display: swap

---

## 9. Deployment & Infrastructure - Week 9-10

### 🚀 Pre-Deployment Checklist

- [ ] **9.1 Environment Variables**
  - [ ] Create `.env.production` with all API keys
  - [ ] Add to Vercel dashboard (Settings → Environment Variables)
  - [ ] Verify no sensitive data in Git

- [ ] **9.2 Domain Configuration**
  - [ ] Purchase domain: investingpro.in (GoDaddy/Namecheap)
  - [ ] Add to Vercel (Domains → Add)
  - [ ] Configure DNS:
    - A record: 76.76.21.21 (Vercel IP)
    - CNAME: cname.vercel-dns.com
  - [ ] SSL certificate (automatic via Vercel)

- [ ] **9.3 Database Migration**
  - [ ] Export dev database schema
  - [ ] Create production Supabase project
  - [ ] Run migrations in order (see `SCHEMA_EXECUTION_ORDER.md`)
  - [ ] Verify all tables created
  - [ ] Set up RLS policies

- [ ] **9.4 Email Domain Setup**
  - [ ] Configure SendGrid domain authentication
  - [ ] Add DNS records (SPF, DKIM, DMARC)
  - [ ] Test: Send email from noreply@investingpro.in
  - [ ] Verify deliverability

### 🏗️ Deployment Strategy

- [ ] **9.5 Staging Environment**
  - [ ] Create staging deployment: staging.investingpro.in
  - [ ] Use staging database (Supabase preview branch)
  - [ ] Test all features in staging
  - [ ] Performance test staging

- [ ] **9.6 Production Deployment**
  - Method: Vercel Git integration
  - [ ] Connect GitHub repo to Vercel
  - [ ] Set production branch: `main`
  - [ ] Configure build settings:
    ```
    Build Command: npm run build
    Output Directory: .next
    Install Command: npm install
    ```
  - [ ] Deploy
  - [ ] Verify all routes work

- [ ] **9.7 Post-Deployment Verification**
  - [ ] Homepage loads correctly
  - [ ] All navigation links work
  - [ ] Admin login successful
  - [ ] Database connections working
  - [ ] API routes responding
  - [ ] Images loading
  - [ ] Forms submitting
  - [ ] Calculators computing correctly

### 📊 Monitoring Setup

- [ ] **9.8 Application Monitoring**
  - [ ] Sentry errors dashboard
  - [ ] Vercel Analytics
  - [ ] Google Analytics traffic
  - [ ] Uptime Robot status

- [ ] **9.9 Database Monitoring**
  - [ ] Supabase dashboard (query performance)
  - [ ] Database size tracking
  - [ ] Connection pool usage
  - [ ] Set alerts for high CPU/memory

### 🔄 CI/CD Pipeline

- [ ] **9.10 GitHub Actions**
  - Create `.github/workflows/ci.yml`:
    ```yaml
    name: CI
    on: [push, pull_request]
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - run: npm install
          - run: npm run lint
          - run: npm test
          - run: npm run build
    ```
  - [ ] Enforce on all PRs
  - [ ] Block merge if tests fail

---

## 10. Post-Launch & Monitoring - Ongoing

### 📈 Week 1 After Launch

- [ ] **10.1 Issue Triage**
  - [ ] Monitor Sentry for errors (check 3x daily)
  - [ ] Review user feedback
  - [ ] Fix critical bugs within 24 hours

- [ ] **10.2 Performance Baseline**
  - [ ] Record initial metrics:
    - Page load times
    - Database query times
    - API response times
  - [ ] Set alerts for degradation (>20% slower)

- [ ] **10.3 SEO Indexing**
  - [ ] Google Search Console: Submit sitemap
  - [ ] Check indexing status daily
  - [ ] Fix crawl errors immediately
  - [ ] Create Google My Business listing

### 📊 Ongoing Maintenance

- [ ] **10.4 Content Publishing Schedule**
  - Target: 3-5 articles per week
  - Types:
    - 2x Comparison guides ("Best Credit Cards of 2025")
    - 1x Calculator tutorial ("How to Use SIP Calculator")
    - 1x News analysis (market trends)
    - 1x Educational ("What is XIRR?")
  - [ ] Create editorial calendar (3 months ahead)

- [ ] **10.5 Weekly Tasks**
  - [ ] Review analytics (GA4 dashboard)
  - [ ] Check Search Console (new issues?)
  - [ ] Monitor uptime (99.9% target)
  - [ ] Approve/reject user reviews
  - [ ] Update product data (rates changed?)

- [ ] **10.6 Monthly Tasks**
  - [ ] Security updates (`npm audit`)
  - [ ] Dependency updates (`npm outdated`)
  - [ ] Backup database (Supabase automatic, verify)
  - [ ] Review API costs (OpenAI, SendGrid)
  - [ ] Analyze top-performing content (double down)
  - [ ] A/B test results review

- [ ] **10.7 Quarterly Tasks**
  - [ ] Comprehensive SEO audit
  - [ ] Competitor analysis (BankBazaar, PolicyBazaar)
  - [ ] User survey (satisfaction, feature requests)
  - [ ] Review affiliate partnerships (renegotiate rates?)
  - [ ] Infrastructure cost optimization

### 🎯 Growth Milestones

- [ ] **10.8 Month 1 Goals**
  - [ ] 10,000 page views
  - [ ] 50 email subscribers
  - [ ] 100 products indexed
  - [ ] 20 articles published

- [ ] **10.9 Month 3 Goals**
  - [ ] 50,000 page views
  - [ ] 500 email subscribers
  - [ ] 500 products indexed
  - [ ] 100 articles published
  - [ ] First affiliate conversion

- [ ] **10.10 Month 6 Goals**
  - [ ] 200,000 page views
  - [ ] 2,000 email subscribers
  - [ ] 1,000 products indexed
  - [ ] Break-even revenue (₹50,000/month)

---

## 📋 Quick Reference: API Credentials Needed

### Tier 1: Essential (Required for Launch)

| Service | Purpose | Cost | Signup URL |
|---------|---------|------|------------|
| Supabase | Database, Auth, Storage | Free tier OK | https://supabase.com |
| Vercel | Hosting, Edge Functions | Free tier OK | https://vercel.com |
| OpenAI | AI content generation | ~$50/month | https://platform.openai.com |
| Google Analytics | Traffic tracking | Free | https://analytics.google.com |
| Google Search Console | SEO monitoring | Free | https://search.google.com/search-console |
| SendGrid | Transactional email | $15/month | https://sendgrid.com |
| Sentry | Error monitoring | Free tier OK | https://sentry.io |

### Tier 2: Important (Add Within Month)

| Service | Purpose | Cost | Signup URL |
|---------|---------|------|------------|
| ConvertKit/Mailchimp | Email marketing | $29/month | https://convertkit.com |
| Facebook API | Social auto-posting | Free | https://developers.facebook.com |
| Twitter API | Social auto-posting | Free | https://developer.twitter.com |
| UptimeRobot | Uptime monitoring | Free | https://uptimerobot.com |
| Razorpay | Payment processing | 2% + fees | https://razorpay.com |

### Tier 3: Optional (Nice to Have)

| Service | Purpose | Cost | Signup URL |
|---------|---------|------|------------|
| Ahrefs | SEO/keyword research | $99/month | https://ahrefs.com |
| Hotjar | Session recordings | $39/month | https://hotjar.com |
| LogRocket | Advanced debugging | $99/month | https://logrocket.com |
| Upstash Redis | Caching layer | Free tier OK | https://upstash.com |

---

## 🎯 Success Criteria (99% Perfection Defined)

### ✅ Technical

- [ ] Zero critical bugs (Sentry)
- [ ] 99.9% uptime (UptimeRobot)
- [ ] Lighthouse score 90+ (all pages)
- [ ] Zero console errors
- [ ] All ESLint errors fixed
- [ ] Test coverage > 80%
- [ ] Page load < 2 seconds (3G)

### ✅ Functionality

- [ ] All 40 routes working
- [ ] All forms submitting correctly
- [ ] All calculators computing accurately
- [ ] All images loading
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Accessibility score 90+

### ✅ Content

- [ ] 100+ articles published
- [ ] 500+ products indexed
- [ ] All product images present
- [ ] All SEO metadata complete
- [ ] All legal pages complete

### ✅ Automation

- [ ] RSS import running daily
- [ ] Trend articles generating
- [ ] Social auto-posting working
- [ ] Email notifications sending
- [ ] Scrapers updating data
- [ ] Scheduled publishing working

### ✅ Business

- [ ] Affiliate tracking functional
- [ ] Analytics tracking all events
- [ ] Newsletter signup working
- [ ] Payment gateway tested
- [ ] Customer support email configured

---

## 📅 Recommended Sprint Plan

### Sprint 1 (Week 1): Critical Fixes
- Fix editor crash
- Fix media library
- Fix NaN values
- Update Next.js
- Fix auth bypass

### Sprint 2 (Week 2): Security
- Add CSP headers
- Implement rate limiting
- Add SEBI disclaimers
- Complete privacy policy
- Security audit

### Sprint 3 (Week 3): Features
- Build content calendar
- Implement user management
- Add bulk operations
- Create settings page

### Sprint 4 (Week 4): APIs
- OpenAI integration
- Google Analytics setup
- Search Console setup
- SendGrid email
- Sentry errors

### Sprint 5 (Week 5): Automation
- RSS importer
- Trend generator
- Product scraper
- Auto-publisher
- Social posting

### Sprint 6 (Week 6): UI/UX
- Fix product cards
- Add images
- Add reviews
- Mobile optimization
- Hindi translation

### Sprint 7 (Week 7): Testing
- Unit tests
- E2E tests
- UAT
- Load testing
- Security testing

### Sprint 8 (Week 8): Performance
- Optimize images
- Database indexes
- Caching layer
- Bundle optimization
- Lighthouse audit

### Sprint 9 (Week 9): Pre-Launch
- Domain setup
- Staging deployment
- Production deployment
- Monitoring setup
- Final checks

### Sprint 10 (Week 10): Launch & Monitor
- Go live
- Monitor errors
- Fix issues
- Content publishing
- Growth tracking

---

## 🎓 Pro Tips

1. **Start with P0 bugs** - Don't add features until core works
2. **Test in production-like environment** - Staging with real data
3. **Monitor from day 1** - Sentry, Analytics, Uptime
4. **Automate everything** - Your competitive advantage
5. **Content is king** - Publish consistently (3-5 articles/week)
6. **Mobile-first** - 70% of India's traffic is mobile
7. **Hindi matters** - Add within first month
8. **Trust signals** - SEBI disclaimers, "How We Make Money" page
9. **User feedback** - Ship fast, iterate based on real usage
10. **Celebrate wins** - First 100 users, first ₹1000 revenue

---

**Total Tasks:** 420+  
**Complexity:** High  
**Impact:** Launching India's best financial comparison platform  

**Let's build this! 🚀**
