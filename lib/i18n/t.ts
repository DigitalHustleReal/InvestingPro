/**
 * Server-side string lookup for the InvestingPro UI chrome.
 *
 * Two entry points:
 *
 *   1. `getServerT()` — call once near the top of a Server Component
 *      or `generateMetadata()`. Returns a sync `(key) => string`
 *      bound to the request's resolved locale. Internally it loads
 *      the per-locale dictionary lazily (dynamic import) so each
 *      Edge / Node bundle only pulls the strings it actually needs.
 *
 *   2. `loadDictionary(locale)` — used by the root layout to ship
 *      the resolved dictionary down through `<LocaleProvider>` to
 *      client components. Same dynamic-import shape, same fallback
 *      behaviour.
 *
 * Fallback chain: `STRINGS[locale][key] → EN[key]`. Missing locales
 * (gu, kn until Phase 2b) fall back entirely to English. Missing
 * keys within a locale fall back per-key — translators can ship
 * incrementally without breaking the UI.
 *
 * The locale itself comes from `getServerLocale()`, which reads the
 * `x-locale` header set by `middleware.ts`. Memoised per request via
 * React's built-in cache so repeated `getServerT()` calls within a
 * single render don't re-import the dictionary.
 */

import { cache } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { EN, type LocalizedStrings, type StringKey } from "./strings/en";
import { getServerLocale } from "./server";

/**
 * Resolve the strings dictionary for a locale. English is the
 * source-of-truth bundle, so it's returned synchronously. Every
 * other locale is dynamic-imported on first use and then cached by
 * the React `cache()` wrapper below.
 */
async function loadDictUncached(locale: Locale): Promise<LocalizedStrings> {
  if (locale === "en") return EN as LocalizedStrings;
  switch (locale) {
    case "hi":
      return (await import("./strings/hi")).HI;
    case "bn":
      return (await import("./strings/bn")).BN;
    case "mr":
      return (await import("./strings/mr")).MR;
    case "te":
      return (await import("./strings/te")).TE;
    case "ta":
      return (await import("./strings/ta")).TA;
    case "gu":
    case "kn":
      // Phase 2b — strings files not shipped yet, fall back to EN.
      return EN as LocalizedStrings;
    default: {
      // Compile-time exhaustiveness guard.
      const _exhaustive: never = locale;
      void _exhaustive;
      return EN as LocalizedStrings;
    }
  }
}

export const loadDictionary = cache(loadDictUncached);

/** Look up a key against a dict with English fallback. */
export function lookup(key: StringKey, dict: LocalizedStrings): string {
  const value = dict[key];
  if (typeof value === "string" && value.length > 0) return value;
  return EN[key];
}

/**
 * Server-side bound `t()`. Call once per render — the returned
 * function is sync and zero-cost per key.
 *
 *   const t = await getServerT();
 *   <h1>{t("nav.creditCards")}</h1>
 */
export async function getServerT(): Promise<(key: StringKey) => string> {
  const locale = await getServerLocale();
  const dict = await loadDictionary(locale);
  return (key) => lookup(key, dict);
}

/**
 * Server-side bound `t()` for an explicit locale (e.g. inside
 * `generateMetadata()` when you've already resolved the locale via
 * `getServerLocale()` and want to avoid the second `headers()`
 * read).
 */
export async function getTForLocale(
  localeInput: string | null | undefined,
): Promise<(key: StringKey) => string> {
  const locale: Locale = isLocale(localeInput) ? localeInput : DEFAULT_LOCALE;
  const dict = await loadDictionary(locale);
  return (key) => lookup(key, dict);
}
