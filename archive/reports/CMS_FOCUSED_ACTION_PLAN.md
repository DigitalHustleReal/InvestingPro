# CMS Focused Action Plan
**Priority:** CMS First  
**Based on:** CMS_OPERATIONAL_AUDIT_REPORT.md, CMS_UI_UX_AUDIT_REPORT.md, FULL_LIFECYCLE_OPERATIONAL_AUDIT.md  
**Last Updated:** 2026-01-17

---

## 📋 CMS-Specific Tasks Summary

**Total CMS Tasks:** 65+ actionable items  
**Organized by:** Build → Core Features → Automation → UI/UX → Testing

---

## 🔴 CRITICAL PRIORITY (Must Fix to Unblock CMS)

### Build & Runtime - Blocking CMS Editor

1. **Fix TypeScript syntax error in articleGenerator.ts** ⚡ URGENT
   - File: `lib/workers/articleGenerator.ts`
   - Lines: 353, 359
   - Error: `TS1005: 'try' expected` / `TS1472: 'catch' or 'finally' expected`
   - **Blocks:** Article generation workflow
   - **Fix Time:** 1-2 hours
   - **Reference:** BUILD_AUDIT, CMS_OPERATIONAL

2. **Fix server-only import violations** ⚡ URGENT
   - **Files affected:**
     - `lib/cms/article-service.ts`
     - `lib/cache/cache-service.ts`
     - `lib/events/publisher.ts`
     - `lib/workflows/workflow-service.ts`
   - **Affected CMS pages:**
     - `app/admin/articles/[id]/edit/page.tsx` ❌ BLOCKED
     - `app/admin/articles/[id]/edit-refactored/page.tsx` ❌ BLOCKED
   - **Fix:** Create API routes `/api/admin/articles/[id]` (GET, PUT, DELETE)
   - **Fix Time:** 2-4 hours
   - **Reference:** CMS_OPERATIONAL Section 2.2
   - **Implementation:** See `docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md` → Phase 1 → Task 1.1.1

### Content Safety & Compliance - Legal Risk

3. **Add fact-checking guardrails** ⚡ URGENT
   - Issue: AI generates content without factual validation
   - Risk: Legal/compliance risk, reputation damage
   - **Fix:** Integrate fact-checking API or require human verification for numbers
   - **Status:** ⏳ Phase 1 (already started - see PHASE1_IMPLEMENTATION_STATUS.md)
   - **Fix Time:** 1 week
   - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 4

4. **Add compliance validation** ⚡ URGENT
   - Issue: No automated finance regulation checks
   - Risk: Legal/financial risk (SEBI, IRDA violations)
   - **Fix:** Add compliance validator: check against SEBI/IRDA guidelines
   - **Status:** ⏳ Phase 1 (already started - see PHASE1_IMPLEMENTATION_STATUS.md)
   - **Fix Time:** 2 weeks
   - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 5, CMS_OPERATIONAL Section 5.6

5. **No affiliate disclosure automation** ⚡ URGENT
   - Issue: Disclosure not auto-added when affiliate links present
   - Risk: Compliance risk (FTC/SEBI)
   - **Fix:** Auto-inject disclosure text when affiliate links present
   - **Fix Time:** 1 day
   - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 7

---

## 🟠 HIGH PRIORITY (Core CMS Features)

### Data Integrity & Versioning

6. **Create article_versions table** 
   - Issue: No audit trail table
   - **Fix:** Create `article_versions` table with version history
   - **Files to Create:**
     - `supabase/migrations/XXXXXX_article_versions.sql`
   - **Fix Time:** 1 day
   - **Reference:** CMS_OPERATIONAL Section 4.2, 4.3
   - **Implementation:** See `docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md` → Phase 2 → Task 2.1.1

7. **Implement full versioning system**
   - Issue: Backend versioning not fully implemented
   - **Fix:** Implement version history and rollback capability
   - **Files to Create/Update:**
     - `lib/cms/version-service.ts` (enhance)
     - API routes for version management
   - **Status:** ⏳ Partially complete (UI exists, backend needs work)
   - **Fix Time:** 1 week
   - **Reference:** CMS_OPERATIONAL Section 4.3, 4.5

8. **Add soft delete enforcement**
   - Issue: Soft delete not enforced
   - **Fix:** Add `deleted_at` column to articles table
   - **Fix Time:** 1 day
   - **Reference:** CMS_OPERATIONAL Section 4.2

### Security

9. **Encrypt PII fields**
   - Issue: Newsletter subscribers and author emails stored in plain text
   - **Fix:** Encrypt sensitive PII fields in database
   - **Fix Time:** 1 week
   - **Reference:** CMS_OPERATIONAL Section 7.5

10. **Add explicit CSRF tokens**
    - Issue: CSRF protection not explicitly verified
    - **Fix:** Add explicit CSRF tokens for sensitive operations (article save, publish, delete)
    - **Fix Time:** 2 days
    - **Reference:** CMS_OPERATIONAL Section 7.2

11. **Implement role-based access control**
    - Issue: Missing role-based policies for editor/admin distinction
    - **Fix:** Implement admin/editor roles with proper RLS policies
    - **Fix Time:** 1 week
    - **Reference:** CMS_OPERATIONAL Section 7.1, 7.7

### CMS UI/UX - Critical Editor Improvements

12. **Add form validation with inline errors**
    - Issue: No client-side validation before submit
    - **Fix:** Add client-side validation with visual feedback, inline errors
    - **Files to Update:**
      - `components/admin/ArticleEditor.tsx` (or article edit page)
      - `components/admin/ArticleForm.tsx`
    - **Fix Time:** 3 days
    - **Reference:** CMS_UI_UX Section 2.1

13. **Implement auto-save and unsaved changes warning**
    - Issue: No auto-save functionality, no draft recovery
    - **Fix:** Auto-save every 30 seconds, warn before leaving with unsaved changes
    - **Files to Update:**
      - Article editor component
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 8.2

14. **Add keyboard navigation and shortcuts**
    - Issue: No keyboard shortcuts for common actions
    - **Fix:** Implement keyboard shortcuts (Cmd+S to save, Cmd+P to publish, etc.)
    - **Fix Time:** 3 days
    - **Reference:** CMS_UI_UX Section 4.1

15. **Make sidebar responsive (mobile menu)**
    - Issue: Fixed sidebar not responsive, no mobile menu
    - **Fix:** Make sidebar collapsible/hidden on mobile (hamburger menu)
    - **Files to Update:**
      - `components/admin/AdminLayout.tsx` or sidebar component
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 5.1

16. **Add aria-labels and screen reader support**
    - Issue: Missing aria-labels on interactive elements
    - **Fix:** Add aria-labels to all interactive elements, use aria-live regions
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 4.2

### CMS UI/UX - High Priority

17. **Improve error messages (user-friendly)**
    - Issue: Technical error messages shown to users
    - **Fix:** Map technical errors to user-friendly messages, show inline errors
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 3.2

18. **Add skeleton loaders for better perceived performance**
    - Issue: No skeleton loaders for list views (articles, products)
    - **Fix:** Add skeleton loaders (ArticleCardSkeleton, ProductCardSkeleton)
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 3.1

19. **Implement global error boundary**
    - Issue: No global error boundary for unhandled errors
    - **Fix:** Implement global error boundary component
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 3.2

20. **Make tables responsive (card view on mobile)**
    - Issue: Article list tables not responsive
    - **Fix:** Convert tables to cards on mobile
    - **Files to Update:**
      - `app/admin/articles/page.tsx` (article list)
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 5.1

21. **Add confirmation for publish action**
    - Issue: No "Are you sure?" for publish action
    - **Fix:** Add confirmation dialog for publish
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 8.1

### Automation - High Value

22. **Integrate real keyword API**
    - Issue: Using placeholder `searchVolume: 1000`
    - Risk: 50% content may target zero-volume keywords
    - **Fix:** Integrate real keyword API (Ahrefs, Semrush, Ubersuggest) or Google Keyword Planner
    - **Status:** ⏳ Phase 1 (free-first strategy - see PHASE1_IMPLEMENTATION_STATUS.md)
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 2

23. **Add rankings tracking**
    - Issue: No Google Search Console integration for positions
    - Risk: Can't identify content dropping in rankings
    - **Fix:** Integrate GSC API to track keyword positions
    - **Status:** ⏳ Phase 1 (see PHASE1_IMPLEMENTATION_STATUS.md)
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 9

24. **Build auto-refresh triggers**
    - Issue: Content refresh API is stub, no automation
    - Risk: 40% content becomes stale, loses rankings
    - **Fix:** Monitor rankings daily, auto-trigger refresh if position drops > 3
    - **Status:** ⏳ Phase 1 (see PHASE1_IMPLEMENTATION_STATUS.md)
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 10

25. **Auto-interlinking**
    - Issue: Interlinking not automated
    - Risk: Missing 30% internal link authority
    - **Fix:** Auto-inject internal links based on entity matching in pipeline
    - **Status:** ✅ COMPLETE (Phase 2)
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 7

### Testing & Quality

26. **Manual testing for cache invalidation**
    - Test: Edit financial value → Cache invalidation → Verify fresh data
    - Test: Publish article → Cache invalidation → Verify visible
    - Test: Delete article → Cache invalidation → Verify removed
    - **Fix Time:** 1 day
    - **Reference:** CMS_OPERATIONAL Section 4.4

27. **Manual testing for AI article generation**
    - Test: Generate article via `/api/admin/generate`
    - Verify: Numbers from ledger, citations, SEO score, publish workflow
    - **Fix Time:** 1 day
    - **Reference:** CMS_OPERATIONAL Section 5.6

28. **Manual testing for affiliate flow**
    - Test: Desktop click, mobile click, cookie blocked, incognito
    - Verify: Track → Redirect → Analytics
    - **Fix Time:** 1 day
    - **Reference:** CMS_OPERATIONAL Section 6

### AI & Cost Tracking

29. **Per-article cost attribution**
    - Issue: Cost tracking partial, no per-article attribution
    - **Fix:** Track AI costs per article in database
    - **Fix Time:** 3 days
    - **Reference:** CMS_OPERATIONAL Section 5.5

---

## 🟡 MEDIUM PRIORITY (CMS Enhancements)

### CMS UI/UX - Medium Priority

30. **Add functional global search**
    - Issue: Search bar is non-functional (placeholder only)
    - **Fix:** Implement functional global search with keyboard navigation
    - **Fix Time:** 3 days
    - **Reference:** CMS_UI_UX Section 1.1

31. **Add breadcrumbs to all admin pages**
    - Issue: Breadcrumbs usage inconsistent
    - **Fix:** Add breadcrumbs to all admin pages, ensure consistent placement
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 1.2

32. **Add tooltips to toolbar buttons**
    - Issue: No tooltips on toolbar buttons (editor toolbar)
    - **Fix:** Add tooltips to all toolbar buttons with keyboard shortcuts
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 6.2

33. **Implement draft recovery**
    - Issue: No draft recovery if browser closes unexpectedly
    - **Fix:** Save drafts to localStorage as backup, recover on page reload
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 8.2

34. **Add word count and reading time to editor**
    - Issue: No word count or reading time in editor
    - **Fix:** Add live word count and estimated reading time
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 6.1

### Automation - Medium Priority

35. **Cannibalization detection**
    - Issue: No cannibalization detection
    - Risk: 15-20% keyword waste
    - **Fix:** Before content creation, query existing articles for primary keyword match
    - **Status:** ✅ COMPLETE (Phase 3)
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 2

36. **Image optimization**
    - Issue: Images stored as URLs, no compression
    - **Status:** ✅ COMPLETE (Phase 3)
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 6

37. **Scheduling automation**
    - Issue: No automated scheduling
    - **Status:** ✅ COMPLETE (Phase 3)
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 6

38. **Broken link repair**
    - Issue: No broken link monitoring
    - **Status:** ✅ COMPLETE (Phase 3)
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 10

### Content Quality

39. **No citation workflow**
    - Issue: `sourceUrl` stored but not cited in content
    - Risk: Compliance risk, credibility loss
    - **Fix:** Auto-inject citations in content when `sourceContent` used
    - **Fix Time:** 3 days
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 4

40. **Plagiarism check is limited**
    - Issue: Only checks own articles, not web
    - Risk: Legal risk, SEO penalty risk
    - **Fix:** Integrate external plagiarism API (Copyscape, Grammarly)
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 5

41. **No AI watermark detection**
    - Issue: No check for AI-generated markers
    - Risk: 5-10% ranking penalty risk
    - **Fix:** Use AI detection tools (GPTZero, Originality.ai)
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 5

42. **SEO score is UI-only**
    - Issue: `SEOScoreCalculator` exists but not enforced
    - Risk: 20% content underperforms
    - **Fix:** Block publish if SEO score < 70
    - **Fix Time:** 3 days
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 5

43. **No depth validation**
    - Issue: No check for topical coverage completeness
    - Risk: Missing 10-15% ranking factors
    - **Fix:** Require minimum word count based on SERP analysis
    - **Fix Time:** 3 days
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 5

### Publishing & Distribution

44. **No URL optimization**
    - Issue: Slugs auto-generated from title (suboptimal)
    - **Fix:** Validate slug: lowercase, hyphens, keyword-rich, < 60 chars
    - **Fix Time:** 1 day
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 6

45. **No indexation ping**
    - Issue: Revalidation exists but no GSC ping
    - **Fix:** Ping Google Search Console on publish
    - **Fix Time:** 3 days
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 6

46. **No sitemap auto-update**
    - Issue: `app/sitemap.ts` exists but update unclear
    - **Fix:** Auto-regenerate sitemap on publish, ping GSC
    - **Fix Time:** 1 day
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 6

### SERP & Content Analysis

47. **No entity extraction**
    - Issue: No named entity recognition from SERP
    - **Fix:** Use NLP (spaCy/NER) to extract entities from top results
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 3

48. **No media analysis**
    - Issue: Doesn't check for images, videos, tables in SERP
    - **Fix:** Analyze SERP for media requirements
    - **Fix Time:** 3 days
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 3

49. **Gap analysis is generic**
    - Issue: Hardcoded gaps, not data-driven
    - **Fix:** Compare our content against top 10, identify unique topics
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 3

### Performance Tracking

50. **No CTR tracking**
    - Issue: No GSC integration for click-through rates
    - **Fix:** Pull CTR data from GSC, A/B test titles
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 9

51. **No impressions tracking**
    - Issue: No visibility tracking
    - **Fix:** Track impressions from GSC API
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 9

52. **No keyword-to-revenue attribution**
    - Issue: Revenue tracked but not linked to keywords
    - **Fix:** Link affiliate clicks to source keywords
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 9

### Operations

53. **Create operations runbook**
    - Issue: No centralized runbook for CMS operations
    - **Fix:** Document deployment, rollback, database migration, cache clearing procedures
    - **Fix Time:** 1 week
    - **Reference:** CMS_OPERATIONAL Section 9.4

54. **Add performance monitoring**
    - Issue: No Lighthouse CI configured, no Web Vitals tracking
    - **Fix:** Add Vercel Analytics or Google Analytics Core Web Vitals
    - **Fix Time:** 2 days
    - **Reference:** CMS_OPERATIONAL Section 8.2

55. **Load testing**
    - Issue: Not integrated into CI/CD
    - **Fix:** Run load tests, integrate into CI/CD pipeline
    - **Fix Time:** 2 days
    - **Reference:** CMS_OPERATIONAL Section 8.4

---

## 🟢 LOW PRIORITY (Nice to Have)

### CMS UI/UX - Low Priority

56. **Add keyboard shortcut help modal (⌘?)**
    - Issue: No keyboard shortcut documentation
    - **Fix:** Add keyboard shortcut guide (accessible via ⌘? or ? key)
    - **Fix Time:** 1 day
    - **Reference:** CMS_UI_UX Section 4.1

57. **Add swipe gestures for mobile**
    - Issue: No mobile-specific features
    - **Fix:** Consider swipe gestures for common actions
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 5.3

58. **Add undo for recent actions**
    - Issue: No undo mechanism
    - **Fix:** Consider "undo" for recent actions (5-second undo window)
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 8.1

59. **Add high contrast mode**
    - Issue: Not verified for WCAG compliance
    - **Fix:** Add high contrast mode option
    - **Fix Time:** 2 days
    - **Reference:** CMS_UI_UX Section 4.3

### Content & Media

60. **No brand tone validation**
    - Issue: No check against brand guidelines
    - **Fix:** Add tone checker using AI to validate against brand voice
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 4

61. **Tables/calculators not auto-generated**
    - Issue: Content mentions tables but doesn't generate them
    - **Fix:** Auto-generate comparison tables from product data
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 4

62. **No media suggestions**
    - Issue: No image/alt text generation
    - **Fix:** Use AI to generate image descriptions, suggest stock images
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 4

63. **No over-monetization prevention**
    - Issue: No limit on affiliate links per article
    - **Fix:** Limit affiliate links: max 3-5 per article, spaced naturally
    - **Fix Time:** 1 day
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 7

### Social & Repurposing

64. **Social auto-posting**
    - Issue: Posts generated but not auto-posted
    - **Fix:** Integrate social APIs (Twitter, LinkedIn, Instagram) to auto-post
    - **Fix Time:** 2 weeks
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 8

65. **No email snippet generation**
    - Issue: No email content generation code
    - **Fix:** Generate email snippets (subject, preview, body) from articles
    - **Fix Time:** 1 week
    - **Reference:** FULL_LIFECYCLE_OPERATIONAL_AUDIT Section 8

---

## 📊 CMS Task Summary by Priority

**Critical (5 items):** Build errors, fact-checking, compliance, disclosure  
**High (24 items):** Data integrity, security, UI/UX critical, automation high-value, testing  
**Medium (29 items):** UI/UX medium, automation medium, content quality, publishing, operations  
**Low (7 items):** UI/UX nice-to-have, content/media, social repurposing  

**Total: 65+ CMS-specific actionable items**

---

## 🎯 Recommended Execution Order

### Week 1: Unblock CMS Editor
1. ✅ **Day 1:** Fix server-only imports (Task #2) - Unblocks editor
2. ✅ **Day 1:** Fix TypeScript syntax error (Task #1) - Unblocks generation
3. ✅ **Day 2:** Add affiliate disclosure automation (Task #5) - Quick compliance win
4. ✅ **Day 3:** Add form validation (Task #12) - Better UX

### Week 2: Core CMS Features
5. ✅ **Day 4-5:** Implement article versioning (Tasks #6, #7)
6. ✅ **Day 6:** Add soft delete (Task #8)
7. ✅ **Day 7:** Add auto-save (Task #13)

### Week 3-4: UI/UX Polish
8. ✅ **Week 3:** Keyboard shortcuts, accessibility, responsive sidebar (Tasks #14, #15, #16)
9. ✅ **Week 4:** Error handling, skeleton loaders, confirmations (Tasks #17, #18, #19, #21)

### Ongoing: Automation (Already in Progress)
- Fact-checking (Task #3) - Phase 1 ✅ In Progress
- Keyword API (Task #22) - Phase 1 ✅ In Progress
- Compliance (Task #4) - Phase 1 ✅ In Progress
- Rankings tracking (Task #23) - Phase 1 ✅ In Progress
- Auto-refresh (Task #24) - Phase 1 ✅ In Progress

---

## 📚 Reference Documents

- **Strategic Plan:** `docs/plans/CMS_OPERATIONAL_IMPLEMENTATION_PLAN.md`
- **Operational Audit:** `docs/audits/CMS_OPERATIONAL_AUDIT_REPORT.md`
- **UI/UX Audit:** `docs/audits/CMS_UI_UX_AUDIT_REPORT.md`
- **Lifecycle Audit:** `docs/audits/FULL_LIFECYCLE_OPERATIONAL_AUDIT.md`
- **Full TODO List:** `PENDING_ACTIONS_TODO.md` (all tasks)

---

## ✅ Completed CMS Features (Reference)

- ✅ Image optimization (Phase 3)
- ✅ Scheduling automation (Phase 3)
- ✅ Broken link repair (Phase 3)
- ✅ Validation UI (recently completed)
- ✅ Auto-interlinking (Phase 2)
- ✅ Versioning UI (Phase 2)
- ✅ Cannibalization detection (Phase 3)

---

**Status:** 📋 **CMS-FOCUSED ACTION PLAN**  
**Next Action:** Start with Task #2 (Fix server-only imports) to unblock CMS editor  
**Estimated Time to Unblock:** 1 day (Tasks #1, #2)  
**Estimated Time to Production-Ready:** 3-4 weeks (following phased approach)
