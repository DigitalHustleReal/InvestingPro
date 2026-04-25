# Session Handoff — 2026-04-26 (i18n Phase 2a complete)

> **Read this first.** Everything else is reachable from the pointers below.

---

## TL;DR

Branch `claude/vibrant-lovelace-875415` — **45 commits**, fully pushed.

Three workstreams from this thread of sessions:

1. **Priority-0 redesign sweep — DONE.** All 7 v3 URL-category hubs
   rebuilt + aligned to locked principles.
2. **i18n Phase 1 (routing) — DONE.** Middleware rewrites `/hi/*` →
   internal English path, `<html lang>` dynamic per locale, hreflang
   tags on every hub, LanguageSwitcher router-aware.
3. **i18n Phase 2a (UI strings) — DONE.** Server `t()` + client
   `useT()` shipped. Navbar / MegaMenu / Footer / MobileNav all read
   strings via `t()` and route through `localizedPath()`. Verified
   end-to-end on dev preview across 6 locales (en/hi/bn/mr/ta/te);
   gu + kn cleanly fall back to English with a "(English)" hint in
   the picker.

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

### Phase 2a i18n UI chrome (this session)
- `lib/i18n/t.ts` — server-side `getServerT()` + `loadDictionary()`
  with React `cache()` memoisation + dynamic locale imports (no all-locale
  bundle bloat). `lookup()` falls back to English per-key.
- `lib/i18n/client.tsx` — `<LocaleProvider>` + `useT()` + `useLocale()`
  hooks. Provider reads dict from server, ships only the active locale's
  strings to the client.
- `lib/i18n/format.ts` — `formatCurrency` (Indian lakh/crore grouping
  preserved across all locales), `formatNumber`, `formatPercent`,
  `formatDate`, `formatRelative`. Compact form (`compact: true`) renders
  ₹1,25,000 as "₹1.25 lakh".
- `app/layout.tsx` — wraps the tree with `<LocaleProvider>`, loads the
  dict server-side via `loadDictionary(locale)`.
- `components/v2/layout/Navbar.tsx` — labels via `t(nav.*)`, every
  `href` wrapped in `localizedPath(path, locale)`, mobile drawer adds
  the LanguageSwitcher.
- `components/v2/layout/MegaMenu.tsx` — top-level category labels via
  `t(nav.*)`, every link href wrapped in `lp(href)`. Active-state
  comparison switched to use the canonical (locale-stripped) path so
  /hi/banking still highlights "Banking" tab.
- `components/v2/layout/MobileNav.tsx` — bottom tab labels via `t()`
  for matching keys (Compare/Tools/Learn). Hrefs localised. Home/
  Account stay English until Phase 2b adds keys.
- `components/layout/Footer.tsx` — every link href wrapped in `lp()`.
  Legal links use `t(footer.*)` keys where they exist; "How We Make
  Money" inline link translated via `footer.howWeMakeMoney`.
- `components/common/LanguageSwitcher.tsx` — gu + kn rendered with
  `(English)` suffix in the picker so users know the chrome will
  fall back. Removed in Phase 2b once strings ship.

### Phase 2a verification (preview gate)
Dev server (port 3001) was started, every locale was checked end-to-end:

| Locale | HTTP | `<html lang>` | "Credit Cards" | "Loans" |
| ------ | ---- | --- | --- | --- |
| en     | 200  | en-IN | Credit Cards | Loans |
| hi     | 200  | hi-IN | क्रेडिट कार्ड | लोन |
| bn     | 200  | bn-IN | ক্রেডিট কার্ড | লোন |
| mr     | 200  | mr-IN | क्रेडिट कार्ड | कर्ज |
| ta     | 200  | ta-IN | கிரெடிட் கார்டுகள் | கடன்கள் |
| te     | 200  | te-IN | క్రెడిట్ కార్డులు | లోన్లు |
| gu     | 200  | gu-IN | Credit Cards | Loans (English fallback) |
| kn     | 200  | kn-IN | Credit Cards | Loans (English fallback) |

Click test: clicking "लोन" from `/hi/credit-cards` navigated to
`/hi/loans` (NOT `/loans`) — internal-links audit verified working.

`npx tsc --noEmit --skipLibCheck` — clean.

---

## What's NOT done (next-session pick-up)

### Phase 2b — i18n loose ends

**Files still needed:**
- `lib/i18n/strings/gu.ts` (Gujarati) — AI-drafted with `// TODO:
  needs native-speaker review` markers. Same key shape as `en.ts`.
- `lib/i18n/strings/kn.ts` (Kannada) — same pattern.
- After they ship: remove `gu` + `kn` from `FALLBACK_LOCALES` in
  `components/common/LanguageSwitcher.tsx` so the `(English)` hint
  drops off.

**Self-referencing canonicals (flagged in commit `a14c0b6d`):**
- 7 hub `metadata` blocks (`app/{credit-cards,loans,banking,investing,
  insurance,taxes,learn}/page.tsx`) currently hard-code their canonical
  to the English root path. Each `/hi/credit-cards` etc. emits the
  same canonical, which is fine for hreflang dedupe but suboptimal.
  Convert each block from static `metadata` to async
  `generateMetadata()` reading `getServerLocale()` so each variant
  self-canonicals. Mechanical, ~7 files.

**Optional translation-quality polish (low urgency):**
- Add row to `docs/MANUAL_ACTIONS_TRACKER.md` tracking which locale
  strings are still AI-drafted (currently hi/bn/mr/ta/te all need
  native-speaker review; gu+kn need first-pass + review).
- Expand `en.ts` with column-title keys ("Banking & Savings", "Taxes
  & Insurance", "Learn & About") + section subheads ("By Category",
  "By Issuer", "Tools") so Footer column structure can be fully
  localised.
- Add `cta.tryItFree`, `mega.featuredTool`, `mega.viewAll`,
  `mega.methodologyDisclosed` keys for MegaMenu chrome that's still
  English.

### Phase 3+ (deferred)

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

Continue with i18n Phase 2b loose ends. Steps in order:

  1. Create lib/i18n/strings/gu.ts (Gujarati) and kn.ts (Kannada).
     Mirror the key shape of en.ts — `Partial<Record<StringKey,
     string>>`. AI-draft per-key, mark each file header with
     "needs native-speaker review". Match the abbreviations rule
     (SIP/FD/EMI/etc. stay English in Devanagari/regional script
     sentence flow — see hi.ts for the pattern).

  2. Once shipped, remove "gu" and "kn" from FALLBACK_LOCALES in
     components/common/LanguageSwitcher.tsx — the picker drops the
     "(English)" suffix automatically.

  3. Optional: convert the 7 hub `metadata` blocks from static
     to async `generateMetadata()` reading `getServerLocale()`,
     so each locale variant self-canonicals (currently they all
     canonical to the English root, flagged in commit a14c0b6d).
     Files: app/{credit-cards,loans,banking,investing,insurance,
     taxes,learn}/page.tsx.

  4. Optional: expand en.ts with footer column titles + sub-section
     keys + MegaMenu chrome keys. Re-translate across the 5 active
     regional files. Wire into Footer + MegaMenu.

  5. Add a row to docs/MANUAL_ACTIONS_TRACKER.md tracking the AI-
     drafted strings files that need native-speaker review.

Verification gate (mandatory before commit):
  - npx tsc --noEmit --skipLibCheck    must be clean
  - Claude_Preview snapshot:
      /gu/credit-cards — nav reads Gujarati ("ક્રેડિટ કાર્ડ")
      /kn/credit-cards — nav reads Kannada ("ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್")
      LanguageSwitcher — gu + kn no longer show (English)
  - Click test still works: /hi/credit-cards → "लोन" → /hi/loans

Branch: claude/vibrant-lovelace-875415 (head <will be updated after
                                          this commit, fully pushed).
Worktree: .claude/worktrees/vibrant-lovelace-875415.
Use Claude_Preview MCP for the verification gate, not curl.
```

---

## Key file pointers

```
lib/i18n/
├── config.ts          — 8 locales, LOCALE_META, isLocale guard
├── url.ts             — localizedPath, stripLocale, hreflangAlternates
├── server.ts          — getServerLocale, getServerBasePath
├── abbreviations.ts   — ~120 preserved English terms
├── t.ts               — getServerT, loadDictionary, lookup (Phase 2a)
├── client.tsx         — LocaleProvider, useT, useLocale (Phase 2a)
├── format.ts          — formatCurrency/Number/Percent/Date/Relative (Phase 2a)
└── strings/
    ├── en.ts          — 60+ source-of-truth keys (SHIPPED)
    ├── hi.ts          — Hindi (SHIPPED, AI-drafted, needs review)
    ├── bn.ts          — Bengali (SHIPPED, AI-drafted, needs review)
    ├── mr.ts          — Marathi (SHIPPED, AI-drafted, needs review)
    ├── ta.ts          — Tamil (SHIPPED, AI-drafted, needs review)
    ├── te.ts          — Telugu (SHIPPED, AI-drafted, needs review)
    ├── gu.ts          — TODO (Phase 2b)
    └── kn.ts          — TODO (Phase 2b)

middleware.ts          — locale rewrites + x-locale header
app/layout.tsx         — dynamic <html lang> + LocaleProvider wrap
components/common/
└── LanguageSwitcher.tsx — router-aware switcher with gu/kn fallback hint
components/v2/layout/
├── Navbar.tsx         — t() chrome + localizedPath hrefs
├── MegaMenu.tsx       — t() top-level + localizedPath hrefs + canonical
│                        path active-state
└── MobileNav.tsx      — t() + localizedPath
components/layout/
└── Footer.tsx         — localizedPath hrefs + t() legal links

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
  flipped earlier in this thread)
- Submit sitemap to Bing
- Apply for Google AdSense (228 articles qualify)

Full list: `docs/MANUAL_ACTIONS_TRACKER.md`
