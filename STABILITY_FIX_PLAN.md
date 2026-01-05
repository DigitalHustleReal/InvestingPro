# 🛠️ POST-AUDIT STABILITY & PRODUCTION READINESS PLAN

This plan addresses the critical blockers and high-risk items identified in the pre-launch audit to move InvestingPro from a "High-Fidelity Prototype" to a "Production-Grade Machine."

---

## 🛑 STAGE 1: CRITICAL FOUNDATION & SECURITY (IMMEDIATE)
*Focus: Security, Data Scalability, and Real Integrations*

### 1.1 Secure Analytics & Internal APIs
- **Goal:** Prevent competitors from accessing internal metrics.
- **Action:** Implement role-based access control (RBAC) on `GET /api/analytics/stats`.
- **Status:** ⏳ Pending

### 1.2 Implement Real Media Pipeline
- **Goal:** Remove the "Mocked" file upload that returns Unsplash placeholders.
- **Action:** Connect `api.integrations.Core.UploadFile` to Supabase Storage.
- **Status:** ⏳ Pending

### 1.3 Server-Side Product Pagination
- **Goal:** Move from "Fetch All + JS Filter" (browser-killer) to "SQL Filter + Pagination."
- **Action:** Refactor `MutualFundsPage` and `api.entities.MutualFund.list` to support server-side filters.
- **Status:** ⏳ Pending

### 1.4 Navigation "Dead-End" Audit
- **Goal:** Ensure every link in `NAVIGATION_CONFIG` maps to a page with data.
- **Action:** Map intent routes to dynamic data fetchers.
- **Status:** ⏳ Pending

---

## ⚡ STAGE 2: RESILIENCE & SCALABILITY
*Focus: Failure modes and real-time signals*

### 2.1 Persistent Circuit Breakers
- **Goal:** Stop circuit breakers from resetting on every cold start.
- **Action:** Store AI Provider health in a Supabase table (`ai_provider_health`).

### 2.2 Live Terminal Intelligence
- **Goal:** Connect Alpha Terminal signals to real database triggers.
- **Action:** Replace hardcoded signals in `terminal/page.tsx` with Supabase RPC calls.

---

## 🧹 STAGE 3: AUTOMATION & DEBT CLEANUP
*Focus: Managing the "Script Sprawl" and Asset Safety*

### 3.1 Script Consolidation
- **Goal:** Reduce 78 scripts to a managed CLI.
- **Action:** Create `scripts/pro-cli.ts` to unify population and maintenance tasks.

### 3.2 Asset Miroring
- **Goal:** Safety from external image API changes.
- **Action:** Modify `complete-auto-publish.ts` to download `pollinations.ai` images to Supabase Storage.

---

## 📈 FINAL VERDICT CRITERIA
- [ ] No public internal stats.
- [ ] No client-side filtering for lists > 100 items.
- [ ] No hardcoded "Intelligence" data.
- [ ] No mock integrations in core paths.
