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

## 9. Current Status (April 22, 2026)

### Platform Inventory
| Asset | Count | Status |
|-------|-------|--------|
| Public route patterns | 10 | ✅ ALL on v3 Bold Redesign |
| Calculator pages | 72 live | SIP has full gold-standard UX; other 71 use shared v3 primitives |
| Products in DB | ~1,000 (36 CC, 962 MF + 1 loan) | CC images in Supabase Storage |
| Published articles | **228+** | Editorial Playfair typography via `.article-prose` |
| Glossary terms | 101 | Dashed underline links to /glossary/[slug] |
| Categories | 18 normalized (hyphens) | All categories have 2+ articles |
| Grok featured images | 29 approved, processing pending | Bright editorial style |
| FAQ schema | ~180/228 articles | FAQPage JSON-LD |
| Editorial desks | 7 (Tax, Credit, Investment, Lending, Insurance, Banking, Editorial) | Auto-assigned; visible per product card |
| Affiliate networks | 2 active (Cuelinks 244238 + EarnKaro 5197986) | Smart lazy loader |
| Sitemap URLs | ~1,450 | Submit to GSC — pending manual action |
| Contact email | contact@investingpro.in | Updated across 19 files |

### Vercel Deployment
- Project: `investing-pro` at `https://www.investingpro.in`
- Node 24.x, auto-deploy on git push to `master`
- `NEXT_PUBLIC_BASE_URL=https://www.investingpro.in`
- `CRON_SECRET` set (no whitespace)

### v3 Bold Redesign — 100% shipped (2026-04-21 to 2026-04-22)

**Design system locked** (see `brainstorm.md` §1):
- Colors: 6 tokens only (ink, authority-green, action-green, indian-gold, canvas, warning-red). No blue, no purple, no pink.
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (data). Font-display = Playfair.
- Rules: rounded-sm max (2px), no gradients except hero, no scale-transforms, no glassmorphism, no shadow-lg.
- Emphasis = indian-gold (never action-green).

**Coverage (all shipped):**
- Homepage — 11 editorial sections (vanity TrustStats/BrandMarquee removed; FindYourFit + LifeStageHub added for interactive value)
- Listing pages (7) — NerdWallet+ editorial cards with square score badges, pros/cons, Our Take verdict, filter sidebar
- Product detail pages (6 categories, 1000+ products) — Playfair 60px hero + mono data strip + square score + self-healing fuzzy slug resolver
- Article hub + 228 article detail pages — custom `.article-prose` CSS (Playfair H2/H3, gold bullets, mono OL, pull quotes, ink tables)
- Calculator hub + 72 individual pages — SIP has persona presets + step-up + inflation + LTCG + stress test + donut + share-as-image
- Category pages (8) + best-of roundups (35)
- Compare feature — sticky ink+gold tray + comparison page
- Footer — 6-col / 70 SEO links / 3 compliance blocks (SEBI/affiliate/jurisdiction)

**Infrastructure & tracking:**
- PostHog funnel events on all conversion paths (category switch, pick click, calc CTA, affiliate click, newsletter subscribe, life-stage selection)
- Non-blocking affiliate tracking with UUID validation + schema-mismatch retry fallback
- Real `/api/newsletter` capture on homepage + every article bottom
- Weekly editorial ticker ("This Week in Indian Money") on 6 listing pages — closes NerdWallet's velocity edge

### Pending (Priority Order)

**🛠️ Engineering**
- [ ] Run `supabase/migrations/20260422_fix_affiliate_clicks_schema.sql` in Supabase SQL editor (adds article_id column if missing, creates safe index without broken `converted` reference)
- [ ] Connect InvestingPro Supabase project to MCP server (currently only Conduit visible)
- [ ] Extend fuzzy-slug resolver to loans/MF/insurance/demat/FD detail pages (credit-cards has it)
- [ ] Playwright visual regression (~1 hr)
- [ ] Token/font linter in CI (~30 min)

**🎨 Design completion**
- [ ] Port SIP gold-standard pattern to EMI / FD / Tax calculators (~3 hrs each)
- [ ] PWA mobile mockup section on homepage
- [ ] Document `.article-prose` opt-in classes for editorial team (`.data-callout`, `.takeaways`)

**💰 Revenue / SEO activation (HIGHEST IMMEDIATE ROI)**
- [ ] Submit sitemap.xml to Google Search Console (228 articles currently unindexed)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request manual indexing for top 10 money articles via GSC URL Inspection
- [ ] Apply for Google AdSense (228 articles qualifies)
- [ ] Process 29 approved Grok images (watermark removal + IP branding overlay)
- [ ] Wire Grok images to all 228 articles (featured_image DB column)
- [ ] Generate ~160 remaining Grok images per content blueprint

**📝 Content / E-E-A-T**
- [ ] Glossary expansion 101 → 205 terms per content blueprint
- [ ] Interlinking mesh — 9+ articles missing cross-article links
- [ ] Corrections policy page (route exists, content needed)
- [ ] Fact-check policy page

### Key Architecture Notes

**v3 Shared Components — upgrade once, whole site inherits:**
- `components/products/RichProductCard.tsx` — 7 listing pages
- `components/products/ApplyNowCTA.tsx` — every affiliate click button
- `components/articles/ArticleRenderer.tsx` — all 228 articles (uses `.article-prose`)
- `components/articles/ArticleSources.tsx` — per-category regulatory citations
- `components/articles/Callout.tsx` — 5 editorial callout tones
- `components/articles/ArticleNewsletterInline.tsx` — every article bottom
- `components/common/WeeklyChanges.tsx` — editorial ticker, 6 listings
- `components/common/ContextualTicker.tsx` — "LIVE DATA" strip per category
- `components/calculators/shared/*` — 75 calculators inherit tokens
- `lib/content/weekly-changes.ts` — edit TS file to update weekly commentary (no DB)
- `lib/tracking/affiliate-tracker.ts` — non-blocking click tracking with retry

**Infrastructure:**
- `app/sitemap.ts` — ~1,450 URLs (72 calcs, 35 best-of, 10 categories, articles, products)
- `app/robots.ts` — ChatGPT/Perplexity/Applebot allowed; GPTBot/CCBot/ClaudeBot blocked
- `app/api/newsletter/route.ts` + `lib/services/newsletterService` — capture + verify
- `app/api/out/route.ts` + `app/go/[slug]/route.ts` — affiliate redirect with server-side tracking
- `app/globals.css` — CSS variables + `.article-prose` + `.surface-*` — single CSS source

**Data layer:**
- `credit_cards` table (36 rows, separate table) — detail page has 3-tier fuzzy slug resolver
- `products` table (962 MF + 1 loan, `category` uses underscores: `mutual_fund`, `credit_card`)
- `articles` table (228+ published, `status = 'published'`)
- `affiliate_clicks` table — tracker now UUID-validates before insert, retries on schema mismatch

**Article pipeline** (unchanged from Apr 17):
- `scripts/auto-generate-batch.ts` — Gemini→Groq→Mistral→OpenAI failover
- `scripts/data/topics.json` — 197 topics
- `lib/data/team.ts` — 7 desk entries, auto-assigned by category
- No fake individual authors anywhere in user-facing pages

### Env Vars on Vercel:
```
NEXT_PUBLIC_BASE_URL=https://www.investingpro.in  ← WITH www
CRON_SECRET=investingpro-cron-secret-2026-secure   ← NO whitespace
NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
GOOGLE_GEMINI_API_KEY, PEXELS_API_KEY, + 30 more
NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST (for analytics)
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
