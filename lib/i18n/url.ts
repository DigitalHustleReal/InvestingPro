/**
 * Locale-aware URL helpers.
 *
 * Source-of-truth contract:
 *   - English (default) lives at root paths:    /credit-cards
 *   - Other locales live at prefixed paths:     /hi/credit-cards
 *   - `localizedPath('/credit-cards', 'en')` → '/credit-cards'
 *   - `localizedPath('/credit-cards', 'hi')` → '/hi/credit-cards'
 *
 * Use these helpers everywhere a path is emitted (canonical metadata,
 * hreflang alternates, sitemap entries, locale switcher targets,
 * articleUrl callers). Never hand-build `/${locale}/...` strings.
 */

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALES,
  NON_DEFAULT_LOCALES,
  type Locale,
} from "./config";

/**
 * Convert a base (English/canonical) path into the path for a given
 * locale. Default locale stays at root, every other locale prefixes.
 */
export function localizedPath(basePath: string, locale: Locale): string {
  const path = basePath.startsWith("/") ? basePath : `/${basePath}`;
  if (locale === DEFAULT_LOCALE) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

/**
 * Inverse of `localizedPath` — splits a path into (locale, basePath).
 * Returns DEFAULT_LOCALE when no prefix matches.
 *
 * '/hi/credit-cards' → { locale: 'hi', basePath: '/credit-cards' }
 * '/credit-cards'    → { locale: 'en', basePath: '/credit-cards' }
 * '/'                → { locale: 'en', basePath: '/' }
 */
export function stripLocale(path: string): {
  locale: Locale;
  basePath: string;
} {
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && first !== DEFAULT_LOCALE && isLocale(first)) {
    const rest = "/" + segments.slice(1).join("/");
    return { locale: first, basePath: rest === "/" ? "/" : rest };
  }
  return {
    locale: DEFAULT_LOCALE,
    basePath: path === "" ? "/" : path,
  };
}

/**
 * Build the `alternates.languages` map for `Metadata.alternates`.
 * Caller passes the canonical English path; this fills in every
 * supported locale plus `x-default` (per Google hreflang spec).
 *
 * Use:
 *   import { generateCanonicalUrl } from '@/lib/linking/canonical';
 *   alternates: {
 *     canonical: generateCanonicalUrl(localizedPath(basePath, locale)),
 *     languages: hreflangAlternates(basePath),
 *   }
 */
export function hreflangAlternates(
  basePath: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ||
    "https://investingpro.in",
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of LOCALES) {
    map[locale] = `${baseUrl}${localizedPath(basePath, locale)}`;
  }
  // Google: x-default points to the page that has no language/region
  // targeting. Our default is English at root.
  map["x-default"] = `${baseUrl}${localizedPath(basePath, DEFAULT_LOCALE)}`;
  return map;
}

/** Re-export for convenience. */
export { LOCALES, NON_DEFAULT_LOCALES, DEFAULT_LOCALE };
