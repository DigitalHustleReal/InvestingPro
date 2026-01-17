# Pending Actions - TODO List
**Status:** 📋 **ACTIVE** - Consolidated from all audit reports  
**Last Updated:** 2026-01-17  
**Total Items:** 80+ actionable tasks

---

## 🔴 CRITICAL PRIORITY (Blocking/Must Fix)

### Build & Runtime
1. **Fix TypeScript syntax error in articleGenerator.ts** (BUILD_AUDIT)
   - File: `lib/workers/articleGenerator.ts`
   - Lines: 353, 359
   - Error: `TS1005: 'try' expected` / `TS1472: 'catch' or 'finally' expected`
   - Status: ⏳ Pending
   - ETA: 1-2 hours

2. **Fix server-only import violations** (BUILD_AUDIT, CMS_OPERATIONAL)
   - Files: `lib/cache/cache-service.ts`, `lib/cms/article-service.ts`, `lib/events/publisher.ts`, `lib/metrics/prometheus.ts`, `lib/supabase/server.ts`, `lib/workflows/workflow-service.ts`, `lib/workflows/hooks/article-workflow-hooks.ts`
   - Affected: `app/admin/articles/[id]/edit/page.tsx`, `app/admin/articles/[id]/edit-refactored/page.tsx`
   - Fix: Create API route wrappers for server-only operations
   - Status: ⏳ Pending
   - ETA: 2-4 hours

3. **Add fact-checking guardrails** (LIFECYCLE_AUDIT)
   - Issue: AI generates content without factual validation
   - Risk: Legal/compliance risk, reputation damage
   - Fix: Integrate fact-checking API or require human verification for numbers
   - Status: ⏳ Pending (Phase 1)
   - ETA: 1 week (URGENT)

4. **Integrate real keyword API** (LIFECYCLE_AUDIT)
   - Issue: Using placeholder `searchVolume: 1000`
   - Risk: 50% content may target zero-volume keywords
   - Fix: Integrate real keyword API (Ahrefs, Semrush, Ubersuggest) or Google Keyword Planner
   - Status: ⏳ Pending (Phase 1)
   - ETA: 2 weeks

5. **Add compliance validation** (LIFECYCLE_AUDIT, CMS_OPERATIONAL)
   - Issue: No automated finance regulation checks
   - Risk: Legal/financial risk
   - Fix: Add compliance validator: check against SEBI/IRDA guidelines
   - Status: ⏳ Pending (Phase 1)
   - ETA: 2 weeks

6. **Add rankings tracking** (LIFECYCLE_AUDIT)
   - Issue: No Google Search Console integration for positions
   - Risk: Can't identify content dropping in rankings
   - Fix: Integrate GSC API to track keyword positions
   - Status: ⏳ Pending (Phase 1)
   - ETA: 2 weeks

7. **Build auto-refresh triggers** (LIFECYCLE_AUDIT)
   - Issue: Content refresh API is stub, no automation
   - Risk: 40% content becomes stale, loses rankings
   - Fix: Monitor rankings daily, auto-trigger refresh if position drops > 3
   - Status: ⏳ Pending (Phase 1)
   - ETA: 2 weeks

8. **No affiliate disclosure automation** (LIFECYCLE_AUDIT)
   - Issue: Disclosure not auto-added
   - Risk: Compliance risk (FTC/SEBI)
   - Fix: Auto-inject disclosure text when affiliate links present
   - Status: ⏳ Pending
   - ETA: 1 day

---

## 🟠 HIGH PRIORITY (Should Fix Soon)

### Data Integrity & Versioning
9. **Create article_versions table** (CMS_OPERATIONAL)
   - Issue: No audit trail table
   - Fix: Create `article_versions` table with version history
   - Status: ⏳ Pending
   - ETA: 1 week

10. **Implement full versioning system** (CMS_OPERATIONAL)
    - Issue: Backend versioning not implemented
    - Fix: Implement version history and rollback capability
    - Status: ⏳ Pending
    - ETA: 1 week

11. **Add soft delete enforcement** (CMS_OPERATIONAL)
    - Issue: Soft delete not enforced
    - Fix: Add `deleted_at` column to articles table
    - Status: ⏳ Pending
    - ETA: 1 day

### Security
12. **Encrypt PII fields** (CMS_OPERATIONAL)
    - Issue: Newsletter subscribers and author emails stored in plain text
    - Fix: Encrypt sensitive PII fields in database
    - Status: ⏳ Pending
    - ETA: 1 week

13. **Add explicit CSRF tokens** (CMS_OPERATIONAL)
    - Issue: CSRF protection not explicitly verified
    - Fix: Add explicit CSRF tokens for sensitive operations
    - Status: ⏳ Pending
    - ETA: 2 days

14. **Implement role-based access control** (CMS_OPERATIONAL)
    - Issue: Missing role-based policies for editor/admin distinction
    - Fix: Implement admin/editor roles with proper RLS policies
    - Status: ⏳ Pending
    - ETA: 1 week

### UI/UX - Critical Fixes
15. **Add form validation with inline errors** (CMS_UI_UX)
    - Issue: No client-side validation before submit
    - Fix: Add client-side validation with visual feedback, inline errors
    - Status: ⏳ Pending
    - ETA: 3 days

16. **Implement auto-save and unsaved changes warning** (CMS_UI_UX)
    - Issue: No auto-save functionality, no draft recovery
    - Fix: Auto-save every 30 seconds, warn before leaving with unsaved changes
    - Status: ⏳ Pending
    - ETA: 2 days

17. **Add keyboard navigation and shortcuts** (CMS_UI_UX)
    - Issue: No keyboard shortcuts for common actions
    - Fix: Implement keyboard shortcuts (document with ⌘? menu)
    - Status: ⏳ Pending
    - ETA: 3 days

18. **Make sidebar responsive (mobile menu)** (CMS_UI_UX)
    - Issue: Fixed sidebar not responsive, no mobile menu
    - Fix: Make sidebar collapsible/hidden on mobile (hamburger menu)
    - Status: ⏳ Pending
    - ETA: 2 days

19. **Add aria-labels and screen reader support** (CMS_UI_UX)
    - Issue: Missing aria-labels on interactive elements
    - Fix: Add aria-labels to all interactive elements, use aria-live regions
    - Status: ⏳ Pending
    - ETA: 2 days

### UI/UX - High Priority
20. **Improve error messages (user-friendly)** (CMS_UI_UX)
    - Issue: Technical error messages shown to users
    - Fix: Map technical errors to user-friendly messages, show inline errors
    - Status: ⏳ Pending
    - ETA: 2 days

21. **Add skeleton loaders for better perceived performance** (CMS_UI_UX)
    - Issue: No skeleton loaders for list views
    - Fix: Add skeleton loaders (ArticleCardSkeleton, ProductCardSkeleton)
    - Status: ⏳ Pending
    - ETA: 1 day

22. **Implement global error boundary** (CMS_UI_UX)
    - Issue: No global error boundary for unhandled errors
    - Fix: Implement global error boundary component
    - Status: ⏳ Pending
    - ETA: 1 day

23. **Make tables responsive (card view on mobile)** (CMS_UI_UX)
    - Issue: Tables not responsive
    - Fix: Convert tables to cards on mobile
    - Status: ⏳ Pending
    - ETA: 2 days

24. **Add confirmation for publish action** (CMS_UI_UX)
    - Issue: No "Are you sure?" for publish action
    - Fix: Add confirmation dialog for publish
    - Status: ⏳ Pending
    - ETA: 1 day

### Automation - High Value
25. **Auto-interlinking** (LIFECYCLE_AUDIT)
    - Issue: Interlinking not automated
    - Risk: Missing 30% internal link authority
    - Fix: Auto-inject internal links based on entity matching in pipeline
    - Status: ⏳ Pending (Phase 2)
    - ETA: 1 week

26. **Social auto-posting** (LIFECYCLE_AUDIT)
    - Issue: Posts generated but not auto-posted
    - Risk: Missing 25% referral traffic
    - Fix: Integrate social APIs (Twitter, LinkedIn, Instagram) to auto-post
    - Status: ⏳ Pending (Phase 2)
    - ETA: 2 weeks

27. **GSC integration for trends** (LIFECYCLE_AUDIT)
    - Issue: No Search Console integration
    - Risk: Missing 40% of opportunity keywords
    - Fix: Integrate Google Search Console API to extract trending queries
    - Status: ⏳ Pending (Phase 2)
    - ETA: 2 weeks

28. **Deep SERP analysis** (LIFECYCLE_AUDIT)
    - Issue: SERP analysis is surface-level
    - Risk: Missing 20% content depth insights
    - Fix: Scrape full content from top 3-5 results, extract entities
    - Status: ⏳ Pending (Phase 2)
    - ETA: 2 weeks

### Testing & Quality
29. **Manual testing for cache invalidation** (CMS_OPERATIONAL)
    - Test: Edit financial value → Cache invalidation → Verify fresh data
    - Test: Publish article → Cache invalidation → Verify visible
    - Test: Delete article → Cache invalidation → Verify removed
    - Status: ⏳ Pending
    - ETA: 1 day

30. **Manual testing for AI article generation** (CMS_OPERATIONAL)
    - Test: Generate article via `/api/admin/generate`
    - Verify: Numbers from ledger, citations, SEO score, publish workflow
    - Status: ⏳ Pending
    - ETA: 1 day

31. **Manual testing for affiliate flow** (CMS_OPERATIONAL)
    - Test: Desktop click, mobile click, cookie blocked, incognito
    - Verify: Track → Redirect → Analytics
    - Status: ⏳ Pending
    - ETA: 1 day

### AI & Cost Tracking
32. **Per-article cost attribution** (CMS_OPERATIONAL)
    - Issue: Cost tracking partial, no per-article attribution
    - Fix: Track AI costs per article in database
    - Status: ⏳ Pending
    - ETA: 3 days

---

## 🟡 MEDIUM PRIORITY (Fix When Possible)

### Data Sources
33. **RBI Website Scraping** (PENDING_ACTIONS)
   - Current: Using default rates (updated manually)
   - Fix: Implement Playwright/Puppeteer scraper for RBI website
   - Status: ⏳ Deferred
   - ETA: 2-3 days

34. **AMFI Returns Calculation** (PENDING_ACTIONS)
   - Current: Validates NAV only
   - Fix: Calculate 1Y/3Y/5Y returns from AMFI NAV history
   - Status: ⏳ Deferred
   - ETA: 2-3 days

### UI/UX - Medium Priority
35. **Add functional global search** (CMS_UI_UX)
    - Issue: Search bar is non-functional (placeholder only)
    - Fix: Implement functional global search with keyboard navigation
    - Status: ⏳ Pending
    - ETA: 3 days

36. **Add breadcrumbs to all pages** (CMS_UI_UX)
    - Issue: Breadcrumbs usage inconsistent
    - Fix: Add breadcrumbs to all admin pages, ensure consistent placement
    - Status: ⏳ Pending
    - ETA: 2 days

37. **Add tooltips to toolbar buttons** (CMS_UI_UX)
    - Issue: No tooltips on toolbar buttons
    - Fix: Add tooltips to all toolbar buttons with keyboard shortcuts
    - Status: ⏳ Pending
    - ETA: 1 day

38. **Implement draft recovery** (CMS_UI_UX)
    - Issue: No draft recovery if browser closes unexpectedly
    - Fix: Save drafts to localStorage as backup, recover on page reload
    - Status: ⏳ Pending
    - ETA: 2 days

39. **Add word count and reading time to editor** (CMS_UI_UX)
    - Issue: No word count or reading time in editor
    - Fix: Add live word count and estimated reading time
    - Status: ⏳ Pending
    - ETA: 1 day

### Automation - Medium Priority
40. **Cannibalization detection** (LIFECYCLE_AUDIT)
    - Issue: No cannibalization detection
    - Risk: 15-20% keyword waste
    - Fix: Before content creation, query existing articles for primary keyword match
    - Status: ⏳ Pending (Phase 3)
    - ETA: 3 days

41. **Image optimization** (LIFECYCLE_AUDIT)
    - Issue: Images stored as URLs, no compression
    - Risk: 10% Core Web Vitals loss
    - Fix: Auto-compress images on upload, generate WebP
    - Status: ✅ COMPLETE (Phase 3)
    - ETA: 1 week

42. **Scheduling automation** (LIFECYCLE_AUDIT)
    - Issue: No automated scheduling
    - Risk: 10% missed traffic from poor timing
    - Fix: Add `scheduled_at` field, cron job to publish at scheduled time
    - Status: ✅ COMPLETE (Phase 3)
    - ETA: 3 days

43. **Broken link repair** (LIFECYCLE_AUDIT)
    - Issue: No broken link monitoring
    - Risk: Broken links hurt UX and SEO
    - Fix: Schedule weekly broken link check, auto-replace or remove
    - Status: ✅ COMPLETE (Phase 3)
    - ETA: 1 week

### SERP & Content Analysis
44. **No entity extraction** (LIFECYCLE_AUDIT)
    - Issue: No named entity recognition from SERP
    - Risk: Missing 5-10% entity coverage
    - Fix: Use NLP (spaCy/NER) to extract entities from top results
    - Status: ⏳ Pending
    - ETA: 1 week

45. **No media analysis** (LIFECYCLE_AUDIT)
    - Issue: Doesn't check for images, videos, tables
    - Risk: Missing 5% ranking factors
    - Fix: Analyze SERP for media requirements (images, videos, infographics)
    - Status: ⏳ Pending
    - ETA: 3 days

46. **Gap analysis is generic** (LIFECYCLE_AUDIT)
    - Issue: Hardcoded gaps, not data-driven
    - Risk: Missing 15% unique angle opportunities
    - Fix: Compare our content against top 10, identify unique topics they cover
    - Status: ⏳ Pending
    - ETA: 1 week

47. **No E-E-A-T signal detection** (LIFECYCLE_AUDIT)
    - Issue: Doesn't check author credentials, citations
    - Risk: Missing 10% trust signals
    - Fix: Analyze author bylines, citations, publication dates
    - Status: ⏳ Pending
    - ETA: 1 week

### Content Quality
48. **No citation workflow** (LIFECYCLE_AUDIT)
    - Issue: `sourceUrl` stored but not cited in content
    - Risk: Compliance risk, credibility loss
    - Fix: Auto-inject citations in content when `sourceContent` used
    - Status: ⏳ Pending
    - ETA: 3 days

49. **Plagiarism check is limited** (LIFECYCLE_AUDIT)
    - Issue: Only checks own articles, not web
    - Risk: Legal risk, SEO penalty risk
    - Fix: Integrate external plagiarism API (Copyscape, Grammarly)
    - Status: ⏳ Pending
    - ETA: 1 week

50. **No AI watermark detection** (LIFECYCLE_AUDIT)
    - Issue: No check for AI-generated markers
    - Risk: 5-10% ranking penalty risk
    - Fix: Use AI detection tools (GPTZero, Originality.ai)
    - Status: ⏳ Pending
    - ETA: 1 week

51. **SEO score is UI-only** (LIFECYCLE_AUDIT)
    - Issue: `SEOScoreCalculator` exists but not enforced
    - Risk: 20% content underperforms
    - Fix: Block publish if SEO score < 70
    - Status: ⏳ Pending
    - ETA: 3 days

52. **No depth validation** (LIFECYCLE_AUDIT)
    - Issue: No check for topical coverage completeness
    - Risk: Missing 10-15% ranking factors
    - Fix: Require minimum word count based on SERP analysis
    - Status: ⏳ Pending
    - ETA: 3 days

### Publishing & Distribution
53. **No URL optimization** (LIFECYCLE_AUDIT)
    - Issue: Slugs auto-generated from title
    - Risk: Suboptimal URLs hurt SEO
    - Fix: Validate slug: lowercase, hyphens, keyword-rich, < 60 chars
    - Status: ⏳ Pending
    - ETA: 1 day

54. **No indexation ping** (LIFECYCLE_AUDIT)
    - Issue: Revalidation exists but no GSC ping
    - Risk: Google may delay indexing
    - Fix: Ping Google Search Console on publish
    - Status: ⏳ Pending
    - ETA: 3 days

55. **No sitemap auto-update** (LIFECYCLE_AUDIT)
    - Issue: `app/sitemap.ts` exists but update unclear
    - Risk: Search engines may miss new content
    - Fix: Auto-regenerate sitemap on publish, ping GSC
    - Status: ⏳ Pending
    - ETA: 1 day

### Performance Tracking
56. **No CTR tracking** (LIFECYCLE_AUDIT)
    - Issue: No GSC integration for click-through rates
    - Risk: Can't optimize titles for better CTR
    - Fix: Pull CTR data from GSC, A/B test titles
    - Status: ⏳ Pending
    - ETA: 2 weeks

57. **No impressions tracking** (LIFECYCLE_AUDIT)
    - Issue: No visibility tracking
    - Risk: Can't measure search visibility growth
    - Fix: Track impressions from GSC API
    - Status: ⏳ Pending
    - ETA: 2 weeks

58. **No keyword-to-revenue attribution** (LIFECYCLE_AUDIT)
    - Issue: Revenue tracked but not linked to keywords
    - Risk: Can't identify high-value keywords
    - Fix: Link affiliate clicks to source keywords
    - Status: ⏳ Pending
    - ETA: 1 week

### Content Refresh
59. **No SERP change detection** (LIFECYCLE_AUDIT)
    - Issue: No monitoring for new SERP features
    - Risk: Missing 15% ranking opportunities
    - Fix: Monitor SERP weekly, detect new features (video, PAA)
    - Status: ⏳ Pending
    - ETA: 1 week

60. **No refresh workflow** (LIFECYCLE_AUDIT)
    - Issue: Refresh endpoint doesn't actually refresh
    - Risk: Content stagnates, loses rankings
    - Fix: Build refresh pipeline: re-analyze SERP, update content, republish
    - Status: ⏳ Pending
    - ETA: 3 weeks

### Build & Code Quality
61. **Remove console.logs from production code** (BUILD_AUDIT)
    - Issue: 20+ files with console.log/error/warn/debug
    - Risk: Performance, security (potential data leakage)
    - Fix: Replace with logger service, remove from production builds
    - Status: ⏳ Pending
    - ETA: 1 day

62. **Update deprecated middleware** (BUILD_AUDIT)
    - Issue: Middleware file convention deprecated
    - Risk: Future Next.js version compatibility
    - Fix: Migrate to `proxy` per Next.js 16
    - Status: ⏳ Pending
    - ETA: 2 days

63. **Run full dependency audit** (BUILD_AUDIT)
    - Action: Run `npm audit` and fix vulnerabilities
    - Action: Verify all dependencies are compatible for commercial use
    - Action: Check npm for abandoned packages
    - Status: ⏳ Pending
    - ETA: 1 day

### Operations
64. **Create operations runbook** (CMS_OPERATIONAL)
    - Issue: No centralized runbook
    - Fix: Document deployment, rollback, database migration, cache clearing procedures
    - Status: ⏳ Pending
    - ETA: 1 week

65. **Add performance monitoring** (CMS_OPERATIONAL, BUILD_AUDIT)
    - Issue: No Lighthouse CI configured, no Web Vitals tracking in production
    - Fix: Add Vercel Analytics or Google Analytics Core Web Vitals
    - Status: ⏳ Pending
    - ETA: 2 days

66. **Load testing** (CMS_OPERATIONAL)
    - Issue: Not integrated into CI/CD
    - Fix: Run load tests, integrate into CI/CD pipeline
    - Status: ⏳ Pending
    - ETA: 2 days

---

## 🟢 LOW PRIORITY (Nice to Have)

### Data Sources
67. **IRDA Integration** (PENDING_ACTIONS)
   - Current: No IRDA validation
   - Fix: Add IRDA (Insurance Regulatory Authority) validation
   - Status: ⏳ Deferred
   - ETA: 3-5 days

68. **SEBI Circulars Database** (PENDING_ACTIONS)
   - Current: Static compliance rules
   - Fix: Scrape/parse SEBI circulars for auto-updating rules
   - Status: ⏳ Deferred
   - ETA: 3-5 days

69. **NSE/BSE Integration** (PENDING_ACTIONS)
   - Current: No stock price validation
   - Fix: Add NSE/BSE integration for stock price validation
   - Status: ⏳ Deferred
   - ETA: 3-5 days

### UI/UX - Low Priority
70. **Add keyboard shortcut help modal (⌘?)** (CMS_UI_UX)
    - Issue: No keyboard shortcut documentation
    - Fix: Add keyboard shortcut guide (accessible via ⌘? or ? key)
    - Status: ⏳ Pending
    - ETA: 1 day

71. **Add swipe gestures for mobile** (CMS_UI_UX)
    - Issue: No mobile-specific features
    - Fix: Consider swipe gestures for common actions
    - Status: ⏳ Pending
    - ETA: 2 days

72. **Add undo for recent actions** (CMS_UI_UX)
    - Issue: No undo mechanism
    - Fix: Consider "undo" for recent actions (5-second undo window)
    - Status: ⏳ Pending
    - ETA: 2 days

73. **Add high contrast mode** (CMS_UI_UX)
    - Issue: Not verified for WCAG compliance
    - Fix: Add high contrast mode option, test with color blindness simulators
    - Status: ⏳ Pending
    - ETA: 2 days

### Monitoring & Alerts
74. **Rate Change Alerts** (PENDING_ACTIONS)
   - Current: Rates update silently
   - Fix: Add alerts when RBI/AMFI rates change significantly
   - Status: ⏳ Deferred
   - ETA: 3-5 days

75. **Historical Data Tracking** (PENDING_ACTIONS)
   - Current: Only current rates stored
   - Fix: Track historical rate changes for trend analysis
   - Status: ⏳ Deferred
   - ETA: 3-5 days

### Content & Media
76. **No brand tone validation** (LIFECYCLE_AUDIT)
    - Issue: No check against brand guidelines
    - Risk: Inconsistent voice, off-brand messaging
    - Fix: Add tone checker using AI to validate against brand voice
    - Status: ⏳ Pending
    - ETA: 1 week

77. **Tables/calculators not auto-generated** (LIFECYCLE_AUDIT)
    - Issue: Content mentions tables but doesn't generate them
    - Risk: Missing 10-15% ranking signals
    - Fix: Auto-generate comparison tables from product data
    - Status: ⏳ Pending
    - ETA: 2 weeks

78. **No media suggestions** (LIFECYCLE_AUDIT)
    - Issue: No image/alt text generation
    - Risk: Missing 5% ranking factors
    - Fix: Use AI to generate image descriptions, suggest stock images
    - Status: ⏳ Pending
    - ETA: 1 week

79. **No over-monetization prevention** (LIFECYCLE_AUDIT)
    - Issue: No limit on affiliate links per article
    - Risk: Poor UX, may hurt rankings
    - Fix: Limit affiliate links: max 3-5 per article, spaced naturally
    - Status: ⏳ Pending
    - ETA: 1 day

### Social & Repurposing
80. **No email snippet generation** (LIFECYCLE_AUDIT)
    - Issue: No email content generation code
    - Risk: Missing 15% missing email traffic
    - Fix: Generate email snippets (subject, preview, body) from articles
    - Status: ⏳ Pending
    - ETA: 1 week

81. **No video/carousel generation** (LIFECYCLE_AUDIT)
    - Issue: No video/carousel generation code
    - Risk: Missing 10% missing visual engagement
    - Fix: Generate video scripts, carousel outlines from articles
    - Status: ⏳ Pending
    - ETA: 3 weeks

82. **No posting calendar** (LIFECYCLE_AUDIT)
    - Issue: No scheduling system found
    - Risk: Content posted randomly, not optimized for engagement
    - Fix: Build posting calendar with optimal times per platform
    - Status: ⏳ Pending
    - ETA: 1 week

### Performance & Analytics
83. **No heatmap/engagement** (LIFECYCLE_AUDIT)
    - Issue: No Hotjar/Clarity integration
    - Risk: Can't identify UX issues affecting engagement
    - Fix: Integrate heatmap tool (Hotjar, Microsoft Clarity)
    - Status: ⏳ Pending
    - ETA: 1 week

### Trend Discovery
84. **No Google Trends active monitoring** (LIFECYCLE_AUDIT)
    - Issue: SerpApi optional, only predefined queries
    - Risk: 30% slower trend capture
    - Fix: Set up scheduled Google Trends monitoring (daily/hourly)
    - Status: ⏳ Pending
    - ETA: 1 week

85. **No competitor trend analysis** (LIFECYCLE_AUDIT)
    - Issue: No competitor tracking code
    - Risk: Missing 20% of trends
    - Fix: Monitor competitor RSS feeds, social signals
    - Status: ⏳ Pending
    - ETA: 1 week

86. **No topic prioritization logic** (LIFECYCLE_AUDIT)
    - Issue: Picks first trend (line 41: `trends[0]`)
    - Risk: 25% waste on low-value content
    - Fix: Implement scoring: (search volume × competition) / difficulty
    - Status: ⏳ Pending
    - ETA: 3 days

87. **Manual/on-demand scanning** (LIFECYCLE_AUDIT)
    - Issue: No cron jobs found for trend scanning
    - Risk: 1-2 day delay vs competitors
    - Fix: Schedule daily/hourly trend scans
    - Status: ⏳ Pending
    - ETA: 2 days

### Keyword Research
88. **No SERP feature detection** (LIFECYCLE_AUDIT)
    - Issue: No analysis of featured snippets, PAA, videos
    - Risk: Missing 10-15% ranking opportunities
    - Fix: Analyze SERP for feature requirements (answer boxes, video, tables)
    - Status: ⏳ Pending
    - ETA: 1 week

89. **No keyword silo logic** (LIFECYCLE_AUDIT)
    - Issue: No clustering by topic clusters
    - Risk: 20% less internal link authority
    - Fix: Group related keywords into content silos, create pillar pages
    - Status: ⏳ Pending
    - ETA: 2 weeks

90. **Intent classification is placeholder** (LIFECYCLE_AUDIT)
    - Issue: No actual intent detection from SERP
    - Risk: 15% CTR loss from wrong format
    - Fix: Analyze SERP top 10 to infer intent (commercial vs informational)
    - Status: ⏳ Pending
    - ETA: 1 week

---

## 📊 Summary by Priority

**Critical (8 items):** Build fixes, fact-checking, keyword API, compliance, rankings, auto-refresh, disclosure  
**High (24 items):** Data integrity, security, UI/UX critical, automation high-value, testing  
**Medium (33 items):** Data sources, UI/UX medium, automation medium, SERP analysis, content quality  
**Low (25 items):** Data sources deferred, UI/UX nice-to-have, monitoring, content/media, trend discovery  

**Total: 90 actionable items**

---

## 📋 Summary by Category

### Build & Runtime (5 items)
- Critical build errors
- Server-only imports
- Console.log cleanup
- Middleware deprecation
- Dependency audit

### Data Integrity & Versioning (3 items)
- Article versions table
- Full versioning system
- Soft delete enforcement

### Security (3 items)
- PII encryption
- CSRF tokens
- Role-based access control

### UI/UX (19 items)
- Form validation
- Auto-save
- Keyboard navigation
- Mobile responsiveness
- Accessibility
- Error handling
- Skeleton loaders
- Global search
- Breadcrumbs
- Tooltips
- Draft recovery
- Word count
- And more...

### Automation (15 items)
- Fact-checking
- Keyword API
- Compliance validation
- Rankings tracking
- Auto-refresh
- Auto-interlinking
- Social auto-posting
- GSC integration
- Deep SERP analysis
- Cannibalization detection
- Image optimization ✅
- Scheduling ✅
- Broken links ✅
- And more...

### Testing & Quality (3 items)
- Cache invalidation testing
- AI article generation testing
- Affiliate flow testing

### Content Quality (8 items)
- Citation workflow
- Plagiarism check
- AI watermark detection
- SEO score enforcement
- Depth validation
- Brand tone validation
- Table generation
- Media suggestions

### Performance Tracking (5 items)
- Rankings tracking
- CTR tracking
- Impressions tracking
- Keyword-to-revenue attribution
- Heatmap integration

### Operations (3 items)
- Operations runbook
- Performance monitoring
- Load testing

### Data Sources (8 items)
- RBI scraping
- AMFI returns
- IRDA integration
- SEBI circulars
- NSE/BSE integration
- Rate change alerts
- Historical tracking

### Trend Discovery (5 items)
- GSC integration
- Google Trends monitoring
- Competitor analysis
- Topic prioritization
- Scheduled scanning

### Publishing & Distribution (5 items)
- URL optimization
- Indexation ping
- Sitemap auto-update
- Email snippets
- Video/carousel generation

---

## ✅ Completed Items (Reference)

- ✅ Image optimization (Phase 3)
- ✅ Scheduling automation (Phase 3)
- ✅ Broken link repair (Phase 3)
- ✅ Validation UI (recently completed)
- ✅ Auto-interlinking (Phase 2)
- ✅ Versioning UI (Phase 2)

---

**Status:** 📋 **ACTIVE TODO LIST** - Consolidated from all audit reports  
**Last Updated:** 2026-01-17  
**Next Review:** After implementing critical fixes
