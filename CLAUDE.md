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

## 9. Current Status (April 15, 2026)

### Platform Inventory (from Supabase + Vercel audit)
| Asset | Count | Status |
|-------|-------|--------|
| Calculator pages | 58 live + 11 uncommitted VS calcs | Strongest asset |
| Products in DB | 2,584 (81 CC, 346 MF, 61 loans, 25 FD, 24 insurance) | 4 have images |
| Published articles | 27 (all "best X" listicles, all Apr 7) | No educational content |
| Draft articles | 21 unpublished | Wasted indexable pages |
| Glossary terms | 101 | Good SEO asset |
| VS pages (DB) | 20 credit card comparisons | 0 views — may not render |
| Affiliate partners | 14 active (HDFC ₹800, ICICI ₹650 CPA) | 0 conversions tracked |
| Content queue | 139 pending (mostly CC long-tail spam) | Needs cleanup |
| Cron jobs | 40 configured, all routes exist | Running UNSECURED |
| API routes | 272 | Comprehensive |
| Admin pages | 88+ | Full CMS built |
| Page routes | 237 total | Strong coverage |
| Categories | 19 created, 11 have ZERO articles | Critical gap |

### Vercel Deployment
- Project: `investing-pro` at `https://www.investingpro.in`
- Node 24.x, auto-deploy on git push
- 35 env vars configured (GA4 + PostHog added 9 days ago)
- 0 commits ahead of remote (all pushed except 11 uncommitted VS files)

### What's DONE:
- [x] All DB queries fixed — 19/19 product + article pages verified
- [x] Autonomous content pipeline wired
- [x] 58 calculator pages live (23 original + 16 V2 + 9 P1 + 7 P2 + 3 specialized)
- [x] Shared calculator components: SliderInput, ResultCard, AIInsight, VSComparisonLayout, TrustStrip, PopularCalculators
- [x] 81/81 credit card apply links populated
- [x] Homepage dynamic (TopPicks, Editorial, MarketPulse)
- [x] GA4 + PostHog keys on Vercel (added Apr 6)
- [x] UI overhaul Phase 1-3 complete: green brand, light mode default, mobile bottom nav

### Known Issues (April 15 audit):
- [ ] CRON_SECRET not set — 40 cron endpoints publicly accessible (SECURITY)
- [ ] NEXT_PUBLIC_BASE_URL missing on Vercel (affects canonical URLs)
- [ ] 0 educational articles (100% commercial "best X" content)
- [ ] 11 of 19 categories have ZERO articles
- [ ] 0 affiliate conversions tracked (revenue = ₹0)
- [ ] 4/2,584 product images populated
- [ ] Content queue is all CC long-tail spam — needs cleanup
- [ ] 11 VS calculator files uncommitted (local disk only)
- [ ] Stripe, Twitter, LinkedIn, Google OAuth keys all missing
- [ ] RSS feed not linked in layout head (not discoverable)
- [ ] Organization schema with sameAs not in root layout
- [ ] Sitemap lastModified uses `new Date()` not actual update time

### Distribution Systems Status:
| System | Built | Works | Gap |
|--------|:---:|:---:|-----|
| Social sharing (WhatsApp/FB/Twitter/LI) | Yes | Yes | Frontend only — no automated posting |
| Social scheduling/posting | Yes | No | No API keys, no actual API calls implemented |
| RSS export (`/feed.xml`) | Yes | Yes | Not linked in `<head>`, not discoverable |
| RSS import pipeline | Yes | No | Tables exist, no cron automation |
| Internal linking engine | Yes | Partial | Deterministic rules work, no link insertion into articles |
| AutoInternalLinks component | Yes | Yes | Used on calculator pages, not on articles |
| IndexNow (Bing/Yandex) | Yes | Yes | Key hardcoded (should be env var) |
| Sitemap | Yes | Yes | 5000+ URLs, comprehensive |
| Schema/JSON-LD | Yes | Partial | Generators built, not injected on all pages |
| Backlink monitoring | No | No | Not built |
| Organization social profiles | No | No | No sameAs in root layout, no footer links |

---

## 9a. Master Action Plan (April 15, 2026)

> Full plan: `docs/MASTER_ACTION_PLAN_APRIL_2026.md`

### Owner Tasks (Priority Order)
| # | Task | Priority | Time | Status |
|---|------|:---:|------|:---:|
| O1 | Add `CRON_SECRET` to Vercel (all environments) | P0 | 5 min | |
| O2 | Run `npx vercel env pull .env.local` | P0 | 2 min | |
| O3 | Verify GA4 is tracking (check real-time) | P0 | 5 min | |
| O4 | Set up Google Search Console + submit sitemap | P0 | 15 min | |
| O5 | Add `NEXT_PUBLIC_BASE_URL=https://investingpro.in` to Vercel | P0 | 2 min | |
| O6 | Create X account @InvestingProIN + buy Premium (₹427/mo web) | P1 | 10 min | |
| O7 | Create WhatsApp Channel "InvestingPro" (free) | P1 | 5 min | |
| O8 | Create Telegram Channel @investingpro_in (free) | P1 | 5 min | |
| O9 | Publish 21 draft articles (Admin → Articles → Draft → Publish) | P1 | 30 min | |
| O10 | Verify CC apply links have affiliate tracking IDs | P1 | 20 min | |
| O11 | Sign up on Cuelinks + vCommission affiliate networks | P1 | 30 min | |
| O12 | Add Pexels API key to Vercel (pexels.com → free account) | P1 | 5 min | |
| O13 | Set up business email (hello@investingpro.in) in wife's name | P1 | 30 min | |
| O14 | File CCS Rule 15(1)(d) report — spouse business disclosure | P1 | - | |
| O15 | Stripe, Google OAuth keys (P2 — later month) | P2 | 1 hr | |

### Claude 7-Day Sprint (Apr 15-22, before Max expires)
| Day | Phase | Task | Output |
|-----|-------|------|--------|
| 1 | A1 | Commit + push 11 VS files | Backup + deploy Old vs New Tax page |
| 1 | A2 | Verify cron CRON_SECRET validation | Security audit |
| 1 | A3 | Build 8 page.tsx for existing VS components | +8 calculator pages |
| 2 | B1 | Build 8 remaining VS calculators + pages | +8 more = 75 total calculators |
| 2 | B2 | Verify 20 DB versus_pages render | Fix invisible CC comparisons |
| 3 | D | RSS `<link>` in head, social links in footer, org schema, category merge | Technical SEO |
| 3-5 | C1 | 20 educational articles (CC, MF, Loans, Insurance) | Topical authority started |
| 5-6 | C1 | 20 more articles (Tax, FD, Retirement, Stocks/IPO) | All 19 categories covered |
| 7 | E | Affiliate click tracking, calculator CTAs | Revenue wiring |

### Post-Max Plan (Apr 22+, Claude Pro ₹1,680/mo)
- Write 2-3 articles/week using Claude Pro + Grok
- Monitor GSC weekly, double down on winning pages
- X/WhatsApp/Telegram: share 1 calculator or article daily
- Monthly budget: ₹2,107 (Claude Pro ₹1,680 + X Premium ₹427)

### Legal Structure
- Owner: Wife (sole proprietor) — CCS Conduct Rules compliant
- Social accounts: Brand only (@InvestingProIN) — anonymous, no personal face
- CCS Rule 15(1)(d): File spouse business disclosure report

### Content Strategy (Critical Fix)
```
Current:  100% commercial ("best X") + 0% educational + 0% timely
Target:   40% educational + 30% commercial + 20% timely + 10% tools
```

### 90-Day Targets
| Metric | Now | End April | End May | End June |
|--------|:---:|:---:|:---:|:---:|
| Calculators | 58 | 75 | 75 | 80+ |
| Published articles | 27 | 48 | 88 | 120+ |
| Categories covered | 8/19 | 12/19 | 19/19 | 19/19 |
| GSC impressions/day | 0 | tracking | 100+ | 500+ |
| Affiliate revenue | ₹0 | ₹0 | first click | first conversion |

---

## 9b. Distribution & SEO Systems Map

### Social Media
| Component | Path | Status |
|-----------|------|--------|
| Share buttons (WhatsApp/FB/Twitter/LI) | `components/common/SocialShareButtons.tsx` | WORKING |
| Social scheduler service | `lib/social-media/SocialSchedulerService.ts` | Built, no API keys |
| Social analytics | `lib/social-media/analytics.ts` | Built, no real data |
| AI post generator | `app/api/social/generate/route.ts` | Built, uses GPT-4 |
| Admin social dashboard | `app/admin/social-dashboard/page.tsx` | Built, shows placeholders |
| Actual Twitter/LinkedIn posting | Not implemented | MISSING — no OAuth flow |

### RSS
| Component | Path | Status |
|-----------|------|--------|
| RSS feed export | `app/feed.xml/route.ts` | WORKING at /feed.xml |
| RSS import service | `lib/rss-import/RSSImportService.ts` | Built, not automated |
| RSS article generator | `lib/rss-import/RSSArticleGenerator.ts` | Built, not triggered |
| Feed `<link>` in layout | `app/layout.tsx` | MISSING — feed not discoverable |

### Internal Linking
| Component | Path | Status |
|-----------|------|--------|
| Linking engine (deterministic) | `lib/linking/engine.ts` | WORKING — rules per content type |
| AutoInternalLinks component | `components/common/AutoInternalLinks.tsx` | WORKING on calculator pages |
| AI interlinking suggestions | `app/api/admin/interlinking/suggest/route.ts` | Built, manual API only |
| Link insertion into articles | Not implemented | MISSING |

### SEO Infrastructure
| Component | Path | Status |
|-----------|------|--------|
| Dynamic sitemap (5000+ URLs) | `app/sitemap.ts` | WORKING |
| robots.txt | `public/robots.txt` | WORKING (blocks /admin, /api) |
| IndexNow (Bing/Yandex) | `app/api/indexnow/route.ts` | WORKING (key hardcoded) |
| Schema generators | `lib/seo/schema-generator-enhanced.ts` | Built, not on all pages |
| Google verification | `app/layout.tsx` meta tag | VERIFIED |
| Organization schema + sameAs | `lib/seo/schema-generator-enhanced.ts` | Built, NOT injected in root |
| Sitemap ping cron | `app/api/cron/sitemap-ping/route.ts` | Configured in vercel.json |
| SEO rankings sync | `app/api/cron/seo-rankings-update/route.ts` | Configured, 0 results |

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
