# Session Handoff — 2026-04-26 (i18n Phase 2 complete — chrome layer fully shipped)

> **Read this first.** Everything else is reachable from the pointers below.

---

## TL;DR

Branch `claude/vibrant-lovelace-875415` — **46 commits**, fully pushed.

Three workstreams from this thread of sessions:

1. **Priority-0 redesign sweep — DONE.** All 7 v3 URL-category hubs
   rebuilt + aligned to locked principles.
2. **i18n Phase 1 (routing) — DONE.** Middleware rewrites `/hi/*` →
   internal English path, `<html lang>` dynamic per locale, hreflang
   tags on every hub, LanguageSwitcher router-aware.
3. **i18n Phase 2 — DONE.** Server `t()` + client `useT()` shipped,
   chrome wired across all 4 nav surfaces (Navbar/MegaMenu/Footer/
   MobileNav), all 8 locales have strings shipped (gu+kn drafted in
   2b), and every hub now self-canonicals per locale via async
   `generateMetadata()`.

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
11. **Each locale variant self-canonicals.** `/hi/credit-cards`
    canonicals to `/hi/credit-cards`, not `/credit-cards`. Hreflang
    map still emits all locale alternates so Google dedupes —
    English ranking is preserved.

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

### Phase 2a i18n UI chrome (commit `db393155`)
- `lib/i18n/t.ts` — `getServerT()` + `loadDictionary()` (cached, dynamic
  imports), `lookup()` with English per-key fallback.
- `lib/i18n/client.tsx` — `<LocaleProvider>` + `useT()` + `useLocale()`.
- `lib/i18n/format.ts` — Indian lakh/crore-preserving currency, locale-
  aware dates, compact form.
- `app/layout.tsx` wraps tree in `<LocaleProvider>`.
- Navbar / MegaMenu / Footer / MobileNav all read labels via `t()` and
  route every `href` through `localizedPath(href, locale)`.
- LanguageSwitcher renders all 8 locales.

### Phase 2b i18n loose ends (this commit)
- `lib/i18n/strings/gu.ts` — Gujarati, AI-drafted (60+ keys, abbrev
  preserve list applied). Marked needs-review.
- `lib/i18n/strings/kn.ts` — Kannada, AI-drafted. Marked needs-review.
- `lib/i18n/t.ts` — `loadDictionary` now wires gu + kn (was English
  fallback in 2a).
- `LanguageSwitcher` — `FALLBACK_LOCALES` is now `[]`; the "(English)"
  suffix removed for all locales now that strings ship.
- All 7 hub `metadata` blocks (`credit-cards/loans/banking/investing/
  insurance/taxes/learn`) converted from static to async
  `generateMetadata()`. Each now reads `getServerLocale()` and emits
  a self-canonical URL plus the same hreflang map.
- `docs/MANUAL_ACTIONS_TRACKER.md` updated — gu/kn now listed alongside
  the other 5 regional locales as "AI-drafted, needs native review".

### Phase 2 verification (preview gate, port 3001)

| Locale | HTTP | `<html lang>` | canonical | "Credit Cards" | "Loans" |
| ------ | ---- | --- | --- | --- | --- |
| en     | 200  | en-IN | …/credit-cards | Credit Cards | Loans |
| hi     | 200  | hi-IN | …/hi/credit-cards | क्रेडिट कार्ड | लोन |
| bn     | 200  | bn-IN | …/bn/credit-cards | ক্রেডিট কার্ড | লোন |
| mr     | 200  | mr-IN | …/mr/credit-cards | क्रेडिट कार्ड | कर्ज |
| ta     | 200  | ta-IN | …/ta/credit-cards | கிரெடிட் கார்டுகள் | கடன்கள் |
| te     | 200  | te-IN | …/te/credit-cards | క్రెడిట్ కార్డులు | లోన్లు |
| gu     | 200  | gu-IN | …/gu/credit-cards | ક્રેડિટ કાર્ડ | લોન |
| kn     | 200  | kn-IN | …/kn/credit-cards | ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ | ಸಾಲ |

`(English)` fallback hint count on the picker = 0. Click "लोन" from
`/hi/credit-cards` → `/hi/loans` (NOT `/loans`). `npx tsc --noEmit
--skipLibCheck` clean.

---

## What's NOT done (next-session pick-up)

### Phase 3 — Content layer translation (largest remaining)

These require DB schema changes + AI translation passes + editorial
review per locale. Roughly 1,600+ rows × 7 locales = ~11k entries to
translate. The translation runs are AI-generated; the schema +
runtime accessors ship per-locale and can roll out one language at a
time.

- **Phase 3a — Glossary bilingual entries.** Add `definition_<locale>`
  columns (or a `glossary_translations` join table) to
  `glossary_terms`. AI-translate 101 × 7 = 707 entries. Editorial
  review per locale.

- **Phase 3b — FAQs in 7 locales.** Add `locale` column to
  `category_faqs`, plus `(question_id, locale)` unique index. AI-
  translate 54 × 7 = 378 entries.

- **Phase 3c — Calculator labels.** Add `locale` column to
  `calculators`. AI-translate 74 × 7 = 518 entries.

- **Phase 3d — Editorial hub copy.** `editorial_hubs` table is
  currently English-only. Either add `locale` column or embed a
  `body_translations: jsonb` field. ~96 rows × 7 locales.

### Phase 4 — Article body content (tiered)

Largest by volume but lowest urgency since hreflang already routes
non-localised long-tail articles back to English.
- Hindi: full 100 pillar articles via existing `scripts/auto-generate-
  batch.ts` with Hindi prompts.
- bn / mr / te / ta / gu / kn: top 25–50 pillar articles each.
- Long-tail articles stay English — hreflang covers it.

### Optional polish (Phase 2c)

Low urgency, small footprint:
- Expand `en.ts` with footer column titles ("Banking & Savings",
  "Taxes & Insurance", "Learn & About") + section subheads ("By
  Category", "By Issuer", "Tools") + MegaMenu chrome ("Featured
  Tool", "Try it free", "View all", "Methodology disclosed"). Add
  to all 7 regional files.
- Localise the breadcrumb JSON-LD (currently emits English root URLs
  even on `/hi/*`). Acceptable per principle 11 above, but if you
  want each locale's breadcrumb to self-link, the page Server
  Components have access to `getServerLocale()` already.
- Add desktop-side `LanguageSwitcher` (`isMobile=false`) to the
  hidden-on-mobile slot — currently only the mobile drawer shows it
  on small screens; desktop has it via Navbar.

---

## Restart prompt for next session

Paste after `/clear`:

```
Read docs/SESSION_HANDOFF.md first.

Continue with i18n Phase 3a (glossary bilingual entries — first slice
of the content-translation layer).

Steps in order:

  1. Inspect the current glossary_terms table shape via Supabase MCP
     (project ref txwxmbmbqltefwvilsii). Confirm: `slug`, `term`,
     `definition`, `category`, `created_at` (or similar). Decide
     between adding `definition_<locale>` columns vs. a separate
     `glossary_translations(term_id, locale, term, definition)`
     join table. Recommend the join table — cleaner for adding
     locales later.

  2. Create the migration via Supabase MCP. Apply locally + push to
     production via `mcp__supabase-alt__apply_migration`.

  3. Build `lib/content/glossary-i18n.ts` — `getGlossaryTerm(slug,
     locale)` accessor that reads the locale's row, falls back to
     English if missing. Mirror the FAQ/editorial-hubs accessor
     pattern (`lib/content/faqs.ts`, `lib/content/editorial-hubs.ts`).

  4. Wire the glossary detail page (`app/glossary/[slug]/page.tsx`)
     to use the locale-aware accessor. Same for `/glossary` index.

  5. Run AI translation for hi (Hindi) only as a first-locale proof:
     - Read all 101 entries.
     - Translate via Gemini → Groq → Mistral → OpenAI failover
       (existing `lib/ai-service.ts` chain).
     - Insert into `glossary_translations` with `locale='hi'`.
     - Add `// TODO: native review` audit log entry.
     Defer bn/mr/te/ta/gu/kn translation runs to follow-up sessions
     so the editorial team can review hi first before the others
     ship.

Verification gate (mandatory before commit):
  - npx tsc --noEmit --skipLibCheck    must be clean
  - Claude_Preview snapshot:
      /glossary               — index reads English
      /glossary/sip           — definition reads English
      /hi/glossary/sip        — definition reads Hindi (with
                                 fallback to English if a key is
                                 missing in the translated row)
  - Supabase RLS still enforced on the new translations table
    (read public, write service-role only)

Phase 3a stops at hi — bn/mr/te/ta/gu/kn translation runs are
follow-up sessions. Phase 3b (FAQs) and 3c (calc labels) follow the
same pattern.

Branch: claude/vibrant-lovelace-875415 (head will be updated after
                                         this commit, fully pushed).
Worktree: .claude/worktrees/vibrant-lovelace-875415.
Use Claude_Preview MCP for the verification gate, not curl.
Use the supabase-alt MCP, not the primary supabase MCP (the primary
sees the inactive Conduit project).
```

---

## Key file pointers

```
lib/i18n/
├── config.ts          — 8 locales, LOCALE_META, isLocale guard
├── url.ts             — localizedPath, stripLocale, hreflangAlternates
├── server.ts          — getServerLocale, getServerBasePath
├── abbreviations.ts   — ~120 preserved English terms
├── t.ts               — getServerT, loadDictionary, lookup
├── client.tsx         — LocaleProvider, useT, useLocale
├── format.ts          — formatCurrency/Number/Percent/Date/Relative
└── strings/           — all 8 locales SHIPPED
    ├── en.ts          — source-of-truth (60+ keys)
    ├── hi.ts          — Hindi (AI-drafted, needs review)
    ├── bn.ts          — Bengali (AI-drafted, needs review)
    ├── mr.ts          — Marathi (AI-drafted, needs review)
    ├── ta.ts          — Tamil (AI-drafted, needs review)
    ├── te.ts          — Telugu (AI-drafted, needs review)
    ├── gu.ts          — Gujarati (AI-drafted, needs review)
    └── kn.ts          — Kannada (AI-drafted, needs review)

middleware.ts          — locale rewrites + x-locale header
app/layout.tsx         — dynamic <html lang> + LocaleProvider wrap
app/{credit-cards,loans,banking,investing,insurance,taxes,learn}/page.tsx
                       — async generateMetadata() with per-locale
                         self-canonical
components/common/
└── LanguageSwitcher.tsx — router-aware switcher, no fallback hints
components/v2/layout/
├── Navbar.tsx         — t() chrome + localizedPath hrefs
├── MegaMenu.tsx       — t() top-level + localizedPath + canonical
│                        path active-state
└── MobileNav.tsx      — t() + localizedPath
components/layout/
└── Footer.tsx         — localizedPath hrefs + t() legal links

brainstorm.md §1     — design tokens + zebra rule
docs/MANUAL_ACTIONS_TRACKER.md — pending blocked items (incl. all
                                 7 AI-drafted locale strings needing
                                 native review)
```

---

## Pending blocked manual actions (unchanged)

🔴 Critical:
- Add `CRON_SECRET` to GitHub Actions Secrets (40 crons sit at 401)
- Open + merge this branch's PR

🟡 SEO:
- Submit sitemap.xml to GSC (now that Phase 2 self-canonical landed,
  fully unblocked)
- Submit sitemap to Bing
- Apply for Google AdSense (228 articles qualify)

🟡 Editorial:
- Native-speaker review pass on all 7 regional locale strings files
  (hi, bn, mr, ta, te, gu, kn)

Full list: `docs/MANUAL_ACTIONS_TRACKER.md`
