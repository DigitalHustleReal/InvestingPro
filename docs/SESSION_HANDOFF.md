# Session Handoff — 2026-04-25 (PM)

> **Purpose:** Hand off context cleanly. Read this first; everything else
> is reachable from the pointers below.

---

## TL;DR

Branch `claude/vibrant-lovelace-875415` — **39 commits**, fully pushed.

**Two big workstreams shipped this session, plus i18n started:**

1. **Priority-0 redesign sweep — DONE.** All 7 v3 URL-category hubs
   rebuilt + aligned to locked principles.
2. **Multiple infrastructure improvements** — desk bylines, CMS
   migrations finished, design rules codified, navbar fixed.
3. **Priority-1 (multi-language) — foundation laid.** `lib/i18n/`
   config + helpers committed; middleware + page integration is the
   next session's first task.

PR: https://github.com/DigitalHustleReal/InvestingPro/pull/new/claude/vibrant-lovelace-875415

---

## What shipped this session (chronological, latest first)

| Commit | What |
|---|---|
| `73de34f5` | **i18n foundation** — `lib/i18n/{config,url,server}.ts` |
| `c917809d` | **/learn hub created** (6th + final priority-0 hub) |
| `79d57249` | **/banking v3 hub** redesigned |
| `fd68c3a1` | **/insurance v3 hub** redesigned |
| `848d9587` | **/loans v3 hub** redesigned |
| `602ee9bf` | /credit-cards leftover v2 cleanup + Taxes in top nav |
| `6167dc69` | FilterSidebar + CreditCardTable v3 rewrite |
| `516aa514` | /taxes flipped 2 ink sections to canvas |
| `30aba0b3` | **Codified zebra rule** — surface-ink for hero+CTA only |
| `b1ad0a8f` | Admin/dashboard placeholder for platform stats |
| `5c0e0b71` | /credit-cards stats removed + horizontal layout |
| `9da6407c` | /credit-cards v3 hub redesigned |
| `c74bc02a` | /investing v3 hub redesigned |
| `3dedaade` | i18n roadmap — English canonical, regional additive |
| `0493e719` | Priority order: redesign first, then i18n, then rest |
| `a448b9d4` | Desk bylines + Org JSON-LD on glossary + hubs |
| `faf89d88` | calculators reference table → Supabase |
| `3eb1b122` | tax_data table → Supabase |
| `542562d9` | /not-found editorial_facts + editorial_hubs → Supabase |
| `49a9ac04` | Future roadmap (news engine, tools, i18n, dark, PWA) |
| Phase 3a | Canonical URL flip (5 commits, earlier) |

---

## Locked principles (settled this session — do NOT re-debate)

These came up during the redesign sweep and are now codified in
`brainstorm.md` §1 + `MANUAL_ACTIONS_TRACKER.md`:

1. **Surface-ink only for statement moments** — hero (top) + final CTA
   (bottom). Optionally one credibility moment on long pages. Everything
   else `bg-canvas` with `border-ink-12` dividers. Visual rhythm =
   indian-gold eyebrows + mono small-caps labels — not alternating
   surfaces. (No more zebra striping.)
2. **No platform-stat counts on user-facing pages** — "X cards", "Y
   guides", "Z calculators" go to `/admin/dashboard` (TBD), not public
   hubs. `/llms.txt` keeps live counts (AI crawlers, not humans).
3. **Single horizontal product list** for category hubs with rich
   product data — pass `layout="list"` to `RichProductCard`, use
   `flex flex-col gap-5` instead of grid columns.
4. **DB-driven content everywhere** — `editorial_hubs` table for
   curated picks (4 placements per hub × 7 hubs = ~96 rows seeded),
   `category_faqs` for FAQ blocks (54 questions), `lib/data/team`
   desk bylines + `Organization` JSON-LD.
5. **English is canonical, regional locales are additive** —
   `/credit-cards` stays English at root, `/hi/credit-cards` is Hindi
   alternate with hreflang back. Goal: outreach + SEO growth, not
   replacement.
6. **NerdWallet-better positioning** — judge every choice against
   "would this beat NerdWallet on the same surface", not "does this
   match NerdWallet".
7. **`/taxes` is a top-level URL category** — top-nav now shows 6
   money topics (Credit Cards, Loans, Banking, Investing, Insurance,
   Taxes), `learn` is reachable via mega-menu/footer.

---

## State of every category hub

All 7 follow the same playbook (hero + 8-12 bg-canvas sections + final
CTA). Check `surface-ink` count = 2 sections each, all FAQ from
`category_faqs`, all picks from `editorial_hubs`, desk byline +
Organization JSON-LD on every hub.

| Hub | File | Desk | DB-driven | Status |
|---|---|---|---|---|
| /credit-cards | `app/credit-cards/page.tsx` | Credit Team | personas, comparisons, tools | ✅ |
| /loans | `app/loans/page.tsx` | Lending Desk | personas, calculators, comparisons, tools | ✅ |
| /banking | `app/banking/page.tsx` | Banking Desk | personas, calculators, comparisons, tools | ✅ |
| /investing | `app/investing/page.tsx` | Investment Desk | personas, calculators, comparisons | ✅ |
| /insurance | `app/insurance/page.tsx` | Insurance Desk | personas, calculators, comparisons, tools | ✅ |
| /taxes | `app/taxes/page.tsx` | Tax Desk | calculators, regime slabs, deductions, key dates | ✅ |
| /learn | `app/learn/page.tsx` | Editorial Team | personas, calculators, comparisons, tools | ✅ NEW |

---

## Priority 1 — i18n status (foundation laid, integration is next)

### What's committed (`73de34f5`)

```
lib/i18n/
  config.ts   — LOCALES (en + hi), DEFAULT_LOCALE, LOCALE_META
                (native script + htmlLang code), isLocale type guard.
                Add a locale by appending to LOCALES; everything else
                reads from this list.
  url.ts      — localizedPath(basePath, locale) — converts canonical
                English path to locale-aware URL.
                stripLocale(path) — inverse, returns { locale, basePath }.
                hreflangAlternates(basePath) — builds the
                Metadata.alternates.languages object covering every
                locale + x-default.
  server.ts   — getServerLocale() reads `x-locale` header (set by
                middleware) with DEFAULT_LOCALE fallback.
                getServerBasePath() strips the locale prefix from the
                current request path.
```

### What's NOT done yet (Phase 1 integration — pick this up first)

1. **Extend `middleware.ts`** to detect `/hi/*` (and future locales),
   rewrite internally, set `x-locale` + `x-pathname` headers.
   Pattern: check `pathname.startsWith('/hi/')`, strip the prefix,
   `NextResponse.rewrite()` with the cleaned URL, set headers.
2. **Update `app/layout.tsx`** — replace the hardcoded
   `<html lang="en">` with `<html lang={LOCALE_META[locale].htmlLang}>`
   reading from `getServerLocale()`. Also emit hreflang `<link>` tags
   in the `<head>`.
3. **Wire `hreflangAlternates()` into every hub's `metadata.alternates`** —
   pages where I just emit `canonical: generateCanonicalUrl(...)`
   should emit `languages: hreflangAlternates(basePath)` too.
4. **Replace `LanguageSwitcher.tsx`** — it's currently a stub that
   alerts users + only handles articles. Rewrite to use
   `localizedPath()` and `router.push()` to genuinely switch locales.
5. **Verification gate:** `/credit-cards` → 200 with `<html lang="en-IN">`,
   `/hi/credit-cards` → 200 with `<html lang="hi-IN">` and English
   content (translated content is Phase 3, not Phase 1).

### Phase 2 (after Phase 1 lands)

- UI string translation system for chrome (navbar labels, footer,
  common buttons). Either `next-intl` or a homegrown `t(key, locale)`
  with a `lib/i18n/strings/{en,hi}.ts` map. Probably the latter — the
  surface area is small and we control the build.
- `category_faqs` gains a `locale` column (or migrate to
  `category_faqs_<locale>` views) so FAQ accessor returns
  locale-correct rows.
- `editorial_hubs` gains a `locale` column likewise.

### Phase 3 (content)

- Hindi articles for top 50 pillar pages (regenerate via the existing
  multi-LLM pipeline with a Hindi prompt + locale-aware article
  insertion).
- Hindi versions of the 54 category FAQs.
- Hindi calculator labels (74 calcs → translate the
  `calculators` table's `title` + `tagline`).

---

## Pending blocked items (manual actions)

🔴 Critical:
- Add `CRON_SECRET` to GitHub Actions Secrets (40 crons sit at 401)
- Open + merge this branch's PR
- Schema fix for `update-intelligence` cron (5 phantom tables)

🟡 SEO unblocked but not yet submitted:
- Submit sitemap.xml to GSC (Phase 4 — was blocked on canonical flip,
  which shipped earlier this session)
- Submit sitemap to Bing Webmaster Tools
- Apply for Google AdSense (228 articles qualify)

Full list: `docs/MANUAL_ACTIONS_TRACKER.md`.

---

## How to start the next session cleanly

Paste this in:

```
Read docs/SESSION_HANDOFF.md first.

Continue with i18n Phase 1 integration:
  1. Extend middleware.ts to rewrite /hi/* paths and set x-locale
     header (foundation in lib/i18n/ already shipped at 73de34f5).
  2. Update app/layout.tsx <html lang> to read getServerLocale().
  3. Wire hreflangAlternates() into every hub's metadata.alternates.
  4. Replace LanguageSwitcher.tsx (stub) with a router-aware version.
  5. Verify /credit-cards (en) and /hi/credit-cards (hi) render
     correctly with right lang/hreflang (content stays English in
     Phase 1; translation is Phase 2/3).

Worktree: .claude/worktrees/vibrant-lovelace-875415
Branch: up to date with origin
Use skills + MCPs proactively (no need to specify).
```

---

## Stack reminders (unchanged)

- Next.js 16.1 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind 4 + shadcn/ui + Radix
- Supabase project ref `txwxmbmbqltefwvilsii` (use `supabase-alt` MCP)
- Vercel auto-deploy on push to `master`
- v3 design tokens locked — see brainstorm.md §1
