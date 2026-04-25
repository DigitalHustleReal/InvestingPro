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
- `lib/i18n/t.ts` — server-side `t(key)` accessor reading
  `getServerLocale()`. Returns `STRINGS[locale][key] ?? EN[key]`.
- `lib/i18n/client.tsx` — `<LocaleProvider>` + `useT()` client hook
  (needs the locale exposed via context)
- `lib/i18n/format.ts` — `formatCurrency(n, locale)`, `formatDate(d,
  locale)` using `Intl.NumberFormat` and `Intl.DateTimeFormat` —
  preserves Indian lakh/crore notation across all locales

**Wiring still needed:**
- **Internal-links audit (CRITICAL)** — every raw `href` in Navbar /
  MegaMenu / Footer must route through `localizedPath(href,
  currentLocale)`. Without this, a Hindi user clicking "Loans" from
  `/hi/credit-cards` jumps to `/loans` (English), losing locale state.
  Files to audit:
    - `components/v2/layout/Navbar.tsx`
    - `components/v2/layout/MegaMenu.tsx`
    - `components/layout/Footer.tsx`
- v2 Navbar — replace hardcoded `"Credit Cards"`, `"Loans"`, etc. with
  `t('nav.creditCards')` etc. Same for MegaMenu top-level labels.
- Footer — column headers + legal links via `t('footer.*')` keys
- LanguageSwitcher — currently renders 2 locales (the original LOCALES
  before expansion); update to all 8. Order: en, hi, bn, mr, te, ta,
  gu, kn. gu + kn show with `(English fallback)` hint until strings
  ship.
- MobileNav — wire LanguageSwitcher into the mobile menu

**Verification gate (mandatory before commit):**
- `npx tsc --noEmit --skipLibCheck` clean
- `Claude_Preview` snapshots of `/credit-cards`, `/hi/credit-cards`,
  `/bn/credit-cards`, `/mr/credit-cards`, `/te/credit-cards`,
  `/ta/credit-cards` showing translated nav labels per locale
- `/gu/credit-cards` and `/kn/credit-cards` fall back to English
  (acceptable until Phase 2b follow-up)
- Click test: clicking "Loans" in nav from `/hi/credit-cards` must
  land at `/hi/loans`, not `/loans` — proves internal-links audit
  worked
- `<html lang>` correct per locale
- Hreflang tags emit cleanly

---

## Phase 2b/3+ (deferred)

- **Phase 2b — i18n loose ends:**
  1. `lib/i18n/strings/gu.ts` + `kn.ts` (Gujarati + Kannada,
     AI-drafted with `// TODO: needs native-speaker review` markers)
  2. Self-referencing canonical per locale (each `/hi/X` canonicals
     to `/hi/X`, not `/X`). Mechanical: convert each hub's static
     `metadata` to async `generateMetadata()` reading
     `getServerLocale()`. ~7 hubs. Flagged in commit `a14c0b6d`,
     deferred from Phase 1.
  3. Add row to `docs/MANUAL_ACTIONS_TRACKER.md` tracking which
     locale strings need editorial review (currently all 7 regional
     locale strings files are AI-drafted, marked needs-review in
     their headers).
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

Continue with i18n Phase 2a (UI chrome translation across 6 ready
locales — gu + kn deferred to Phase 2b follow-up). Steps in order:

  1. Create lib/i18n/t.ts (server-side t(key) accessor reading
     getServerLocale() with English fallback chain)
  2. Create lib/i18n/client.tsx (<LocaleProvider> populated from
     server locale + useT() client hook)
  3. Create lib/i18n/format.ts (Intl.NumberFormat + DateTimeFormat
     — Indian lakh/crore preserved across all locales)
  4. **Internal-links audit + fix** (CRITICAL): every raw href
     in Navbar / MegaMenu / Footer must route through
     localizedPath(basePath, currentLocale). Otherwise a Hindi user
     clicking "Loans" from /hi/loans jumps back to English /loans.
     Use stripLocale(usePathname()) to derive currentLocale on the
     client. Audit:
       - components/v2/layout/Navbar.tsx       — CTAs + utility links
       - components/v2/layout/MegaMenu.tsx     — every category +
                                                 sub-category href
       - components/layout/Footer.tsx          — column links
  5. Wire t() into v2 Navbar — replace hardcoded "Credit Cards" /
     "Loans" / "Banking" / "Investing" / "Insurance" / "Taxes" with
     t('nav.creditCards') etc. Same for MegaMenu top-level labels.
  6. Wire t() into Footer column headers + legal links.
  7. Update LanguageSwitcher to render all 8 locales (currently 2).
     Wire into MobileNav too. Order: en, hi, bn, mr, te, ta, gu,
     kn — gu + kn show with `(English fallback)` hint until their
     strings file lands.

Verification gate (mandatory before commit):
  - npx tsc --noEmit --skipLibCheck    must be clean
  - Claude_Preview snapshot of:
      /credit-cards          — nav reads English
      /hi/credit-cards       — nav reads Hindi (क्रेडिट कार्ड etc.)
      /bn/credit-cards       — nav reads Bengali
      /mr/credit-cards       — nav reads Marathi
      /te/credit-cards       — nav reads Telugu
      /ta/credit-cards       — nav reads Tamil
      /gu/credit-cards       — falls back to English (no strings yet)
      /kn/credit-cards       — falls back to English (no strings yet)
  - Click "Loans" in nav from /hi/credit-cards — must land at
    /hi/loans, NOT /loans (proves internal-links audit worked)

Phase 2b follow-up (separate commit, can be the same session if time):
  - Create lib/i18n/strings/gu.ts + kn.ts (AI-drafted, with
    `// TODO: needs native-speaker review` markers — same as the
    other 5 regional locales already shipped)
  - Add a row to docs/MANUAL_ACTIONS_TRACKER.md tracking which
    locale strings need editorial review (currently all 7 regional
    locales are AI-drafted)
  - Convert 7 hub `metadata` blocks from static to async
    `generateMetadata()` so each locale variant self-canonicals
    (currently all variants share /credit-cards as canonical;
    flagged in commit a14c0b6d, deferred from Phase 1)

Branch: claude/vibrant-lovelace-875415 (head 27ce77bd → updated
                                         after this commit, fully
                                         pushed).
Worktree: .claude/worktrees/vibrant-lovelace-875415.
Use skills + MCPs proactively. Use Claude_Preview MCP for the
verification gate, not curl.
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
