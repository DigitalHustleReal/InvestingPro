/**
 * English source-of-truth strings for the InvestingPro UI chrome.
 *
 * This file defines the keys and English copy. Other locale files
 * (hi, bn, mr, te, ta, gu, kn) use this as their type contract — any
 * key missing from a non-English locale falls back to the English
 * value via the `t()` helper.
 *
 * Scope: Phase 2a — navbar, footer columns, common CTAs, hub-shared
 * section labels, common buttons. Page body content (hero copy,
 * descriptions, FAQs, articles) is content-translation territory and
 * lives in DB tables (Phase 3+), not here.
 */

export const EN = {
  // ── Top nav (v2 navbar) ───────────────────────────────────────────
  "nav.creditCards": "Credit Cards",
  "nav.loans": "Loans",
  "nav.banking": "Banking",
  "nav.investing": "Investing",
  "nav.insurance": "Insurance",
  "nav.taxes": "Taxes",
  "nav.learn": "Learn",
  "nav.compare": "Compare",
  "nav.search": "Search",
  "nav.menu": "Menu",
  "nav.close": "Close",

  // ── Hub-shared section labels ────────────────────────────────────
  "section.helperKit": "Helper kit",
  "section.tools": "Tools",
  "section.popularComparisons": "Popular comparisons",
  "section.runTheNumbers": "Run the numbers",
  "section.fromTheDesk": "From the desk",
  "section.pickStage": "Pick your stage",
  "section.decisionsWorth": "Decisions worth running",
  "section.cardCalculators": "Calculators",
  "section.latestArticles": "Latest analysis",

  // ── Common CTAs / buttons ────────────────────────────────────────
  "cta.subscribeFree": "Subscribe free",
  "cta.readMore": "Read more",
  "cta.showMore": "Show more",
  "cta.startHere": "Start here",
  "cta.learnMore": "Learn more",
  "cta.openComparison": "Open comparison",
  "cta.findMyMatch": "Find my match",
  "cta.showOptions": "Show options",
  "cta.showPlans": "Show plans",
  "cta.allArticles": "All articles",
  "cta.allCalculators": "All calculators",
  "cta.compareCards": "Compare cards",
  "cta.compareLenders": "Compare lenders",
  "cta.compareFDRates": "Compare FD rates",
  "cta.findMyCard": "Find my card",
  "cta.runMyEMI": "Run my EMI",
  "cta.runMyFDReturn": "Run my FD return",
  "cta.howMuchCover": "How much cover do I need?",
  "cta.runFinancialHealth": "Run my financial health score",
  "cta.browseGlossary": "Browse the glossary",
  "cta.seeClaimData": "See claim settlement data",

  // ── Trust eyebrows ───────────────────────────────────────────────
  "trust.independentNoPaid": "Independent ratings · No paid placements",
  "trust.dicgcInsured": "DICGC-insured · Sovereign-backed schemes",
  "trust.irdaiClaims": "IRDAI claims data · No paid placements",
  "trust.moneySkillsPlain": "Money skills · Plain English · India context",

  // ── Footer ───────────────────────────────────────────────────────
  "footer.aboutInvestingPro": "About InvestingPro",
  "footer.editorialTeam": "Editorial team",
  "footer.editorialStandards": "Editorial standards",
  "footer.howWeMakeMoney": "How we make money",
  "footer.advertiserDisclosure": "Advertiser disclosure",
  "footer.contact": "Contact",
  "footer.corrections": "Corrections",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.cookies": "Cookie policy",
  "footer.disclaimer": "Disclaimer",
  "footer.security": "Security",
  "footer.accessibility": "Accessibility",
  "footer.subscribeWeekly":
    "Every Sunday — one money decision worth making, one to avoid, one rule change.",

  // ── FAQ + glossary ───────────────────────────────────────────────
  "faq.eyebrow": "Quick answers",
  "faq.frequentlyAsked": "frequently asked",
  "glossary.title": "Glossary",
  "glossary.tagline": "Plain English. India context.",

  // ── Common labels ────────────────────────────────────────────────
  "label.updatedDaily": "Updated daily",
  "label.indicative": "Indicative",
  "label.popular": "Popular",
  "label.trending": "Trending",
  "label.new": "New",
  "label.reviewedBy": "Reviewed by",
  "label.lastUpdated": "Last updated",
  "label.minRead": "min read",
  "label.fyCurrent": "FY 2026-27",

  // ── Empty + error states ─────────────────────────────────────────
  "empty.noMatches": "No matches",
  "empty.noCardsFit": "No cards fit those filters",
  "empty.tryFinder": "Try the card finder quiz",
  "empty.clearFilters": "Clear all filters",
  "error.somethingWrong": "Something went wrong",
  "error.tryAgain": "Try again",
} as const;

/**
 * The shape of a localized strings dictionary. Other locales only
 * need to translate the keys they have — missing keys fall back to
 * English via `t()`.
 *
 * Note: we use `Record<StringKey, string>` (not `typeof EN`) so each
 * locale can hold an arbitrary string per key — `typeof EN` would
 * lock each value to the English literal.
 */
export type StringKey = keyof typeof EN;
export type LocalizedStrings = Partial<Record<StringKey, string>>;
