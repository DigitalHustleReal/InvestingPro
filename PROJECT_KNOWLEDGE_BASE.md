# InvestingPro Project Knowledge Base

**Version:** 2026.1 (Current as of Feb 6, 2026)
**Status:** 🟡 Pre-Production / Conditional GO
**Strategic Goal:** "The NerdWallet of India"
**Maintainer:** Solo Entrepreneur + AI Agents ("Ghost Team")

---

## 1. Vision & Mission

### The North Star
To become India's dominant personal finance platform within 2 years (2026–2028).
**Differentiation:**
*   **AI-First:** "Ghost Team" automation achieving 50-person output.
*   **Decision-Focused:** Tools and comparison engines over generic blogs.
*   **High-Intent:** Targeting the point of transaction (Apply Now).

### Core Philosophy
1.  **Economic Asymmetry:** Automate everything. If it can be a script, it shouldn't be a human task.
2.  **Trust Over Traffic:** Data accuracy > Clickbait.
3.  **Data Sovereignty:** We own the data pipeline (scraped & verified).

---

## 2. Platform Architecture (Status: Jan 2026)

### Technology Stack
*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4.
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
*   **AI Engine:** Multi-Provider (OpenAI, Groq, Mistral) with circuit breakers and cost governance.
*   **Orchestration:** Inngest (Workflow Engine).
*   **Monitoring:** Sentry, Prometheus, Custom Alert Manager.

### Key Systems
*   **CMS:** Custom-built admin panel (`/admin`) with AI content generation.
*   **Decision Engines:**
    *   **Credit Cards:** Spending-based recommendation algorithm.
    *   **Mutual Funds:** Goal-based matching engine.
*   **Affiliate Tracking:** Built-in click tracking (`affiliate_clicks` table), postback validation, and attribution.

---

## 3. Current State Assessment (Audit Summary)

**Overall Score:** 68/100 (Strong Foundation, Critical Gaps)
**Verdict:** **Conditional GO** (Requires 2-3 weeks hardening)

### ✅ Strengths (What Works)
1.  **Architecture:** Clean modular code, type-safe, separation of concerns.
2.  **Database:** Mature Supabase schema (97+ migrations), RLS security, State Machines.
3.  **Content Pipeline:** AI generator exists with quality gates (but triggered manually).
4.  **Observability:** Comprehensive logging (`lib/logger.ts`), metrics, and health checks.

### 🔴 Critical Gaps (The "Debt")
1.  **Data Automation:** Scrapers exist but require manual triggering. No automated weekly refresh.
2.  **Test Coverage:** Infrastructure exists (Jest) but coverage is unverified (<75%).
3.  **Migration Safety:** No automated rollback strategy for DB migrations.
4.  **Staging:** No staging environment; features go straight to Prod.
5.  **Accessibility:** No audit conducted; potential legal/SEO risk.

---

## 4. Competitor Landscape

**Primary Competitor:** **NerdWallet** (US Benchmark) and **BankBazaar/PaisaBazaar** (Indian Incumbents).

| Feature | InvestingPro (Us) | Incumbents | The "Edge" |
| :--- | :--- | :--- | :--- |
| **Content Speed** | AI-Generated (High) | Human (Slow) | **Velocity** |
| **Product Data** | ~100 (Manual) | 10,000+ (Auto) | **Gap (Critical)** |
| **Personalization** | Spending-based | Generic | **Experience** |
| **Cost Basis** | ~$500/mo (Solo) | $500k/mo (Teams) | **Visual Profitability** |

---

## 5. Roadmap: The Path to Dominance

### Phase 1: Hardening (Weeks 1-4) - **CURRENT PRIORITY**
*   [ ] **Reliability:** Verify Test Coverage > 75%.
*   [ ] **Safety:** Create Rollback strategy for DB migrations.
*   [ ] **Compliance:** Accessibility Audit (WCAG).
*   [ ] **Infrastructure:** Setup Staging Environment on Vercel.

### Phase 2: Automation (Months 2-3)
*   [ ] **Data:** Automate Scraper Phase 2 (Weekly Auto-Refresh).
*   [ ] **Content:** Schedule "News" cycle automation (News → Article → Social).
*   [ ] **Distribution:** Wired up Social Media auto-posting.

### Phase 3: Scale (Months 4-6)
*   [ ] **Inventory:** Scale product DB to 1000+ items.
*   [ ] **Growth:** SEO programmatic landing pages at scale.
*   [ ] **Revenue:** Conversion Rate Optimization (CRO) on key funnels.

---

## 6. Non-Negotiable Rules (The Constitution)

1.  **No Financial Hallucination:** AI must quote sources or refuse to answer.
2.  **Fail-Closed Security:** If Rate Limiter (Redis) fails, block traffic.
3.  **Affiliate-First:** No subscriptions. User value is free; revenue is backend.
4.  **Mobile-First:** 80% of Indian traffic is mobile. Desktop is secondary.

---

**End of Knowledge Base**
