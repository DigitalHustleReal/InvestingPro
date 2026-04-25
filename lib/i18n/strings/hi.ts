/**
 * Hindi (हिन्दी) translations for InvestingPro UI chrome.
 *
 * Translation principles (per brainstorm.md + abbreviations.ts):
 *   - Indian financial abbreviations stay in English: SIP, FD, EMI,
 *     CIBIL, GST, ITR, NPS, ELSS, KYC, IRDAI, DICGC, IFSC, etc.
 *   - Numbers + currency stay Indian-style (₹, lakh/crore via
 *     formatCurrency helper).
 *   - Tone: plain Hindi, code-switching where natural. Not formal
 *     literary Hindi.
 *
 * Coverage: high — most chrome strings have native Hindi. Where a
 * literal translation would sound robotic, we keep the English term
 * in Devanagari sentence flow (e.g. "EMI calculator" stays "EMI
 * calculator", not "ईएमआई कैलकुलेटर").
 *
 * Editorial review status: AI-drafted, **needs native-speaker review**
 * before promoting to "verified". Mark inline `// TODO: review` for
 * lines that read awkwardly.
 */

import type { LocalizedStrings } from "./en";

export const HI: LocalizedStrings = {
  // ── Top nav ──────────────────────────────────────────────────────
  "nav.creditCards": "क्रेडिट कार्ड",
  "nav.loans": "लोन",
  "nav.banking": "बैंकिंग",
  "nav.investing": "निवेश",
  "nav.insurance": "बीमा",
  "nav.taxes": "टैक्स",
  "nav.learn": "सीखें",
  "nav.compare": "तुलना",
  "nav.search": "खोजें",
  "nav.menu": "मेन्यू",
  "nav.close": "बंद करें",

  // ── Hub-shared sections ──────────────────────────────────────────
  "section.helperKit": "हेल्पर किट",
  "section.tools": "टूल्स",
  "section.popularComparisons": "लोकप्रिय तुलना",
  "section.runTheNumbers": "नंबर चलाइए",
  "section.fromTheDesk": "डेस्क से",
  "section.pickStage": "अपना स्टेज चुनें",
  "section.decisionsWorth": "जरूरी फैसले",
  "section.cardCalculators": "कैलकुलेटर",
  "section.latestArticles": "ताज़ा विश्लेषण",

  // ── CTAs ─────────────────────────────────────────────────────────
  "cta.subscribeFree": "मुफ्त सब्सक्राइब",
  "cta.readMore": "और पढ़ें",
  "cta.showMore": "और दिखाएं",
  "cta.startHere": "यहाँ से शुरू",
  "cta.learnMore": "और जानें",
  "cta.openComparison": "तुलना खोलें",
  "cta.findMyMatch": "मेरा मैच खोजें",
  "cta.showOptions": "विकल्प दिखाएं",
  "cta.showPlans": "प्लान्स दिखाएं",
  "cta.allArticles": "सभी लेख",
  "cta.allCalculators": "सभी कैलकुलेटर",
  "cta.compareCards": "कार्ड्स की तुलना",
  "cta.compareLenders": "लेंडर्स की तुलना",
  "cta.compareFDRates": "FD रेट्स की तुलना",
  "cta.findMyCard": "मेरा कार्ड खोजें",
  "cta.runMyEMI": "मेरा EMI निकालें",
  "cta.runMyFDReturn": "मेरा FD रिटर्न निकालें",
  "cta.howMuchCover": "मुझे कितना कवर चाहिए?",
  "cta.runFinancialHealth": "मेरा फाइनेंशियल हेल्थ स्कोर देखें",
  "cta.browseGlossary": "ग्लॉसरी देखें",
  "cta.seeClaimData": "क्लेम सेटलमेंट डेटा देखें",

  // ── Trust eyebrows ───────────────────────────────────────────────
  "trust.independentNoPaid": "स्वतंत्र रेटिंग · कोई पेड प्लेसमेंट नहीं",
  "trust.dicgcInsured": "DICGC बीमित · सरकारी-समर्थित योजनाएं",
  "trust.irdaiClaims": "IRDAI क्लेम डेटा · कोई पेड प्लेसमेंट नहीं",
  "trust.moneySkillsPlain": "पैसे की समझ · सरल हिन्दी · भारतीय संदर्भ",

  // ── Footer ───────────────────────────────────────────────────────
  "footer.aboutInvestingPro": "InvestingPro के बारे में",
  "footer.editorialTeam": "एडिटोरियल टीम",
  "footer.editorialStandards": "एडिटोरियल मानक",
  "footer.howWeMakeMoney": "हम कमाते कैसे हैं",
  "footer.advertiserDisclosure": "एडवरटाइज़र डिस्क्लोज़र",
  "footer.contact": "संपर्क",
  "footer.corrections": "सुधार",
  "footer.privacy": "गोपनीयता",
  "footer.terms": "शर्तें",
  "footer.cookies": "कुकी पॉलिसी",
  "footer.disclaimer": "डिस्क्लेमर",
  "footer.security": "सुरक्षा",
  "footer.accessibility": "एक्सेसिबिलिटी",
  "footer.subscribeWeekly":
    "हर रविवार — एक पैसा-संबंधी फैसला जो लेना है, एक जो नहीं, एक नियम बदलाव।",

  // ── FAQ + glossary ───────────────────────────────────────────────
  "faq.eyebrow": "त्वरित उत्तर",
  "faq.frequentlyAsked": "अक्सर पूछे जाते हैं",
  "glossary.title": "ग्लॉसरी",
  "glossary.tagline": "सरल भाषा। भारतीय संदर्भ।",

  // ── Common labels ────────────────────────────────────────────────
  "label.updatedDaily": "रोज़ अपडेट",
  "label.indicative": "अनुमानित",
  "label.popular": "लोकप्रिय",
  "label.trending": "ट्रेंडिंग",
  "label.new": "नया",
  "label.reviewedBy": "समीक्षा",
  "label.lastUpdated": "अंतिम अपडेट",
  "label.minRead": "मिनट पढ़ने में",
  "label.fyCurrent": "FY 2026-27",

  // ── Empty + error states ─────────────────────────────────────────
  "empty.noMatches": "कोई मैच नहीं",
  "empty.noCardsFit": "इन फिल्टर्स में कोई कार्ड नहीं मिला",
  "empty.tryFinder": "कार्ड फाइंडर क्विज़ आज़माएं",
  "empty.clearFilters": "सभी फिल्टर हटाएं",
  "error.somethingWrong": "कुछ गलत हुआ",
  "error.tryAgain": "फिर कोशिश करें",
};
