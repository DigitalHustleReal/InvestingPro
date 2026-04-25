/**
 * Locale configuration — single source of truth for InvestingPro i18n.
 *
 * Architecture (locked 2026-04-25 PM, see brainstorm.md / future
 * roadmap):
 *   - **English is the default + canonical**, served at root URLs:
 *       /credit-cards, /articles/foo, ...
 *   - **Regional locales are additive**, served at locale-prefixed
 *     paths:
 *       /hi/credit-cards, /te/articles/foo, ...
 *   - Each locale-prefixed page emits `hreflang` back to the English
 *     canonical AND to every other locale alternate, so Google
 *     dedupes the variants without cannibalising the English ranking.
 *   - Goal: outreach + SEO growth + broader reach. Indian regional
 *     search volume is 2-3x English per Google's India index data;
 *     hreflang prevents the regional variants from hurting English.
 *
 * Locale ordering follows Indian native-speaker counts (largest first):
 *   en (default) > hi > bn > mr > te > ta > gu > kn
 *
 * Adding a new locale = appending to LOCALES + LOCALE_META below; the
 * rest of the system (middleware matcher, hreflang alternates, locale
 * switcher, t() accessor, format helpers) reads from this config.
 */

/** Supported locales. */
export const LOCALES = [
  "en",
  "hi",
  "bn",
  "mr",
  "te",
  "ta",
  "gu",
  "kn",
] as const;

export type Locale = (typeof LOCALES)[number];

/** Default locale — served at root (no path prefix). */
export const DEFAULT_LOCALE: Locale = "en";

/** Labels for UI rendering — native script + English name + lang label. */
export const LOCALE_META: Record<
  Locale,
  { native: string; english: string; label: string; htmlLang: string }
> = {
  en: { native: "English", english: "English", label: "EN", htmlLang: "en-IN" },
  hi: { native: "हिन्दी", english: "Hindi", label: "हिं", htmlLang: "hi-IN" },
  bn: { native: "বাংলা", english: "Bengali", label: "বাং", htmlLang: "bn-IN" },
  mr: { native: "मराठी", english: "Marathi", label: "मरा", htmlLang: "mr-IN" },
  te: { native: "తెలుగు", english: "Telugu", label: "తె", htmlLang: "te-IN" },
  ta: { native: "தமிழ்", english: "Tamil", label: "தமி", htmlLang: "ta-IN" },
  gu: {
    native: "ગુજરાતી",
    english: "Gujarati",
    label: "ગુ",
    htmlLang: "gu-IN",
  },
  kn: { native: "ಕನ್ನಡ", english: "Kannada", label: "ಕ", htmlLang: "kn-IN" },
};

/** Type guard. */
export function isLocale(s: string | null | undefined): s is Locale {
  return !!s && (LOCALES as readonly string[]).includes(s);
}

/**
 * Locales other than default — used to build path-prefix matchers in
 * middleware and to enumerate hreflang alternates in metadata.
 */
export const NON_DEFAULT_LOCALES: ReadonlyArray<Locale> = LOCALES.filter(
  (l) => l !== DEFAULT_LOCALE,
);
