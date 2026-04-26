# Session Handoff — 2026-04-26 (i18n Phase 3a infra shipped — content-layer rails live)

> **Read this first.** Everything else is reachable from the pointers below.

---

## TL;DR

Branch `claude/vibrant-lovelace-875415` — **47 commits**, fully pushed.

Four workstreams from this thread of sessions:

1. **Priority-0 redesign sweep — DONE.** All 7 v3 URL-category hubs
   rebuilt + aligned to locked principles.
2. **i18n Phase 1 (routing) — DONE.** Middleware rewrites `/hi/*` →
   internal English path, `<html lang>` dynamic per locale, hreflang
   tags on every hub, LanguageSwitcher router-aware.
3. **i18n Phase 2 — DONE.** Server `t()` + client `useT()` shipped,
   chrome wired across all 4 nav surfaces (Navbar/MegaMenu/Footer/
   MobileNav), all 8 locales have strings shipped, every hub self-
   canonicals per locale via async `generateMetadata()`.
4. **i18n Phase 3a infrastructure — DONE.** `glossary_translations`
   table live in production, `lib/content/glossary-i18n.ts` accessor
   with per-field English fallback, `/glossary` index + `/glossary/
   [slug]` detail both wired (locale-aware data, hreflang, self-
   canonical). Hindi AI translation run **deferred** until the
   2026-05-10 chrome-review nudge closes feedback so the next 700+
   entries inherit any tone-correction lessons.

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

### Phase 3a glossary infrastructure (this commit)

- Migration `create_glossary_translations` applied to production
  Supabase (project ref `txwxmbmbqltefwvilsii`). Schema:
    glossary_translations (term_id, locale, term, definition,
      detailed_explanation, example_numeric, example_text,
      why_it_matters, how_to_use, common_mistakes, full_form,
      pronunciation, seo_title, seo_description, ai_generated,
      ai_model, reviewed_by, reviewed_at, needs_review, ...).
    UNIQUE(term_id, locale). RLS: public read; writes via
    service-role only.
- `lib/content/glossary-i18n.ts` — three React.cache-wrapped
  accessors: `getGlossaryTerm(slug, locale)`,
  `getRelatedTermCards(slugs, locale)`, `getGlossaryIndex(locale)`.
  Each does one English fetch + one locale fetch (skipped when
  locale === 'en'), merges per-field with `compactTranslation()`
  so NULL / empty values fall back to English.
- `app/glossary/[slug]/page.tsx` — fully migrated off the inline
  Supabase fetch onto `getGlossaryTerm(slug, locale)`. canonical +
  hreflang.alternates wired. All breadcrumbs, sidebar links, related-
  term + related-calculator + related-guide hrefs run through
  `localizedPath()`.
- `app/glossary/page.tsx` — converted from sync to async server
  component. Reads locale, server-fetches via
  `getGlossaryIndex(locale)`, passes `initialTerms` + `locale` to
  `GlossaryClient`. Emits self-canonical + hreflang.
- `app/glossary/GlossaryClient.tsx` — accepts `initialTerms` +
  `locale` props. When SSR provides initial data, the legacy
  `api.entities.Glossary.list()` fetch is skipped (kept as
  defensive fallback). Term-card link hrefs wrapped in
  `localizedPath()`.

### Phase 3a verification (preview, port 3001)

| URL                                          | HTTP | htmlLang | canonical                                               | hreflang | Notes |
| -------------------------------------------- | ---- | -------- | ------------------------------------------------------- | -------- | --- |
| /glossary                                    | 200  | en-IN    | /glossary                                               | 9        | Self-canonical |
| /hi/glossary                                 | 200  | hi-IN    | /hi/glossary                                            | 9        | Self-canonical |
| /glossary/sip-systematic-investment-plan     | 200  | en-IN    | /glossary/sip-systematic-investment-plan                | 9        | English content |
| /hi/glossary/sip-systematic-investment-plan  | 200  | hi-IN    | /hi/glossary/sip-systematic-investment-plan             | 9        | English fallback (no translations data yet) |

**Smoke test of the per-field merge** — inserted a single dummy
Hindi `definition` row for `sip-systematic-investment-plan` and
fetched `/hi/glossary/sip-...`: the page rendered the Hindi
definition, while the English page kept English. Test row deleted
after confirmation. Runtime + DB + accessor + RSC pipeline all
proven end-to-end.

`npx tsc --noEmit --skipLibCheck` — clean.

---

## What's NOT done (next-session pick-up)

### Phase 3a Hindi translation run (deferred until 2026-05-10)

The infrastructure ships ready for translations to be loaded at
any time. The actual Hindi translation pass is **deliberately
deferred** until the chrome-strings native review nudge fires
(2026-05-10, routine `trig_017GTDe6rgHY3WJqMueXAHXo`) so the next
700+ entries inherit any tone-correction lessons from the chrome
review. After that:

- Read all 101 published `glossary_terms` rows.
- For each, AI-draft Hindi translations of the 12 translatable
  fields (term may stay English in Devanagari sentence flow per
  the abbreviations rule — see `lib/i18n/abbreviations.ts`).
- Insert into `glossary_translations` with
  `locale='hi'`, `ai_generated=true`, `ai_model=<used>`,
  `needs_review=true`.
- Use the failover chain in `lib/ai-service.ts`
  (Gemini → Groq → Mistral → OpenAI).
- Add a tracker row in `docs/MANUAL_ACTIONS_TRACKER.md` for
  editorial review of the Hindi pass before bn/mr/te/ta/gu/kn
  runs.

### Phase 3 — Remaining content layer

These follow the same pattern as 3a (table + accessor + page wiring,
then per-locale AI translation passes deferred until review feedback
closes):

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

Hold on Phase 3a Hindi translation run — wait for the 2026-05-10
chrome-strings review nudge (trig_017GTDe6rgHY3WJqMueXAHXo) to
fire and resolve before piling 700+ more AI-drafted entries on the
same reviewers. The infrastructure is shipped and waiting; nothing
else is blocked.

Two productive paths to pick up in the meantime:

OPTION A — Phase 3b (FAQs in 7 locales infrastructure)
  Mirror the Phase 3a pattern for `category_faqs`:
    1. Migration: `category_faqs_translations(faq_id, locale,
       question, answer, ai_generated, ai_model, needs_review,
       created_at, updated_at)` with UNIQUE(faq_id, locale).
       RLS: public read, service-role write.
    2. `lib/content/faqs.ts` — extend `getFAQsForCategory` to
       accept a `locale` param and merge per-row translations
       (English fallback, same shape as glossary-i18n).
    3. CategoryFAQ component — already locale-aware via
       `getServerLocale()` upstream. Pass the locale through.
    4. Verification: tsc clean + Claude_Preview snapshot of
       /credit-cards (FAQ block in English) and /hi/credit-cards
       (FAQ block falls back to English until the translations
       table fills).

OPTION B — Phase 3c (Calculator labels in 7 locales infrastructure)
  Same pattern. `calculators_translations(calculator_id, locale,
  name, description, ...)`. Calculator hub + detail pages read
  the locale-aware accessor.

Both options build the rails without adding to the editorial review
queue. Pick A first — FAQs are surfaced on every hub, higher SEO
multiplier than calculator labels.

Verification gate (mandatory before commit, both options):
  - npx tsc --noEmit --skipLibCheck    clean
  - Claude_Preview snapshot of one English path + one /hi/* path
  - Smoke-test the runtime merge by inserting a single dummy row
    in the new translations table, fetching the /hi/* page,
    confirming the Hindi text shows, then deleting the row before
    commit (proven pattern from Phase 3a).

Branch: claude/vibrant-lovelace-875415 (head updated after this
                                         commit, fully pushed).
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
app/glossary/page.tsx          — async server component, locale-aware
                                  initial terms via getGlossaryIndex
app/glossary/[slug]/page.tsx   — getGlossaryTerm(slug, locale) +
                                  hreflang + localized links
app/glossary/GlossaryClient.tsx — accepts initialTerms + locale props
components/common/
└── LanguageSwitcher.tsx — router-aware switcher, no fallback hints
components/v2/layout/
├── Navbar.tsx         — t() chrome + localizedPath hrefs
├── MegaMenu.tsx       — t() top-level + localizedPath + canonical
│                        path active-state
└── MobileNav.tsx      — t() + localizedPath
components/layout/
└── Footer.tsx         — localizedPath hrefs + t() legal links

lib/content/
├── glossary-i18n.ts   — getGlossaryTerm/Index/RelatedTermCards with
│                        per-field English fallback (Phase 3a)
├── faqs.ts            — DB-first FAQ accessor (English-only today;
│                        Phase 3b adds locale)
└── editorial-hubs.ts  — DB-first hub copy (English-only today)

supabase migration: create_glossary_translations
                       — applied to production project
                         (txwxmbmbqltefwvilsii)

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
