/**
 * Kannada (ಕನ್ನಡ) translations for InvestingPro UI chrome.
 *
 * Status: AI-drafted, **needs native-speaker review**. Tracked in
 * `docs/MANUAL_ACTIONS_TRACKER.md` alongside the other 6 regional
 * locale files.
 *
 * Translation principles (mirror `hi.ts` / `bn.ts`):
 *   - Indian financial abbreviations stay in English (SIP, FD, EMI,
 *     CIBIL, GST, ITR, NPS, ELSS, KYC, IRDAI, DICGC, IFSC, MCLR,
 *     etc.) — see `lib/i18n/abbreviations.ts`.
 *   - Numbers + currency stay Indian-style (₹, lakh/crore via the
 *     `formatCurrency` helper in `format.ts`).
 *   - Tone: plain Kannada with natural code-switching — not formal
 *     literary register. Where a literal translation reads robotic,
 *     keep the English term in Kannada script flow (e.g. "EMI
 *     ಕ್ಯಾಲ್ಕುಲೇಟರ್").
 */

import type { LocalizedStrings } from "./en";

export const KN: LocalizedStrings = {
  // ── Top nav ──────────────────────────────────────────────────────
  "nav.creditCards": "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
  "nav.loans": "ಸಾಲ",
  "nav.banking": "ಬ್ಯಾಂಕಿಂಗ್",
  "nav.investing": "ಹೂಡಿಕೆ",
  "nav.insurance": "ವಿಮೆ",
  "nav.taxes": "ತೆರಿಗೆ",
  "nav.learn": "ಕಲಿಯಿರಿ",
  "nav.compare": "ಹೋಲಿಸಿ",
  "nav.search": "ಹುಡುಕಿ",
  "nav.menu": "ಮೆನು",
  "nav.close": "ಮುಚ್ಚಿ",

  // ── Hub-shared sections ──────────────────────────────────────────
  "section.helperKit": "ಹೆಲ್ಪರ್ ಕಿಟ್",
  "section.tools": "ಟೂಲ್ಸ್",
  "section.popularComparisons": "ಜನಪ್ರಿಯ ಹೋಲಿಕೆಗಳು",
  "section.runTheNumbers": "ಲೆಕ್ಕ ಮಾಡಿ",
  "section.fromTheDesk": "ಡೆಸ್ಕ್‌ನಿಂದ",
  "section.pickStage": "ನಿಮ್ಮ ಹಂತ ಆಯ್ಕೆ ಮಾಡಿ",
  "section.decisionsWorth": "ಮುಖ್ಯ ನಿರ್ಧಾರಗಳು",
  "section.cardCalculators": "ಕ್ಯಾಲ್ಕುಲೇಟರ್",
  "section.latestArticles": "ತಾಜಾ ವಿಶ್ಲೇಷಣೆ",

  // ── CTAs ─────────────────────────────────────────────────────────
  "cta.subscribeFree": "ಉಚಿತವಾಗಿ ಸಬ್ಸ್ಕ್ರೈಬ್",
  "cta.readMore": "ಇನ್ನಷ್ಟು ಓದಿ",
  "cta.showMore": "ಇನ್ನಷ್ಟು ತೋರಿಸಿ",
  "cta.startHere": "ಇಲ್ಲಿಂದ ಆರಂಭಿಸಿ",
  "cta.learnMore": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
  "cta.openComparison": "ಹೋಲಿಕೆ ತೆರೆಯಿರಿ",
  "cta.findMyMatch": "ನನ್ನ ಮ್ಯಾಚ್ ಹುಡುಕಿ",
  "cta.showOptions": "ಆಯ್ಕೆಗಳನ್ನು ತೋರಿಸಿ",
  "cta.showPlans": "ಪ್ಲಾನ್‌ಗಳನ್ನು ತೋರಿಸಿ",
  "cta.allArticles": "ಎಲ್ಲಾ ಲೇಖನಗಳು",
  "cta.allCalculators": "ಎಲ್ಲಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
  "cta.compareCards": "ಕಾರ್ಡ್‌ಗಳ ಹೋಲಿಕೆ",
  "cta.compareLenders": "ಸಾಲದಾತರ ಹೋಲಿಕೆ",
  "cta.compareFDRates": "FD ದರಗಳ ಹೋಲಿಕೆ",
  "cta.findMyCard": "ನನ್ನ ಕಾರ್ಡ್ ಹುಡುಕಿ",
  "cta.runMyEMI": "ನನ್ನ EMI ತೆಗೆಯಿರಿ",
  "cta.runMyFDReturn": "ನನ್ನ FD ರಿಟರ್ನ್",
  "cta.howMuchCover": "ನನಗೆ ಎಷ್ಟು ಕವರ್ ಬೇಕು?",
  "cta.runFinancialHealth": "ನನ್ನ ಫೈನಾನ್ಶಿಯಲ್ ಹೆಲ್ತ್ ಸ್ಕೋರ್",
  "cta.browseGlossary": "ಗ್ಲಾಸರಿ ನೋಡಿ",
  "cta.seeClaimData": "ಕ್ಲೈಮ್ ಸೆಟಲ್‌ಮೆಂಟ್ ಡೇಟಾ",

  // ── Trust eyebrows ───────────────────────────────────────────────
  "trust.independentNoPaid": "ಸ್ವತಂತ್ರ ರೇಟಿಂಗ್ · ಪೇಯ್ಡ್ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಇಲ್ಲ",
  "trust.dicgcInsured": "DICGC ವಿಮೆ · ಸರ್ಕಾರಿ-ಬೆಂಬಲಿತ ಯೋಜನೆಗಳು",
  "trust.irdaiClaims": "IRDAI ಕ್ಲೈಮ್ ಡೇಟಾ · ಪೇಯ್ಡ್ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಇಲ್ಲ",
  "trust.moneySkillsPlain": "ಹಣದ ಕೌಶಲ್ಯ · ಸರಳ ಭಾಷೆ · ಭಾರತೀಯ ಸಂದರ್ಭ",

  // ── Footer ───────────────────────────────────────────────────────
  "footer.aboutInvestingPro": "InvestingPro ಬಗ್ಗೆ",
  "footer.editorialTeam": "ಸಂಪಾದಕೀಯ ತಂಡ",
  "footer.editorialStandards": "ಸಂಪಾದಕೀಯ ಮಾನದಂಡಗಳು",
  "footer.howWeMakeMoney": "ನಾವು ಹೇಗೆ ಗಳಿಸುತ್ತೇವೆ",
  "footer.advertiserDisclosure": "ಜಾಹೀರಾತುದಾರರ ಬಹಿರಂಗಪಡಿಸುವಿಕೆ",
  "footer.contact": "ಸಂಪರ್ಕ",
  "footer.corrections": "ತಿದ್ದುಪಡಿಗಳು",
  "footer.privacy": "ಗೌಪ್ಯತೆ",
  "footer.terms": "ನಿಯಮಗಳು",
  "footer.cookies": "ಕುಕೀ ನೀತಿ",
  "footer.disclaimer": "ಡಿಸ್ಕ್ಲೈಮರ್",
  "footer.security": "ಭದ್ರತೆ",
  "footer.accessibility": "ಪ್ರವೇಶಿಸುವಿಕೆ",
  "footer.subscribeWeekly":
    "ಪ್ರತಿ ಭಾನುವಾರ — ಒಂದು ಹಣಕಾಸಿನ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳಬೇಕಾದದ್ದು, ಒಂದು ತಪ್ಪಿಸಬೇಕಾದದ್ದು, ಒಂದು ನಿಯಮ ಬದಲಾವಣೆ.",

  // ── FAQ + glossary ───────────────────────────────────────────────
  "faq.eyebrow": "ತ್ವರಿತ ಉತ್ತರಗಳು",
  "faq.frequentlyAsked": "ಆಗಾಗ ಕೇಳಲಾಗುತ್ತದೆ",
  "glossary.title": "ಗ್ಲಾಸರಿ",
  "glossary.tagline": "ಸರಳ ಭಾಷೆ. ಭಾರತೀಯ ಸಂದರ್ಭ.",

  // ── Labels ───────────────────────────────────────────────────────
  "label.updatedDaily": "ಪ್ರತಿದಿನ ಅಪ್‌ಡೇಟ್",
  "label.indicative": "ಸೂಚಕ",
  "label.popular": "ಜನಪ್ರಿಯ",
  "label.trending": "ಟ್ರೆಂಡಿಂಗ್",
  "label.new": "ಹೊಸದು",
  "label.reviewedBy": "ಪರಿಶೀಲನೆ",
  "label.lastUpdated": "ಕೊನೆಯ ಅಪ್‌ಡೇಟ್",
  "label.minRead": "ನಿಮಿಷ ಓದಿ",
  "label.fyCurrent": "FY 2026-27",

  // ── Empty + error ────────────────────────────────────────────────
  "empty.noMatches": "ಯಾವುದೇ ಮ್ಯಾಚ್ ಇಲ್ಲ",
  "empty.noCardsFit": "ಈ ಫಿಲ್ಟರ್‌ಗಳಲ್ಲಿ ಯಾವುದೇ ಕಾರ್ಡ್ ಇಲ್ಲ",
  "empty.tryFinder": "ಕಾರ್ಡ್ ಫೈಂಡರ್ ಕ್ವಿಜ್ ಪ್ರಯತ್ನಿಸಿ",
  "empty.clearFilters": "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
  "error.somethingWrong": "ಏನೋ ತಪ್ಪಾಗಿದೆ",
  "error.tryAgain": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
};
