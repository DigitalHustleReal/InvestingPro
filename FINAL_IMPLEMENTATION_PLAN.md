# 7-Day Sprint to Production: InvestingPro Remediation Plan

**Objective:** Align architecture, eliminate technical debt, and launch a production-ready "Automation-First" CMS on Vercel.
**Timeline:** 1 Week
**Driver:** Principal Project Manager
**Status:** CRITICAL

---

## 📅 PHASE 1: FOUNDATION & SECURITY (Days 1-2)
**Owner:** System Architect & Backend Engineer

### 1.1 Secure the Database (CRITICAL)
*   **Problem:** RLS policies allow any authenticated user to wipe the DB.
*   **Action:**
    *   Create a dedicated `admins` table or add `role: 'admin'` to `auth.users` metadata.
    *   Update `cms_schema.sql` and `pipeline_runs_schema.sql` policies to allow writes **ONLY** if `auth.jwt() ->> 'role' = 'admin'` or via matching user ID.
    *   **Deliverable:** `SECURE_RLS_POLICIES.sql` executed.

### 1.2 Unify Business Logic (The "Single Source of Truth")
*   **Problem:** `lib/api.ts` duplicates logic found in `lib/cms/article-service.ts`.
*   **Action:**
    *   Refactor `lib/api.ts` to be a thin wrapper.
    *   **DELETE** all raw `supabase.from('articles')` inserts/updates in `api.ts`.
    *   **REPLACE** with calls to `articleService.createArticle()`, `articleService.saveArticle()`.
    *   **Deliverable:** A clean `api.ts` that delegates to services.

### 1.3 Schema Hygiene
*   **Problem:** Triple storage (`content`, `body_html`, `body_markdown`).
*   **Action:**
    *   Run migration to move any legacy `content` data to `body_markdown`.
    *   **DROP** the `content` column from `articles` table to prevent future confusion.
    *   Ensure `ArticleService` only reads/writes `body_markdown` (source) and `body_html` (derived).

### 1.4 High-Performance Dashboard Stats
*   **Problem:** Client-side aggregation will crash the browser at scale.
*   **Action:**
    *   Create a Postgres RPC function `get_admin_stats()` that returns counts, sums, and basic trends in a single JSON object.
    *   Update `app/admin/page.tsx` to call this RPC instead of fetching table rows.
    *   **Deliverable:** Dashboard loads in <200ms regardless of article count.

---

## 📅 PHASE 2: FRONTEND CLEANUP (Day 3)
**Owner:** Senior Frontend Engineer

### 2.1 The "Component Purge"
*   **Problem:** 5 different editor components (`TipTapEditor`, `BlockEditor`, `WordPressStyleCMS`, etc.).
*   **Action:**
    *   **DESIGNATE** `components/admin/ArticleEditor.tsx` as the ONLY editor.
    *   **DELETE** `components/admin/TipTapEditor.tsx` (and variants).
    *   **DELETE** `components/admin/BlockEditor.tsx`.
    *   **DELETE** `components/admin/WordPressStyleCMS.tsx`.
    *   Refactor `components/admin/OneClickArticleGenerator.tsx` to use the unified `ArticleEditor` component if needed, or just standard form inputs that feed the API.

### 2.2 Fix the "Fake" Pipeline UI
*   **Problem:** `OneClickArticleGenerator` and `WritesonicAIWriter` are isolated UI toys.
*   **Action:**
    *   Standardize them into a "Content Operations" view.
    *   Ensure they simply trigger the backend pipeline (see Phase 3) rather than containing client-side logic.

---

## 📅 PHASE 3: THE ENGINE (Day 4)
**Owner:** Backend Architect

### 3.1 Implement the "Real" Pipeline
*   **Problem:** `api/pipeline/run` is a stub.
*   **Action:**
    *   Create `lib/pipeline/orchestrator.ts`.
    *   Implement usage of `pipeline_runs` table:
        1.  API creates a `triggered` record.
        2.  Orchestrator immediately processes it (for now, sync-on-demand via Vercel max-duration functions) or queues it.
        3.  Updates status to `processing` -> `completed`.
    *   **Deliverable:** A "Re-Scrape & Regenerate" button that actually updates an article in the database.

### 3.2 AI Integration
*   **Action:**
    *   Move OpenAI calls OUT of React components and INTO `lib/pipeline/workers/ai-generator.ts`.
    *   The API route should call this worker.

---

## 📅 PHASE 4: UX POLISH (Day 5)
**Owner:** UI/UX Expert

### 4.1 Professional Editor UX
*   **Problem:** `window.prompt` for links and images.
*   **Action:**
    *   Build `LinkDialog` and `ImageDialog` using ShadCN `Dialog` or `Popover`.
    *   Integrate them into the TipTap bubble menu.
    *   Remove all `window.prompt` calls.

### 4.2 Preview Reliability
*   **Problem:** Previews often 404 or show old data.
*   **Action:**
    *   Ensure `ArticleService.getBySlug` accepts a `preview=true` flag to bypass "published" status check.
    *   Implement Next.js `Draft Mode` correctly if possible, or a custom preview token system.

---

## 📅 PHASE 5: VERIFICATION (Day 6)
**Owner:** QA & SEO Specialist

### 5.1 The "Regeneration Test"
*   **Test:** Delete the body of a "Mutual Funds" article. Click "Regenerate".
*   **Success:** Content reappears, formatted correctly, with new "Last Updated" date.

### 5.2 SEO Verification
*   **Action:**
    *   Verify `sitemap.xml` generates correctly from `articles` table.
    *   Check canonical tags and OpenGraph headers on dynamic routes `[...slug]`.

---

## 📅 PHASE 6: DEPLOYMENT (Day 7)
**Owner:** DevOps Engineer

### 6.1 Vercel Configuration
*   **Action:**
    *   Set up Environment Variables (Supabase Service Role, OpenAI Key).
    *   Configure Backend Timeouts (maxduration) for pipeline routes.

### 6.2 Production Sanity Check
*   **Action:**
    *   Run a full build locally.
    *   Verify no type errors.
    *   Verify no linting errors.

---

## IMMEDIATE NEXT STEPS (To be executed by Agent)

1.  **Execute Phase 1.1:** Secure the RLS policies immediately.
2.  **Execute Phase 1.2:** Refactor `api.ts` / `ArticleService` unification.
3.  **Execute Phase 2.1:** Delete the specialized editor components.
