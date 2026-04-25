# Session Handoff — 2026-04-25/26 (i18n in progress)

> **Read this first.** Everything else is reachable from the pointers below.

---

## TL;DR

Branch `claude/vibrant-lovelace-875415` — **43 commits**, fully pushed.

Three workstreams from this session:

1. **Priority-0 redesign sweep — DONE.** All 7 v3 URL-category hubs
   rebuilt + aligned to locked principles.
2. **i18n Phase 1 (routing) — DONE.** Middleware rewrites `/hi/*` →
   internal English path, `<html lang>` dynamic per locale, hreflang
   tags on every hub, LanguageSwitcher router-aware.
3. **i18n Phase 2a (UI strings) — PARTIAL.** 8 locales configured, 6
   strings files drafted (en, hi, bn, mr, ta, te), abbreviations
   preserve list locked. Half-built: needs `t()` helper, `<LocaleProvider>`,
   navbar wiring, gu + kn strings, mobile switcher.

PR: https://github.com/DigitalHustleReal/InvestingPro/pull/new/claude/vibrant-lovelace-875415

---

## What's locked + done (do NOT redo)

### v3 Design (codified in `brainstorm.md` §1)
1. Surface-ink only for hero + final CTA — no zebra striping
2. No platform-stat counts on user-facing pages — admin dashboard concern
3. Single horizontal product list for category hubs (`layout="list"`)
4. DB-driven content via `editorial_hubs` + `category_faqs` + `lib/data/team`
5. NerdWallet-better positioning, `/taxes` is top-nav, 7 URL categories

### i18n Architecture (codified in `lib/i18n/config.ts` + `brainstorm.md`)
6. **English is canonical**, served at root URLs
7. **Regional locales additive**, served at `/hi/`, `/te/`, etc.
8. **8 locales supported**: en (default), hi, bn, mr, te, ta, gu, kn
9. **Indian financial abbreviations stay in English** across all locales
   — SIP, FD, EMI, CIBIL, GST, ITR, NPS, ELSS, KYC, IRDAI, DICGC, IFSC,
   MCLR, NIFTY, etc. (full list in `lib/i18n/abbreviations.ts`)
10. **Tiered content per locale** — UI chrome + glossary + FAQs +
    calc labels in all 8 languages; pillar articles in Hindi (top
    100), regional (top 25–50 each); long-tail stays English

### Phase 1 i18n routing (commit `a14c0b6d`)
- Middleware rewrites `/hi/credit-cards` → internal `/credit-cards` with
  `x-locale=hi` + `x-pathname=/hi/credit-cards` headers
- `<html lang>` reads from `getServerLocale()` → emits `en-IN`, `hi-IN`,
  `bn-IN`, etc.
- Every hub's `metadata.alternates.languages` uses
  `hreflangAlternates(basePath)` — emits `<link rel="alternate"
  hrefLang>` per locale + `x-default`
- LanguageSwitcher.tsx is router-aware (uses `localizedPath()` +
  `stripLocale()`)

---

## What's NOT done (next-session pick-up)

### i18n Phase 2a finish (immediate priority)

**Files still needed:**
- `lib/i18n/strings/gu.ts` (Gujarati) + `lib/i18n/strings/kn.ts` (Kannada)
- `lib/i18n/t.ts` — server-side `t(key)` accessor reading
  `getServerLocale()`. Returns `STRINGS[locale][key] ?? EN[key]`.
- `lib/i18n/client.tsx` — `<LocaleProvider>` + `useT()` client hook
  (needs the locale exposed via context)
- `lib/i18n/format.ts` — `formatCurrency(n, locale)`, `formatDate(d,
  locale)` using `Intl.NumberFormat` and `Intl.DateTimeFormat` —
  preserves Indian lakh/crore notation across all locales

**Wiring still needed:**
- v2 Navbar (`components/v2/layout/Navbar.tsx`) — replace hardcoded
  `"Credit Cards"`, `"Loans"`, etc. with `t('nav.creditCards')` etc.
  Same for MegaMenu top-level labels.
- Footer (`components/layout/Footer.tsx`) — column headers + legal
  links via `t('footer.*')` keys
- LanguageSwitcher — currently shows 2 locales (the original LOCALES
  before expansion); change to render all 8 (or the top 4-5 with a
  "more" overflow on mobile)
- MobileNav — wire LanguageSwitcher into the mobile menu

**Verification:**
- `/credit-cards`, `/hi/credit-cards`, `/bn/credit-cards`,
  `/mr/credit-cards`, `/te/credit-cards`, `/ta/credit-cards` all
  show locale-correct nav labels
- `/gu/*` and `/kn/*` fall back to English chrome (acceptable until
  strings ship)
- `<html lang>` correct per locale
- Hreflang tags emit cleanly

---

## Phase 2b/3+ (deferred)

- **Phase 2b** — self-referencing canonical per locale (each `/hi/X`
  canonicals to `/hi/X`, not `/X`). Mechanical: convert each hub's
  static `metadata` to async `generateMetadata()` reading
  `getServerLocale()`. ~7 hubs.
- **Phase 3a** — Glossary bilingual entries: add `definition_<locale>`
  columns to `glossary_terms`, AI-translate 101 × 7 = 707 entries,
  editorial review per language
- **Phase 3b** — FAQs in 7 locales: add `locale` column to
  `category_faqs`, AI-translate 54 × 7 = 378 entries
- **Phase 3c** — Calculator labels: add `locale` column to
  `calculators`, AI-translate 74 × 7 = 518 entries
- **Phase 4** — Article body content (tiered):
  - Hindi: full 100 pillar articles via existing
    `scripts/auto-generate-batch.ts` with Hindi prompts
  - bn/mr/te/ta/gu/kn: top 25–50 pillar articles each
  - Long-tail articles stay English (hreflang routes to English)

---

## Restart prompt for next session

Paste after `/clear`:

```
Read docs/SESSION_HANDOFF.md first.

Continue with i18n Phase 2a:
  1. Create lib/i18n/strings/gu.ts + kn.ts (Gujarati + Kannada,
     same key shape as en.ts, AI-drafted first pass)
  2. Create lib/i18n/t.ts (server-side t(key) accessor)
  3. Create lib/i18n/client.tsx (<LocaleProvider> + useT() hook)
  4. Create lib/i18n/format.ts (Intl helpers)
  5. Wire t() into v2 Navbar — replace "Credit Cards" / "Loans" /
     "Banking" / "Investing" / "Insurance" / "Taxes" with t() keys.
     Same for MegaMenu top-level labels.
  6. Wire t() into Footer column headers + legal links.
  7. Update LanguageSwitcher to render all 8 locales (or top 4 with
     overflow). Wire into MobileNav too.
  8. Verify each /[locale]/credit-cards renders correct nav.

Branch: claude/vibrant-lovelace-875415 (head 45d52558, fully pushed).
Worktree: .claude/worktrees/vibrant-lovelace-875415.
Use skills + MCPs proactively.
```

---

## Key file pointers

```
lib/i18n/
├── config.ts          — 8 locales, LOCALE_META, isLocale guard
├── url.ts             — localizedPath, stripLocale, hreflangAlternates
├── server.ts          — getServerLocale, getServerBasePath
├── abbreviations.ts   — ~120 preserved English terms
└── strings/
    ├── en.ts          — 60+ source-of-truth keys (SHIPPED)
    ├── hi.ts          — Hindi (SHIPPED, AI-drafted, needs review)
    ├── bn.ts          — Bengali (SHIPPED, AI-drafted, needs review)
    ├── mr.ts          — Marathi (SHIPPED, AI-drafted, needs review)
    ├── ta.ts          — Tamil (SHIPPED, AI-drafted, needs review)
    ├── te.ts          — Telugu (SHIPPED, AI-drafted, needs review)
    ├── gu.ts          — TODO
    └── kn.ts          — TODO

middleware.ts          — locale rewrites + x-locale header
app/layout.tsx         — dynamic <html lang>
components/common/
└── LanguageSwitcher.tsx — router-aware switcher (needs all-8-locale update)

All 7 hub pages — alternates.languages wired via hreflangAlternates()
brainstorm.md §1     — design tokens + zebra rule
docs/MANUAL_ACTIONS_TRACKER.md — pending blocked items
```

---

## Pending blocked manual actions (unchanged)

🔴 Critical:
- Add `CRON_SECRET` to GitHub Actions Secrets (40 crons sit at 401)
- Open + merge this branch's PR

🟡 SEO:
- Submit sitemap.xml to GSC (Phase 4 — was unblocked when canonical
  flipped earlier this session)
- Submit sitemap to Bing
- Apply for Google AdSense (228 articles qualify)

Full list: `docs/MANUAL_ACTIONS_TRACKER.md`
