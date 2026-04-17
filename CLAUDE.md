# InvestingPro.in — Claude Code Context

> **Read this first, every session. This saves you from re-reading 200+ files.**
> Last updated: April 2026

---

## 1. What This Project Is

**InvestingPro.in** — Indian personal finance comparison platform.
Users compare credit cards, loans, mutual funds, demat accounts, fixed deposits, insurance, PPF/NPS.
Has AI-powered recommendations, financial calculators, and a full CMS/admin panel.

**Target market:** India (en_IN locale)
**Revenue model:** Affiliate links ("Apply Now" buttons) + future subscriptions (Stripe ready)
**Status:** Production-ready, deployed on Vercel at `https://investingpro.in`

---

## 2. Tech Stack (DO NOT change without discussion)

```
Framework:    Next.js 16.1 (App Router, Turbopack) + React 19 + TypeScript 5
Styling:      Tailwind CSS 4 + shadcn/ui + Radix UI primitives
Database:     Supabase (Postgres + Auth + Storage + RLS)
Payments:     Stripe
Email:        Resend
AI (multi):   Gemini → Groq → Mistral → OpenAI (failover chain in lib/ai-service.ts)
Monitoring:   Sentry + PostHog + Google Analytics 4
Deploy:       Vercel (auto-deploy on git push)
Cache:        Upstash Redis
Rich editor:  Tiptap + BlockNote
```

---

## 3. Design System (LOCK — do not change without explicit instruction)

**Theme:** Light-first (`defaultTheme="light"`, `enableSystem={false}`)
**Light base:** White `#FFFFFF` — Dark mode via `.dark` class: Green-tinted dark `#0A1F14`

| Token | Light Mode | Dark Mode | Use |
|-------|-----------|-----------|-----|
| `--primary` | Forest Green `#166534` | Emerald `#16A34A` | CTAs, links, highlights |
| `--accent` | Indian Gold `#D97706` | Gold `#D97706` | Premium, Indian identity |
| `--success` | Emerald `#16A34A` | Emerald `#16A34A` | Positive states |
| `--error` | Red `#DC2626` | Rose `#f43f5e` | Errors, destructive |
| `--card` | Near-white `#FAFAFA` | Green-dark `hsl(150 47% 10%)` | Card surfaces |
| `--border` | Light slate | Green-tinted dark | Borders |

**Brand Colors (Tailwind):**
- `green-*` (50-950) — Primary green palette
- `amber-*` (50-950) — Indian gold/saffron accent
- `primary-*` — Maps to green (DEFAULT=#166534, light=#16A34A)

**Fonts:**
- Body: `Inter` (`--font-inter`)
- Display: `Outfit` (`--font-outfit`)
- Content: `Source Serif 4` (`--font-serif`)
- Code: `JetBrains Mono` (`--font-mono`)
- Numbers: `font-variant-numeric: tabular-nums` globally

**CSS rule:** Use semantic tokens (`bg-primary`, `text-accent`, `border-border`) NOT raw hex.
Use `green-*` or `primary-*` Tailwind classes — NEVER `cyan-*`, `teal-*`, or `sky-*`.
Legacy `wt-*` variables exist — migrate to semantic tokens when touching those files.

---

## 4. File Structure Map

```
app/
  (auth)/           → Auth-gated pages (login/signup/profile)
  (client)/         → Client-rendered pages with force-dynamic
  admin/            → Full CMS and admin panel (/admin)
  calculators/      → Financial calculators (FROZEN — validated math)
  credit-cards/     → Product listing + comparison
  loans/            → Product listing
  mutual-funds/     → Product listing
  demat-accounts/   → Product listing
  fixed-deposits/   → Product listing
  globals.css       → Design system CSS variables (source of truth)
  layout.tsx        → Root layout (providers, fonts, metadata)
  page.tsx          → Homepage

components/
  admin/            → All admin UI (100+ components)
  calculators/      → Calculator UI components
  common/           → Shared (ExitIntentPopup, WhatsAppButton, etc.)
  compare/          → Product comparison bar/modal
  layout/           → Navbar, footer, TopBar
  ui/               → Base shadcn/ui primitives
  theme-provider.tsx

lib/
  ai-service.ts     → FROZEN: Multi-LLM failover (Gemini→Groq→Mistral→OpenAI)
  env.ts            → FROZEN: Env var validation (strict)
  calculators/      → FROZEN: Financial math logic
  supabase/         → DB client helpers
  cms/              → CMS service layer
  auth/             → Auth helpers

scripts/            → One-time/admin scripts (populate DB, migrations, etc.)
__tests__/          → Jest tests (unit, integration, e2e, load)
```

---

## 5. FROZEN Files — Do NOT Touch Without Full Review

| File/Folder | Why Frozen |
|-------------|------------|
| `app/calculators/**` | Gold-standard validated financial math |
| `lib/env.ts` | Security — env validation, fails fast |
| `lib/ai-service.ts` | Complex multi-LLM circuit breaker |
| `tailwind.config.ts` | Design system token definitions |

---

## 6. Critical Production Fixes (DO NOT Regress)

1. `app/credit-cards/page.tsx` — wrapped in `try/catch` (prevents 500 if DB unreachable)
2. `app/loans/LoansClient.tsx` — wrapped in `try/catch`
3. `app/mutual-funds/page.tsx` — array guards on all data (prevents blank crash)
4. `components/search/CommandPalette.tsx` — Enter key routes to generic search
5. `app/credit-cards/compare/[category]` — redirects to main list (handles broken links)

---

## 7. Environment Variables

### Required (must exist in Vercel + local .env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
NEXT_PUBLIC_BASE_URL=https://investingpro.in
```

### AI Providers (at least one required)
```bash
GOOGLE_GEMINI_API_KEY=[key]      # Primary AI
OPENAI_API_KEY=[key]              # Fallback
GROQ_API_KEY=[key]                # Fast fallback
MISTRAL_API_KEY=[key]             # Fallback
ANTHROPIC_API_KEY=[key]           # Available
```

### Optional but used
```bash
STRIPE_SECRET_KEY=[key]
STRIPE_PUBLISHABLE_KEY=[key]
RESEND_API_KEY=[key]
UPSTASH_REDIS_REST_URL=[url]
UPSTASH_REDIS_REST_TOKEN=[token]
NEXT_PUBLIC_GA_MEASUREMENT_ID=[GA4 ID]
NEXT_PUBLIC_TAWK_PROPERTY_ID=[tawk ID]
SENTRY_DSN=[dsn]
```

---

## 8. Common Tasks (How-Tos)

### Add a new product listing page
1. Create `app/[category]/page.tsx` — follow `app/credit-cards/page.tsx` pattern
2. Add try/catch around all DB calls
3. Add to navigation in `lib/navigation/service.ts`
4. Add route to `app/sitemap.ts`

### Add a new calculator
1. Add math logic in `lib/calculators/` (unit test it)
2. Create UI in `components/calculators/`
3. Add page in `app/calculators/[name]/page.tsx`
4. DO NOT touch existing calculator files

### Add a new admin section
1. Create folder under `app/admin/[section]/`
2. Use `AdminLayout`, `AdminPageContainer`, `AdminPageHeader` components
3. Follow existing admin color tokens from `app/admin/admin-theme.css`

### Fix a DB/Supabase issue
- Check env vars first (most common cause)
- Client: `lib/supabase/client.ts` | Server: `lib/supabase/server.ts`
- RLS policies live in Supabase dashboard and `__tests__/integration/rls-policies.test.ts`

### Run tests
```bash
npm test                    # All unit tests
npm run test:integration    # Integration tests
npm run test:e2e            # E2E tests
npm run validate            # TypeScript + exports + lint (run before commit)
```

### Deploy
```bash
git push origin main        # Auto-deploys to Vercel
npm run deploy:validate     # Pre-deploy check (env + DB + build)
```

---

## 9. Current Status (April 17 EOD, 2026)

### Platform Inventory
| Asset | Count | Status |
|-------|-------|--------|
| Calculator pages | 75 live | 58 original + 17 VS comparison |
| Products in DB | 1,000 (36 CC, 962 MF + 1 loan) | CC images in Supabase Storage |
| Published articles | **189+** (all with body_html, FAQ schema, desk bylines) | Target HIT — topical authority |
| Glossary terms | 101 | Dashed underline links to /glossary/[slug] |
| Categories | 18 normalized (hyphens) | All categories have 2+ articles |
| Grok featured images | 29 approved, processing pending | Bright editorial style |
| FAQ schema | ~180/189 articles | FAQPage JSON-LD |
| Editorial desks | 7 (Tax, Credit, Investment, Lending, Insurance, Banking, Editorial) | Auto-assigned by category |
| Affiliate networks | 2 active (Cuelinks 244238 + EarnKaro 5197986) | Smart lazy loader |
| Contact email | contact@investingpro.in | Updated across 19 files |

### Vercel Deployment
- Project: `investing-pro` at `https://www.investingpro.in`
- Node 24.x, auto-deploy on git push
- `NEXT_PUBLIC_BASE_URL=https://www.investingpro.in`
- `CRON_SECRET` set (no whitespace)

### What's Done (Apr 17 — NerdWallet Parity Sprint):

**Design & UI (17 commits):**
- [x] NerdWallet color system: neutral body, green CTAs only
- [x] Double title suffix fixed across 35+ pages
- [x] Product cards redesigned: full-width NW-style stacked blocks with data strips + accordions
- [x] "Best of" roundup page template: `/{category}/best/{subcategory}` (35 subcategory pages)
- [x] Calculator → product marketplace (SIP, EMI, FD calculators show products below results)
- [x] ApplyNowCTA: uppercase "APPLY NOW", square (2px radius), "on [Provider]'s website" subtext
- [x] Expandable advertiser disclosure on all 6 product pages
- [x] Article page: neutral category badge, clean featured image, simplified callout boxes
- [x] Per-category rating methodology (7 product types with weighted criteria)
- [x] RatingExplainer component: inline "How We Rate" + tooltip variant

**Revenue & Monetization:**
- [x] Cuelinks affiliate SDK active (Publisher ID 244238)
- [x] EarnKaro affiliate SDK active (ID 5197986)
- [x] Smart third-party script loader (lazy, page-aware, no admin pages)
- [x] Affiliate tracking: PostHog events + Supabase `affiliate_clicks` table
- [x] 2 affiliate URL bugs fixed (`/api/out` wrong column + subcategory wrong field)

**Trust & E-E-A-T:**
- [x] 7 editorial desk bylines with auto-assignment by category
- [x] Article sources: expandable citations with RBI/SEBI/IRDAI references per category
- [x] Editorial independence statement on methodology page
- [x] Legal disclaimers enhanced (SEBI, educational purposes, past performance)

**Content (189+ articles):**
- [x] 189+ articles published (51 original + 138 generated via pipeline + Claude)
- [x] All articles: 2,500-8,000 words, FAQ schema, key takeaways, pro tips, tables
- [x] Categories normalized: all use hyphens (credit-cards, not credit_cards)
- [x] All articles have desk bylines assigned
- [x] 29 Grok photorealistic images approved (processing pending)
- [x] Keyword research done for all 7 categories (long-tail, low competition)

### Pending (Priority Order):
- [ ] **P0: Process 29 Grok images** — watermark removal + InvestingPro branding overlay
- [ ] **P0: Wire images to articles** — update featured_image in DB for all 189 articles
- [ ] **P0: Article quality audit** — verify factual accuracy, interlinking, glossary links
- [ ] **P1: Generate remaining Grok images** — ~160 articles still need custom images
- [ ] **P1: Interlinking mesh** — 9+ articles missing cross-article links
- [ ] **P1: Sitemap submission** — submit to Google Search Console + Google News
- [ ] **P1: Google AdSense application** — 189 articles, ready to apply
- [ ] **P2: Sprint 4** — Hub page redesign, URL restructure, footer redesign
- [ ] **P2: Sprint 5** — Visual polish (spacing, cards, link colors)
- [ ] **P2: Cookie banner** — too tall on mobile
- [ ] **P3: Sprint 6** — Cross-links, breadcrumbs, author profiles
- [ ] **P3: Social distribution** — Telegram bot, X API, WhatsApp Channel

### Key Architecture Notes (Apr 17):
- **Article pipeline**: `scripts/auto-generate-batch.ts` — Gemini→Groq→Mistral→OpenAI failover
- **Topics file**: `scripts/data/topics.json` — 197 topics (141 original + 56 gap-fill)
- **Grok image prompts**: `docs/content-research/super-grok-article-prompts.md` — master prompt + 8 topic prompts
- **NerdWallet gap report**: `docs/superpowers/specs/2026-04-17-nerdwallet-parity-gap-report.md`
- **Content blueprint**: `docs/superpowers/specs/2026-04-17-content-blueprint.md`
- **Sprint 1 plan**: `docs/superpowers/plans/2026-04-17-sprint1-p0-revenue-foundation.md`
- **Smart script loader**: `components/monetization/ThirdPartyScripts.tsx` — loads Cuelinks + EarnKaro only on relevant pages
- **Desk byline**: `components/articles/DeskByline.tsx` + `lib/data/team.ts` (7 desks)
- **Article sources**: `components/articles/ArticleSources.tsx` — per-category regulatory citations

### Key Architecture Notes (Apr 16):
- **No fake data anywhere** — all fabricated testimonials, experts, credentials removed
- **Team bylines** — "InvestingPro Tax Desk", "InvestingPro Credit Team", etc. No fake individuals
- **Editorial pages** — `/about/editorial-team` shows process, not people. `/about/editorial-standards` shows specialist desks
- **`lib/data/team.ts`** — 3 team entries (Editorial, Tax Desk, Credit Team), no fake bios
- **`lib/content/review-data.ts`** — empty arrays, no fake reviews
- **`lib/content/author-personas.ts`** — still has fake names (internal AI generation config, not user-facing) — needs cleanup
- **Article body_html** — 49/51 articles have proper HTML. 2 had empty content (now filled: emergency fund + CIBIL)
- **Grok image pipeline** — `scripts/generate-infographic.ts` for branded cards, Playwright for watermark removal + title overlay
- **Product tables**: `credit_cards` (36 rows, separate table), `products` (962 MF + 1 loan, `category` uses underscores: `mutual_fund`, `credit_card`)

### Env Vars on Vercel:
```
NEXT_PUBLIC_BASE_URL=https://www.investingpro.in  ← WITH www
CRON_SECRET=investingpro-cron-secret-2026-secure   ← NO whitespace
NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
GOOGLE_GEMINI_API_KEY, PEXELS_API_KEY, + 30 more
```

---

## 10. What NOT to Do

```
❌ Don't run "audit the whole platform" — target specific files/features
❌ Don't change tailwind.config.ts without discussing design impact
❌ Don't add new AI providers — use the existing failover chain
❌ Don't hardcode colors — use CSS variables or semantic Tailwind tokens
❌ Don't use cyan-*, teal-*, or sky-* — brand is green-* / primary-*
❌ Don't skip try/catch on DB calls in page components
❌ Don't remove dark mode support — app is light-first with dark mode option
❌ Don't touch lib/env.ts without reading it fully first
❌ Don't create new files if editing existing ones works
```

---

## 11. Architecture Decisions (Settled — Don't Re-debate)

- **Light-first with dark mode** — green brand (trust + money) for Indian market
- **Mobile-first** — bottom tab navigation, thumb-zone design, Indian app patterns
- **Multi-LLM failover** in `lib/ai-service.ts` — cost + reliability
- **App Router** (not Pages) — for streaming, server components
- **Supabase RLS** — all DB security enforced at row level, not just API
- **Vercel** — zero-config deploy, edge functions, preview URLs

---

## 12. Session Efficiency Rules

```
1. Read only files relevant to the task — NOT the whole codebase
2. Use /clear between unrelated tasks to reset context
3. Target your asks: "Fix the mobile nav" NOT "improve the UI"
4. When in doubt about a file, read it BEFORE editing it
5. Run `npm run validate` before any commit
```

---

*This file is the single source of truth for Claude Code sessions on InvestingPro.in*
*Update this file whenever major changes are made to architecture, stack, or design decisions.*
