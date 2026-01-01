# 🚀 INVESTINGPRO: MASTER EXECUTION PLAN

## 1. EXECUTIVE VERDICT
**Readiness Score: 4/10**

**NO-GO** for Vercel Deployment.
**NO-GO** for Automation-First Operation.
**CONDITIONAL-GO** for Content Generation (Manual mode only).

**Rationale**:
The application is a visually impressive "Potemkin Village". The UI is 80% complete and looks premium, but the backend infrastructure is fragile. Key systems (Review Scrapers, Data Updates) rely on Python processes incompatible with Vercel serverless. Core monetization features (Affiliate Tracking) are non-existent. The database schema has conflicting migrations, and the "AI Automation" is a manual trigger without scheduling. Deploying now would result in a static site with broken calculators, stale data, and zero revenue tracking.

---

## 2. MASTER TODO LIST (DEDUPED & PRIORITIZED)

### 🏗️ Architecture & Refactors
1.  **Kill Python Scrapers** (BLOCKER): Rewrite `lib/scraper/*.py` logic into TypeScript/Node.js using `cheerio`/`puppeteer`. Vercel cannot run Python child processes.
2.  **Centralize API Client**: Refactor all direct `fetch` calls to use a unified `lib/api-client.ts` with error handling, retries, and logging.
3.  **Remove Legacy Code**: Delete `app/page_old.tsx`, unused massive `public/images`, and dead CSS files to reduce bundle size.

### 🗄️ Database & Schema
4.  **Fix Schema Conflicts** (BLOCKER): Resolve conflicts between `cms_schema.sql` and `article_advanced_schema.sql`. Merge into a single `00_init.sql` migration.
5.  **Normalize Attributes**: Convert `mutual_funds.aum` and `credit_cards.annual_fee` from `TEXT` to `NUMERIC`. You cannot sort by text columns.
6.  **Normalize Product Types**: Create a `products` master table and use Foreign Keys for `mutual_funds`, `credit_cards`, etc., to unify affiliate link management.
7.  **Seed Enum Tables**: Replace hardcoded `CHECK` constraints (e.g., `CHECK type IN ('Equity')`) with lookup tables (`product_types`) for extensibility.

### 📝 CMS & Editorial Workflow
8.  **Implement Versioning**: Add `article_versions` table to store history. Currently, edits overwrite the only copy.
9.  **Flat Taxonomy**: Refactor `categories` table. Remove recursive parent-child logic in favor of a flatter, SEO-friendly structure (Topic Clusters).
10. **Author Profiles**: Create `authors` table with photos/bios. Link articles to authors (E-E-A-T requirement).

### 🔍 Taxonomy & Internal Linking
11. **Dynamic Navigation**: Build `GET /api/navigation` to fetch menu items from DB. Delete the hardcoded 600-line `NAVIGATION_CONFIG`.
12. **Breadcrumb Logic**: Update breadcrumbs to use the new flat taxonomy structure to prevent "Home > Home > Category" loops.

### ⚖️ Comparison Engine
13. **Floating Compare Dock**: Implement a global state (Zustand) "Compare Dock" that persists across pages. This is the core feature of the site.
14. **Add-to-Compare UI**: Add checkboxes to Product Cards. Currently, the comparison page exists but is unreachable.

### 📈 Scoring & Ranking Engine
15. **Hydrate Trust Map**: Move the hardcoded `trustMap` (Provider Scores) from file string to a database table `provider_scores`.
16. **Visualize Score**: Create a UI component breakdown: "Why is this 4.8/5? -> Returns: 5, Fees: 4, Trust: 5". Transparency builds trust.

### ⭐ Review Ingestion & Analysis
17. **Connect Scraper to DB**: The review ingestion is currently a standalone script. Connect it to `INSERT INTO reviews` table.
18. **Summarize Reviews**: Create an AI pipeline step to generate "Pros/Cons" summaries from raw reviews before storing, to avoid copyright issues.

### 🧮 Calculators & Tools
19. **Raise Limits**: Increase Input Max limits on SIP/Lumpsum calculators (e.g., allow >₹1L/month).
20. **Tax Update**: Update Tax Calculator logic for Budget 2025 (New Regime vs Old Regime). This is a critical compliance risk.
21. **Inject CTAs**: Add "Start Investing" buttons inside Calculator Result cards.

### 🤖 AI Orchestration
22. **Rate Limiting** (BLOCKER): Implement Redis/Upstash rate limiting for AI generation to prevent $1000 bills.
23. **Fallback Logic**: Replace the "Mock Summary" fallback with a robust error handler. A mock summary is a hallucination.
24. **Prompt Hardening**: Ensure all prompts (Investopedia/NerdWallet styles) strictly return JSON to prevent parsing errors.

### ⚙️ Automation & Scheduling
25. **Cron Jobs**: Configure `vercel.json` crons to hit `api/cron/process-pipeline` (Content) and `api/cron/update-market-data` (Data) daily.
26. **Market Data Pipeline**: logic missing. Create a job to fetch Indices/Rates daily via API.

### 📊 Tracking, Analytics & Attribution
27. **Click Tracking**: Implement `POST /api/click` to log affiliate clicks before redirecting.
28. **Conversion ID**: Append `&sub_id={user_id}` to affiliate links for downstream attribution.

### 🛡️ Trust, Compliance & Disclosures
29. **Advertiser Disclosure**: Add "We earn commissions..." banner component above all tables.
30. **Legal Pages**: Populate `/privacy`, `/terms`, `/methodology` with real text (not Lorem Ipsum).
31. **Physical Address**: Add valid contact info to Footer/Contact page.

### 🎨 Frontend UI/UX Alignment
32. **Fix Dark Mode**: Enable `darkMode: 'class'` in Tailwind config.
33. **Add Skeletons**: Create Loading Skeletons for Articles and Cards to fix Janky Layout Shift.
34. **Mobile Menu**: Test and fix Hamburger menu interaction on mobile.

### 🚀 Git, Environments & Deployment
35. **Environment Validation**: Add `zod` validation for `process.env` to fail build if keys (SUPABASE, OPENAI) are missing.
36. **Branch Protection**: Enforce PR reviews. Direct commits to `main` are currently allowed.

---

## 3. REQUIRED APIS, SERVICES & TOOLS

| Service / Tool | Purpose | Mandatory | Cost | Why Needed | Consequence of Failure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OpenAI API** | Content Gen, Summarization | ✅ | Paid | Core "AI" features. | No content capability. |
| **Supabase** | DB, Auth, Vector API | ✅ | Free/Paid | Everything lives here. | App does not exist. |
| **Vercel** | Hosting, Edge Functions | ✅ | Free/Paid | Serverless runtime. | No website. |
| **Upstash/Redis** | Rate Limiting, Caching | ✅ | Free/Paid | Protects API budget. | $500 overnight bill. |
| **Yahoo Finance (RapidAPI)** | real-time Market Data | ✅ | Freemium | Replaces broken Python scrapers. | Stale/fake data. |
| **Google Search Console** | SEO/Indexing Status | ✅ | Free | Know what is ranking. | Flying blind on SEO. |
| **SendGrid/Resend** | Transactional Email | ⚠️ | Paid (Low) | Auth emails, Newsletters. | No password reset. |
| **Sentry** | Error Tracking | ⚠️ | Free | Capture production crashes. | Silent failures. |
| **Cloudinary** | Image Hosting | ❌ | Free | Optimized image delivery. | Slow page loads. |

---

## 4. USER-PROVIDED CREDENTIALS & INPUTS

### 🔐 Security Sensitive (Environment Variables)
*   `OPENAI_API_KEY`: Production. Strict Usage Limits.
*   `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: Production. "God Mode" access.
*   `CRON_SECRET`: Production. Protects cron endpoints.
*   `RAPIDAPI_KEY`: Production. For Yahoo Finance Data.
*   `NEXT_PUBLIC_GA_ID`: Production. Google Analytics.

### 📋 Business Inputs (Manual)
*   **Affiliate Networks**: Impact, Cuelinks, Amazon Associates IDs (Required for `sub_id` tracking).
*   **Legal Text**: Privacy Policy, Terms of Service content (Must be generated/vetted).
*   **Author Bios**: Photos and Bios for "Editorial Team".

---

## 5. HARD BLOCKERS BEFORE SCALE

1.  **Python Dependency**: Vercel effectively bans Python. Scrapers **must** be Node.js.
2.  **Database Conflicts**: Schema is inconsistent. Must reset migration history.
3.  **Missing Rate Limits**: OpenAI API is exposed without protection.
4.  **No Click Tracking**: You are sending traffic to affiliates blind.
5.  **Hardcoded Data**: "Upcoming IPOs" is static. This destroys credibility instantly.
6.  **Orphaned Comparison**: The core "Compare" feature has no UI entry point.
7.  **Tax Compliance**: Financial calculators are outdated (Old Tax Regime).
8.  **Advertiser Disclosure**: Illegal/Unethical to hide affiliate relationships.
9.  **Route Collisions**: Dynamic routes (`[slug]`) mimic static routes. SEO disaster.
10. **Broken Dark Mode**: Basic UI expectation failed.

---

## 6. PHASED EXECUTION ROADMAP

### Phase 0: Stabilization (Survival)
*   **Goal**: A deployable, bug-free, compliant static site.
*   **Tasks**: Fix Routes, Rewrite Scrapers (Node.js), Unify Schema, Fix Dark Mode, Add Disclosures, Update Calculators.
*   **Exit Criteria**: `npm run build` passes. DB migrations reset. Site deploys to Vercel.

### Phase 1: Production Readiness (Monetization)
*   **Goal**: Start tracking and earning.
*   **Tasks**: Implement Click Tracking, Affiliate ID Injection, Dynamic Navigation (DB), Author Profiles, Skeletons.
*   **Exit Criteria**: Clicks are logged in Supabase. Admin can add a Category without Code Deploy.

### Phase 2: Authority & Automation (Growth)
*   **Goal**: Turn on the "Content Factory".
*   **Tasks**: Enable Cron Jobs, Activate AI Content Pipeline (Scheduled), Review Ingestion, Scoring Engine Visualization.
*   **Exit Criteria**: Daily fresh content. "Freshness" signals (Daily Rates).

### Phase 3: Scale & Optimization (Ecosystem)
*   **Goal**: Maximize LTV and SEO.
*   **Tasks**: User Accounts (Watchlists), Email Newsletters, Advanced Comparators (Floating Dock), Vector Search.
*   **Exit Criteria**: User retention features active.

---

## 7. FINAL INSTRUCTION TO ENGINEERS

**START HERE**:
1.  **Do NOT** trigger any AI content generation yet. It costs money and the quality is unverified.
2.  **Priority 1**: Fix the **Pipeline Architecture**. Replace Python scripts with TypeScript services. This is the single biggest architectural fail point.
3.  **Priority 2**: **Database Normalization**. Fix the schema now before you fill it with 1000s of rows of garbage data.

**DO NOT TOUCH**:
*   **The UI (Shadcn/Tailwind)**: It's fine. Don't waste time pixel-pushing until the data is real.
*   **Vector Search**: Overkill for now. Use standard Postgres Text Search (`plainto_tsquery`) until you have >10k articles.

**RULE OF LAW**:
*   No "Mock Data" in Production. If the API fails, show an Error State, not a fake value.
*   No "Hardcoded Config" for business logic (Categories, Rates). Move it to the DB.
