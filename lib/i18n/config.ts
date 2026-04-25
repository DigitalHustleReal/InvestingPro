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
 * Rollout order (set 2026-04-25):
 *   Phase 1 (foundation, this commit): English + Hindi routing.
 *   Phase 2: Telugu / Tamil / Marathi / Gujarati / Bengali. Add to
 *            LOCALES below; the rest of the system (middleware,
 *            metadata helpers, switcher) reads from this list.
 */

/** Supported locales. Add a new locale by appending to this list. */
export const LOCALES = ["en", "hi"] as const;

export type Locale = (typeof LOCALES)[number];

/** Default locale — served at root (no path prefix). */
export const DEFAULT_LOCALE: Locale = "en";

/** Labels for UI rendering — native script + English name + lang label. */
export const LOCALE_META: Record<
  Locale,
  { native: string; english: string; label: string; htmlLang: string }
> = {
  en: {
    native: "English",
    english: "English",
    label: "EN",
    htmlLang: "en-IN",
  },
  hi: {
    native: "हिन्दी",
    english: "Hindi",
    label: "हिं",
    htmlLang: "hi-IN",
  },
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
