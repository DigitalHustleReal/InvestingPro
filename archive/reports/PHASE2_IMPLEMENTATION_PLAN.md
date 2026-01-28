# Phase 2: Core Automation Implementation Plan

**Status:** 🚀 **READY TO START**  
**Timeline:** Week 1 (Days 4-5) + Week 2  
**Goal:** Implement critical automation features

---

## Overview

Phase 2 focuses on **core automation** features that enable the CMS to operate more autonomously:
- Article versioning & audit trail
- Automated scraper pipeline
- Content automation enhancements

---

## 2.1 Article Versioning & Audit Trail (Priority: HIGH)

### Status:
- ✅ Database schema created (`article_versions`, `audit_log` tables)
- ⏳ Service implementation needed
- ⏳ UI components needed

### Tasks:

#### Task 2.1.1: Complete Versioning Service
**Time:** 4-6 hours  
**File:** `lib/cms/version-service.ts` (already exists, needs completion)

**Features:**
- Auto-create version on article update
- Compare versions to detect changes
- Rollback to previous version
- Generate change summaries

**Integration:**
- Update `articleService.saveArticle()` to create version
- Update `articleService.publishArticle()` to create version

#### Task 2.1.2: Version UI Components
**Time:** 3-4 hours  
**Files:**
- `components/admin/ArticleVersionHistory.tsx` - Version history view
- `components/admin/VersionComparison.tsx` - Compare versions
- `components/admin/RollbackDialog.tsx` - Rollback confirmation

**Features:**
- Display version history
- Show changes between versions
- Rollback functionality
- Change summary display

---

## 2.2 Automated Scraper Pipeline (Priority: HIGH)

### Status:
- ✅ AMFI scraper exists (`lib/amfi-scraper.ts`)
- ✅ Product scraper exists (`lib/scraper/product-data-scraper.ts`)
- ⏳ Credit card scraper needs completion
- ⏳ Cron jobs need setup

### Tasks:

#### Task 2.2.1: Complete Credit Card Scraper
**Time:** 8-12 hours  
**File:** `lib/scraper/credit-card-scraper.ts`

**Banks to Scrape:**
- HDFC Bank
- SBI Card
- ICICI Bank
- Axis Bank

**Features:**
- Playwright/Puppeteer for JavaScript-heavy sites
- Rate limiting (1 request per 2 seconds)
- Retry logic (3 attempts with exponential backoff)
- Data validation against schema
- Change detection (compare with previous run)

#### Task 2.2.2: Enhance Mutual Fund Scraper
**Time:** 4-6 hours  
**File:** `lib/scraper/product-data-scraper.ts`

**Enhancements:**
- Complete AMFI NAV scraping
- Add returns calculation
- Add expense ratio extraction
- Data validation

#### Task 2.2.3: Setup Scraper Cron Jobs
**Time:** 2-3 hours  
**Files:**
- `app/api/cron/scrape-credit-cards/route.ts`
- `app/api/cron/scrape-mutual-funds/route.ts`
- Update `vercel.json`

**Schedule:**
- Credit cards: Weekly (Sunday 2 AM IST)
- Mutual funds: Daily (5 AM IST, already exists)

---

## 2.3 Content Automation Enhancements

### Tasks:

#### Task 2.3.1: Auto-Interlinking
**Time:** 1 week  
**Files:**
- `lib/automation/auto-interlinking.ts`
- `app/api/automation/interlink-articles/route.ts`

**Features:**
- Find related articles automatically
- Insert internal links
- Update existing links
- Track link performance

#### Task 2.3.2: Social Auto-Posting
**Time:** 2 weeks  
**Files:**
- `lib/automation/social-poster.ts`
- `app/api/automation/post-to-social/route.ts`

**Platforms:**
- Twitter/X
- LinkedIn
- Facebook
- Instagram (if applicable)

#### Task 2.3.3: GSC Integration for Trends
**Time:** 2 weeks  
**Files:**
- `lib/analytics/gsc-trends.ts`
- `app/api/analytics/gsc-trends/route.ts`

**Features:**
- Fetch trending queries from GSC
- Identify content opportunities
- Auto-generate content ideas

#### Task 2.3.4: Deep SERP Analysis
**Time:** 2 weeks  
**Files:**
- `lib/seo/serp-analyzer.ts`
- `app/api/seo/analyze-serp/route.ts`

**Features:**
- Analyze top 10 results
- Identify content gaps
- Suggest improvements
- Track SERP features

---

## 📊 Phase 2 Timeline

### Week 1 (Days 4-5):
- ✅ Day 4: Versioning service + UI
- ✅ Day 5: Scraper setup + Credit card scraper start

### Week 2:
- ✅ Days 1-2: Complete credit card scraper
- ✅ Days 3-4: Mutual fund scraper enhancements
- ✅ Day 5: Cron jobs + Testing

### Week 3-4 (Optional):
- Auto-interlinking
- Social auto-posting
- GSC integration
- SERP analysis

---

## 🎯 Success Criteria

### Versioning:
- [ ] Version created on every save
- [ ] Version history displays correctly
- [ ] Rollback restores previous version
- [ ] Change summary shows differences

### Scrapers:
- [ ] Credit cards scraped from 4+ banks
- [ ] Mutual funds scraped from AMFI
- [ ] Data validated against schema
- [ ] Change detection working
- [ ] Cron jobs running automatically

### Automation:
- [ ] Auto-interlinking working
- [ ] Social posting configured
- [ ] GSC trends integrated
- [ ] SERP analysis functional

---

## 📁 Files to Create/Update

### Versioning:
- `lib/cms/version-service.ts` (update)
- `components/admin/ArticleVersionHistory.tsx` (create/update)
- `components/admin/VersionComparison.tsx` (create)
- `components/admin/RollbackDialog.tsx` (create)

### Scrapers:
- `lib/scraper/credit-card-scraper.ts` (create/update)
- `lib/scraper/product-data-scraper.ts` (update)
- `app/api/cron/scrape-credit-cards/route.ts` (create)
- `vercel.json` (update)

### Automation:
- `lib/automation/auto-interlinking.ts` (create)
- `lib/automation/social-poster.ts` (create)
- `lib/analytics/gsc-trends.ts` (create)
- `lib/seo/serp-analyzer.ts` (create)

---

## 🚀 Ready to Start

**Phase 1:** ✅ Complete  
**Phase 2:** 🚀 Ready to start

**First Task:** Article Versioning Service Implementation

---

**Last Updated:** 2026-01-XX
