# InvestingPro.in — NerdWallet CTO-Level Technical Audit

> **Date:** April 5, 2026
> **Perspective:** "If I were CTO of NerdWallet, would I trust this codebase to serve 20M monthly visitors reliably and securely?"
> **Benchmark:** NerdWallet engineering (99.99% uptime, SOC 2 compliant, handles $836M in revenue routing)

---

## EXECUTIVE SUMMARY

**Overall Technical Score: 4.8/10**

InvestingPro has solid architectural bones — Next.js App Router, Supabase with RLS, multi-LLM failover, 28 cron jobs — but critical security vulnerabilities, zero performance optimization for scale, massive type-safety gaps, and duplicated infrastructure make it unfit for production traffic beyond a few hundred visitors/day.

**If this landed on my desk at NerdWallet, I'd issue a code freeze until the 7 CRITICAL security issues are fixed.**

---

## AUDIT DIMENSIONS

| Dimension | Score | Verdict |
|-----------|-------|---------|
| **Architecture & API Design** | 7/10 | Good patterns, poor consolidation |
| **Security** | 2/10 | CRITICAL — hardcoded keys, unauthed admin routes |
| **Performance & Scalability** | 3/10 | Cannot handle >500 concurrent users |
| **Code Quality & Tech Debt** | 4/10 | 1,470 `any` types, triple API clients |
| **Database & Data Layer** | 5/10 | Good schema, dangerous operations, no rollbacks |
| **Test Coverage** | 2/10 | 1.13% coverage, zero critical-path tests |

---

## 1. ARCHITECTURE & API DESIGN (7/10)

### What's Good
- **API design: 8/10** — RESTful conventions, consistent JSON response shapes
- **Error handling: 9/10** — Try/catch on all page-level DB calls (learned from production crashes)
- **Auth middleware: 8/10** — Supabase RLS + server-side session checks
- **Multi-LLM failover: 9/10** — Circuit breaker pattern with Gemini→Groq→Mistral→OpenAI chain
- **Cron infrastructure: 8/10** — 28 cron routes with CRON_SECRET auth (25 of 28 secured)

### Critical Issues

| ID | Issue | Impact | Fix Effort |
|----|-------|--------|------------|
| A1 | `lib/api-client.ts` is 650+ lines with 16 `any` types | Unmaintainable, type-unsafe | 4h — split by domain |
| A2 | Inconsistent Zod validation — some routes validate, most don't | Bad data enters DB | 8h — add Zod to all write routes |
| A3 | N+1 auth query in middleware — fetches user profile on every request | Latency on every page load | 2h — cache in session/cookie |
| A4 | Dual API trees: `/api/admin/` (45 routes) + `/api/v1/admin/` (21 routes) | Confusion, maintenance burden | 4h — consolidate to one tree |

---

## 2. SECURITY (2/10) — 🔴 CODE FREEZE RECOMMENDED

### CRITICAL Vulnerabilities (Fix IMMEDIATELY)

| ID | Severity | Issue | Evidence |
|----|----------|-------|----------|
| **C1** | 🔴 CRITICAL | **Hardcoded API keys committed to git** | `scripts/setup-openai-key.ts`, `scripts/setup-mistral-key.ts`, `scripts/setup-groq-key.ts`, `scripts/setup-gemini-key.ts`, `scripts/setup-alpha-vantage-key.ts` — real API keys in source code |
| **C2** | 🔴 CRITICAL | **15+ admin API routes have ZERO authentication** | Routes: `/api/admin/autonomous`, `/api/admin/autonomy/config`, `/api/admin/automation`, `/api/admin/cache/stats`, `/api/admin/generate-seo`, `/api/admin/translate`, `/api/admin/sync-categories`, and more — anyone can call these |
| **C3** | 🔴 CRITICAL | **Unauthenticated public routes trigger AI/DB writes** | `/api/translate`, `/api/social/generate`, `/api/cms/bulk-generate`, `/api/products/generate-image` — anyone can trigger expensive AI calls and DB mutations |
| **C4** | 🔴 CRITICAL | **Admin article routes check user exists but NOT admin role** | Article CRUD routes verify a session exists but never check `is_admin` — any logged-in user can create/edit/delete articles |

### HIGH Vulnerabilities

| ID | Severity | Issue | Evidence |
|----|----------|-------|----------|
| **H1** | 🟠 HIGH | **XSS via `dangerouslySetInnerHTML` without DOMPurify** | 10+ components: `AdBanner`, `FAQAccordion`, `SEOContentBlock`, article pages — raw HTML injection possible |
| **H2** | 🟠 HIGH | **7 cron routes bypass auth when CRON_SECRET unset** | Auth check: `if (cronSecret && ...)` — if env var missing, all crons are publicly accessible |
| **H3** | 🟠 HIGH | **Service role key used at module level in 10+ files** | `createClient(url, serviceRoleKey)` called at import time — key loaded even when not needed |
| **H4** | 🟠 HIGH | **`createAPIWrapper` auth check is a TODO** | Auth verification commented out with `// TODO: implement auth check` |

### NerdWallet Comparison
| Security Practice | NerdWallet | InvestingPro |
|-------------------|-----------|-------------|
| SOC 2 compliance | Yes | No |
| API key management | Vault/HSM | Hardcoded in git |
| Admin auth | SSO + RBAC + 2FA | Partial session check |
| XSS prevention | CSP + sanitization | Raw `dangerouslySetInnerHTML` |
| Dependency scanning | Automated (Snyk/Dependabot) | None configured |
| Secret rotation | Automated | Never rotated |
| Penetration testing | Annual | Never |

### Remediation Priority
1. **Hour 1:** Rotate ALL hardcoded API keys (they're compromised)
2. **Hour 2:** Add admin role check to all 15+ unauthed admin routes
3. **Hour 3:** Add rate limiting + auth to public AI-triggering routes
4. **Hour 4:** Add DOMPurify to all `dangerouslySetInnerHTML` usage
5. **Day 2:** Implement proper RBAC middleware (single source of truth)
6. **Day 3:** Add CSP headers, security headers review

---

## 3. PERFORMANCE & SCALABILITY (3/10)

### Cannot Handle NerdWallet-Scale Traffic (20M visitors/month)

| ID | Severity | Issue | Impact |
|----|----------|-------|--------|
| **P1** | 🔴 P0 | `force-dynamic` on product pages | Every product page is SSR'd on every request — no caching, no ISR |
| **P2** | 🔴 P0 | `getCreditCardsServer()` uses `select('*')` with no `.limit()` | Fetches ALL credit cards with ALL columns on every page load |
| **P3** | 🔴 P0 | Redis cache built but connected to ZERO hot paths | 18+ listing pages make direct DB calls, ignoring the Redis layer |
| **P4** | 🔴 P0 | Upstash free tier (10K commands/day) | At 20M visitors/month (~667K/day), need 600x more capacity |
| **P5** | 🔴 P0 | `SmartImage.tsx` wraps raw `<img>` tag | Zero image optimization — no lazy loading, no srcset, no WebP/AVIF |
| **P6** | 🔴 P0 | `recharts` (45KB gzipped) eagerly loaded in 25+ components | Only 2 files use `next/dynamic` — rest load chart library on page entry |
| **P7** | 🟠 P1 | `framer-motion` (32KB) in layout components | Animation library loads on EVERY page, even static content pages |
| **P8** | 🟠 P1 | `html2canvas` + `jspdf` (120KB) statically imported | PDF generation libraries loaded even when user never exports |
| **P9** | 🟠 P1 | Sitemap runs 5 sequential DB queries | Should use `Promise.all()` — adds unnecessary latency |

### Estimated Bundle Bloat
| Library | Size (gzipped) | Pages Affected | Fix |
|---------|---------------|----------------|-----|
| recharts | 45KB | 25+ components | `next/dynamic` with `ssr: false` |
| framer-motion | 32KB | Every page (layout) | Lazy load, use CSS animations |
| html2canvas + jspdf | 120KB | Admin pages | Dynamic import on click |
| **Total avoidable** | **~197KB** | — | — |

### What NerdWallet Does
- CDN-first architecture (Fastly/CloudFront)
- Static generation for all product pages (ISR with 1h revalidation)
- Image CDN (Imgix/Cloudinary) with automatic format negotiation
- Redis cluster for session/rate-limit/cache (not free tier)
- Bundle budget: <200KB total JS for any page
- Core Web Vitals monitoring with regression alerts

### Fix Estimate: 15 hours focused work for P0+P1

---

## 4. CODE QUALITY & TECH DEBT (4/10)

### Type Safety Crisis

| Metric | Count | Impact |
|--------|-------|--------|
| `: any` type annotations | 1,470 across 549 files | No compile-time safety |
| `as any` type assertions | 259 across 138 files | Suppressing real errors |
| `@ts-ignore` | 9 files | Known type errors ignored |
| `typescript.ignoreBuildErrors` | `true` in next.config.ts | Type errors don't fail builds |

### Duplication & Fragmentation

| What's Duplicated | Instances | Impact |
|-------------------|-----------|--------|
| API clients | 3: `lib/api.ts` (36 imports), `lib/api-client.ts` (37 imports), `lib/api/client.ts` (1 import) | Which one is canonical? Nobody knows |
| Admin auth | 5: `checkAdminRole.ts`, `admin-auth.ts`, `roles.ts`, `require-admin-api.ts`, `permissions.ts` | Security gaps from inconsistent enforcement |
| Supabase clients | 6 variants | Connection pooling impossible |
| Admin API trees | 2: `/api/admin/` (45 routes) + `/api/v1/admin/` (21 routes) | Route confusion, double maintenance |
| Google AI SDKs | 2: `@google/generative-ai` (11 files) + `@google/genai` (10 files) | Different APIs, different behaviors |

### Technical Debt Markers

| Marker | Count | Files |
|--------|-------|-------|
| `TODO` comments | 87 across 49 files | Unfinished work scattered everywhere |
| `FIXME` comments | Included in above | Known bugs not fixed |
| `HACK` comments | Included in above | Workarounds that became permanent |
| Console.log in production | 50+ files | Debug noise in production |
| Files >500 lines | 13 files | `content-templates.ts` (1,875 lines), `api.ts` (1,205 lines) |

### Zero Test Coverage on Critical Paths

| Critical Path | Tests? | Risk |
|---------------|--------|------|
| Affiliate click tracking | ❌ | Revenue loss if broken |
| Stripe payment flow | ❌ | Money handling untested |
| Auth flow (login/signup/session) | ❌ | Security regression risk |
| Admin CRUD operations | ❌ | Data corruption risk |
| AI pipeline (content generation) | ❌ | Cost explosion if loop detected |
| Comparison engine | ❌ | Wrong recommendations |
| SEO metadata generation | ❌ | Search ranking impact |
| Email sequences | ❌ | User communication broken |

---

## 5. DATABASE & DATA LAYER (5/10)

### Schema Grade: C+

**What's Good:**
- Comprehensive table design (17+ tables covering all business domains)
- RLS policies on most tables
- UUID primary keys throughout
- Proper foreign key relationships

**What's Dangerous:**

| ID | Issue | Risk | Evidence |
|----|-------|------|----------|
| D1 | **Monetary values stored as TEXT** | Can't sort, compare, or aggregate prices | `annual_fee`, `joining_fee`, `aum` columns are TEXT, not NUMERIC |
| D2 | **Duplicate table definitions** | Schema drift, conflicting constraints | `credit_cards` defined differently in 2 separate SQL files |
| D3 | **3 conflicting admin role checks in RLS** | Security bypass possible | Different policies use different logic to determine admin status |
| D4 | **`affiliate_clicks` has `USING(true)` on SELECT and UPDATE** | Anyone can read/modify ALL affiliate click data | Complete data leak of revenue-critical tracking |
| D5 | **Destructive seed file** | Production data loss | `real_products_seed.sql` starts with `DELETE FROM products;` — if run against prod, wipes everything |
| D6 | **100+ migrations, ZERO rollback scripts** | Can't recover from bad migration | No `down` migrations anywhere |
| D7 | **TypeScript/DB type mismatches** | Runtime errors | `CreditCard.type` is lowercase in TS but PascalCase in DB CHECK constraint |
| D8 | **Schema drift** | Inconsistent state | `lib/supabase/*.sql` and `supabase/migrations/*.sql` define different schemas |
| D9 | **`article-service.ts` imports browser client in server module** | Auth context mismatch, potential data leak | Server-side code using client-side Supabase instance |

### NerdWallet Database Comparison
| Practice | NerdWallet | InvestingPro |
|----------|-----------|-------------|
| Schema migrations | Versioned with rollback | 100+ forward-only |
| Monetary types | NUMERIC/DECIMAL | TEXT |
| Data validation | DB constraints + app layer | Minimal constraints |
| Seed data safety | Environment-gated | `DELETE FROM` in seed files |
| Schema docs | Auto-generated from migrations | None |

---

## 6. TEST COVERAGE (2/10)

### Current State: 1.13% Coverage

| Metric | Current | NerdWallet Standard | Gap |
|--------|---------|-------------------|-----|
| Test files | 21 | 500+ | 96% gap |
| Source files | 3,581 | — | — |
| Coverage | 1.13% | 80%+ | 79% gap |
| Component tests | 0 | Hundreds | Total gap |
| Integration tests | 3 | Hundreds | Near-total gap |
| E2E tests | 2 | Dozens | Near-total gap |
| Load tests | 1 | Continuous | — |

### What IS Tested (21 files)
- Cron auth pattern (3 routes)
- Credit card recommendation engine (unit)
- Breadcrumb generation (unit)
- RLS policies (integration)
- Basic API routes (integration)
- Homepage load (e2e)

### What MUST Be Tested Before Production
1. Affiliate click tracking end-to-end
2. Stripe checkout + webhook flow
3. Auth: login, signup, session refresh, role check
4. Admin CRUD: create/read/update/delete articles and products
5. AI pipeline: generation, rate limiting, cost tracking
6. Product comparison engine accuracy
7. Calculator math (existing but needs expansion)
8. SEO metadata correctness
9. Email sending and template rendering
10. Cron job execution and error handling

---

## CTO REMEDIATION PLAN

### Phase 1: SECURITY CODE FREEZE (Day 1-2)

| # | Task | Priority | Effort | Owner |
|---|------|----------|--------|-------|
| 1 | Rotate ALL hardcoded API keys | 🔴 CRITICAL | 1h | Human |
| 2 | Delete `scripts/setup-*-key.ts` files with hardcoded keys | 🔴 CRITICAL | 15min | Agent |
| 3 | Add admin role check to all 15+ unauthed admin routes | 🔴 CRITICAL | 3h | Agent |
| 4 | Add auth + rate limiting to public AI-triggering routes | 🔴 CRITICAL | 2h | Agent |
| 5 | Fix admin article routes to check `is_admin` role | 🔴 CRITICAL | 1h | Agent |
| 6 | Add DOMPurify to all `dangerouslySetInnerHTML` instances | 🟠 HIGH | 2h | Agent |
| 7 | Make cron auth fail-closed (reject if CRON_SECRET unset) | 🟠 HIGH | 1h | Agent |
| 8 | Fix `affiliate_clicks` RLS policy (`USING(true)` → proper check) | 🟠 HIGH | 30min | Agent |

### Phase 2: PERFORMANCE (Day 3-4)

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 9 | Remove `force-dynamic` from product pages, add ISR | 🔴 P0 | 2h |
| 10 | Add `.limit()` and column selection to all DB queries | 🔴 P0 | 3h |
| 11 | Wire Redis cache to top 5 listing pages | 🔴 P0 | 3h |
| 12 | Replace `SmartImage` with `next/image` | 🔴 P0 | 2h |
| 13 | Dynamic import `recharts` in all 25+ components | 🔴 P0 | 2h |
| 14 | Dynamic import `framer-motion`, `html2canvas`, `jspdf` | 🟠 P1 | 1h |
| 15 | Parallelize sitemap DB queries with `Promise.all` | 🟠 P1 | 30min |

### Phase 3: CODE QUALITY (Day 5-7)

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 16 | Set `typescript.ignoreBuildErrors: false` + fix type errors | 🔴 HIGH | 8h |
| 17 | Consolidate 3 API clients → 1 canonical client | 🟠 MEDIUM | 4h |
| 18 | Consolidate 5 admin auth → 1 middleware | 🟠 MEDIUM | 3h |
| 19 | Remove `@google/generative-ai`, standardize on `@google/genai` | 🟠 MEDIUM | 2h |
| 20 | Replace 50+ console.logs with `@/lib/logger` | 🟡 LOW | 2h |
| 21 | Remove 87 TODO/FIXME/HACK or create tracked issues | 🟡 LOW | 3h |

### Phase 4: DATABASE HARDENING (Day 7-8)

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 22 | Migrate monetary TEXT columns → NUMERIC | 🟠 HIGH | 4h |
| 23 | Reconcile duplicate table definitions | 🟠 HIGH | 2h |
| 24 | Unify RLS admin role checks | 🟠 HIGH | 2h |
| 25 | Remove `DELETE FROM` from seed files, add environment guard | 🟠 HIGH | 1h |
| 26 | Fix TS/DB type mismatches (CreditCard.type case) | 🟠 MEDIUM | 2h |
| 27 | Create rollback scripts for critical migrations | 🟡 LOW | 4h |

### Phase 5: TEST COVERAGE (Ongoing — Day 8+)

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 28 | Test affiliate click tracking end-to-end | 🔴 HIGH | 3h |
| 29 | Test Stripe checkout + webhook flow | 🔴 HIGH | 4h |
| 30 | Test auth flow (login/signup/session/role) | 🔴 HIGH | 3h |
| 31 | Test admin CRUD operations | 🟠 MEDIUM | 4h |
| 32 | Test AI pipeline with cost guards | 🟠 MEDIUM | 3h |
| 33 | Component tests for top 20 components | 🟡 LOW | 8h |
| 34 | Target: 21 → 100+ test files, 1% → 30% coverage | 🟡 LOW | Ongoing |

---

## VERDICT

**Would I ship this to 20M users?** No.

**What would I do first?** Issue a security code freeze. The hardcoded API keys in git and 15+ unauthenticated admin routes are active vulnerabilities — not theoretical risks. Any script kiddie with `curl` can call admin endpoints and trigger AI spend.

**What's the path to production-ready?**
- 2 days of security fixes gets it safe for limited traffic
- 1 week of performance work gets it ready for ~10K visitors/day
- 2 weeks of quality + testing gets it to startup-grade
- 2 months of hardening gets it to NerdWallet-grade

**The good news:** The architectural decisions are sound. Next.js App Router, Supabase RLS, multi-LLM failover, cron infrastructure — these are the right choices. The problems are execution gaps (auth not applied, cache not wired, types not enforced), not architectural mistakes. This is fixable.

---

*Audit conducted using 5 parallel specialized agents examining: architecture, security, performance, code quality, and database.*
