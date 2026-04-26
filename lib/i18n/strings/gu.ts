/**
 * Gujarati (ગુજરાતી) translations for InvestingPro UI chrome.
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
 *   - Tone: plain Gujarati with natural code-switching — not formal
 *     literary register. Where a literal translation reads robotic,
 *     keep the English term in Gujarati script flow (e.g. "EMI
 *     કેલ્ક્યુલેટર").
 */

import type { LocalizedStrings } from "./en";

export const GU: LocalizedStrings = {
  // ── Top nav ──────────────────────────────────────────────────────
  "nav.creditCards": "ક્રેડિટ કાર્ડ",
  "nav.loans": "લોન",
  "nav.banking": "બેંકિંગ",
  "nav.investing": "રોકાણ",
  "nav.insurance": "વીમો",
  "nav.taxes": "ટેક્સ",
  "nav.learn": "શીખો",
  "nav.compare": "તુલના",
  "nav.search": "શોધો",
  "nav.menu": "મેનુ",
  "nav.close": "બંધ કરો",

  // ── Hub-shared sections ──────────────────────────────────────────
  "section.helperKit": "હેલ્પર કિટ",
  "section.tools": "ટૂલ્સ",
  "section.popularComparisons": "લોકપ્રિય તુલના",
  "section.runTheNumbers": "આંકડા ગણો",
  "section.fromTheDesk": "ડેસ્ક પરથી",
  "section.pickStage": "તમારો સ્ટેજ પસંદ કરો",
  "section.decisionsWorth": "મહત્વના નિર્ણયો",
  "section.cardCalculators": "કેલ્ક્યુલેટર",
  "section.latestArticles": "તાજેતરનું વિશ્લેષણ",

  // ── CTAs ─────────────────────────────────────────────────────────
  "cta.subscribeFree": "મફતમાં સબ્સ્ક્રાઇબ",
  "cta.readMore": "વધુ વાંચો",
  "cta.showMore": "વધુ બતાવો",
  "cta.startHere": "અહીંથી શરૂ કરો",
  "cta.learnMore": "વધુ જાણો",
  "cta.openComparison": "તુલના ખોલો",
  "cta.findMyMatch": "મારો મેચ શોધો",
  "cta.showOptions": "વિકલ્પો બતાવો",
  "cta.showPlans": "પ્લાન બતાવો",
  "cta.allArticles": "બધા લેખ",
  "cta.allCalculators": "બધા કેલ્ક્યુલેટર",
  "cta.compareCards": "કાર્ડ્સની તુલના",
  "cta.compareLenders": "લેન્ડર્સની તુલના",
  "cta.compareFDRates": "FD રેટ્સની તુલના",
  "cta.findMyCard": "મારું કાર્ડ શોધો",
  "cta.runMyEMI": "મારો EMI કાઢો",
  "cta.runMyFDReturn": "મારું FD રિટર્ન કાઢો",
  "cta.howMuchCover": "મને કેટલું કવર જોઈએ?",
  "cta.runFinancialHealth": "મારો ફાઇનાન્શિયલ હેલ્થ સ્કોર",
  "cta.browseGlossary": "ગ્લોસરી જુઓ",
  "cta.seeClaimData": "ક્લેમ સેટલમેન્ટ ડેટા જુઓ",

  // ── Trust eyebrows ───────────────────────────────────────────────
  "trust.independentNoPaid": "સ્વતંત્ર રેટિંગ · કોઈ પેઇડ પ્લેસમેન્ટ નહીં",
  "trust.dicgcInsured": "DICGC વીમો · સરકારી-સમર્થિત યોજનાઓ",
  "trust.irdaiClaims": "IRDAI ક્લેમ ડેટા · કોઈ પેઇડ પ્લેસમેન્ટ નહીં",
  "trust.moneySkillsPlain": "પૈસાની સમજ · સરળ ભાષા · ભારતીય સંદર્ભ",

  // ── Footer ───────────────────────────────────────────────────────
  "footer.aboutInvestingPro": "InvestingPro વિશે",
  "footer.editorialTeam": "એડિટોરિયલ ટીમ",
  "footer.editorialStandards": "એડિટોરિયલ ધોરણો",
  "footer.howWeMakeMoney": "અમે કેવી રીતે કમાઈએ છીએ",
  "footer.advertiserDisclosure": "એડવર્ટાઇઝર ડિસ્ક્લોઝર",
  "footer.contact": "સંપર્ક",
  "footer.corrections": "સુધારા",
  "footer.privacy": "ગોપનીયતા",
  "footer.terms": "શરતો",
  "footer.cookies": "કુકી પોલિસી",
  "footer.disclaimer": "ડિસ્ક્લેમર",
  "footer.security": "સુરક્ષા",
  "footer.accessibility": "એક્સેસિબિલિટી",
  "footer.subscribeWeekly":
    "દર રવિવારે — એક પૈસાનો નિર્ણય જે લેવો, એક જે નહીં, એક નિયમ બદલાવ.",

  // ── FAQ + glossary ───────────────────────────────────────────────
  "faq.eyebrow": "ઝડપી જવાબો",
  "faq.frequentlyAsked": "વારંવાર પૂછાય છે",
  "glossary.title": "ગ્લોસરી",
  "glossary.tagline": "સરળ ભાષા. ભારતીય સંદર્ભ.",

  // ── Labels ───────────────────────────────────────────────────────
  "label.updatedDaily": "દરરોજ અપડેટ",
  "label.indicative": "અંદાજિત",
  "label.popular": "લોકપ્રિય",
  "label.trending": "ટ્રેન્ડિંગ",
  "label.new": "નવું",
  "label.reviewedBy": "સમીક્ષા",
  "label.lastUpdated": "છેલ્લે અપડેટ",
  "label.minRead": "મિનિટ વાંચો",
  "label.fyCurrent": "FY 2026-27",

  // ── Empty + error ────────────────────────────────────────────────
  "empty.noMatches": "કોઈ મેચ નથી",
  "empty.noCardsFit": "આ ફિલ્ટરમાં કોઈ કાર્ડ નથી",
  "empty.tryFinder": "કાર્ડ ફાઇન્ડર ક્વિઝ અજમાવો",
  "empty.clearFilters": "બધા ફિલ્ટર સાફ કરો",
  "error.somethingWrong": "કંઈક ખોટું થયું",
  "error.tryAgain": "ફરી પ્રયાસ કરો",
};
