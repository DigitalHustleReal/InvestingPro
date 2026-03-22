# InvestingPro.in — Claude Code Context

> **Read this first, every session. This saves you from re-reading 200+ files.**
> Last updated: March 2026

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
Framework:    Next.js 16 (App Router) + React 19 + TypeScript 5
Styling:      Tailwind CSS 3 + shadcn/ui + Radix UI primitives
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

**Theme:** Dark-only (`defaultTheme="dark"`, `enableSystem={false}`)
**Base:** Deep Navy `#070B14` (`--background: 222 47% 7%`)

| Token | Color | Use |
|-------|-------|-----|
| `--primary` | Cyan `#06B6D4` | CTAs, links, highlights |
| `--secondary` | Blue `#3B82F6` | Secondary actions |
| `--accent` | Gold `#fbb614` | Premium, alerts, badges |
| `--success` | Emerald `#10B981` | Positive states |
| `--error` | Rose `#f43f5e` | Errors, destructive |
| `--card` | Dark Navy `#0D121F` | Card surfaces |
| `--border` | Muted Navy | Borders |

**Fonts:**
- Body: `Inter` (`--font-inter`)
- Display: `Outfit` (`--font-outfit`)
- Content: `Source Serif 4` (`--font-serif`)
- Code: `JetBrains Mono` (`--font-mono`)

**CSS rule:** Use semantic tokens (`bg-primary`, `text-accent`, `border-border`) NOT raw hex.
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

## 9. Known Issues / Current Status (March 2026)

- [ ] Test coverage is 1.13% — target 75% (not blocking launch)
- [ ] Migration rollback scripts not yet created
- [ ] GA4 + Hotjar tracking needs verification
- [ ] ProductHunt launch pending
- [ ] CMS article templates (5 standard) need creation
- [ ] PWA manifest exists (`/manifest.json`) — needs full PWA audit
- [ ] Mobile optimization audit pending
- [ ] UI overhaul planned: colors, theme, mobile-first

---

## 10. What NOT to Do

```
❌ Don't run "audit the whole platform" — target specific files/features
❌ Don't change tailwind.config.ts without discussing design impact
❌ Don't add new AI providers — use the existing failover chain
❌ Don't hardcode colors — use CSS variables
❌ Don't skip try/catch on DB calls in page components
❌ Don't add light mode — app is dark-only by design
❌ Don't touch lib/env.ts without reading it fully first
❌ Don't create new files if editing existing ones works
```

---

## 11. Architecture Decisions (Settled — Don't Re-debate)

- **Dark-only** intentional — financial platform trust + readability
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
