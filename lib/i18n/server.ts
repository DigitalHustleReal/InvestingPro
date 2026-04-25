/**
 * Server-side locale resolver.
 *
 * Used by Server Components, route handlers, and metadata generators
 * to know which locale the current request should render. Reads in
 * priority order:
 *
 *   1. The `x-locale` request header — set by middleware after
 *      detecting a locale-prefixed path (e.g. /hi/...). This is the
 *      authoritative source.
 *   2. Cookie `NEXT_LOCALE` — used as a tie-breaker when the URL is
 *      ambiguous (e.g. an API route). Currently informational only.
 *   3. DEFAULT_LOCALE (English) — fallback.
 *
 * Page components that need the locale should call `getServerLocale()`.
 * Pages that need the canonical *English* base path of the current
 * URL should call `getServerBasePath()`.
 */

import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { stripLocale } from "./url";

const LOCALE_HEADER = "x-locale";
const PATH_HEADER = "x-pathname";

export async function getServerLocale(): Promise<Locale> {
  try {
    const h = await headers();
    const fromHeader = h.get(LOCALE_HEADER);
    if (isLocale(fromHeader)) return fromHeader;
  } catch {
    // headers() unavailable in some contexts — fall through.
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns the locale-stripped (canonical English) base path of the
 * current request. Useful for building hreflang alternates without
 * needing the page to pass its own path explicitly.
 *
 * Requires the `x-pathname` header to be set by middleware (see
 * middleware.ts — it copies `nextUrl.pathname` to that header before
 * rewrites).
 */
export async function getServerBasePath(): Promise<string> {
  try {
    const h = await headers();
    const path = h.get(PATH_HEADER);
    if (path) {
      const { basePath } = stripLocale(path);
      return basePath;
    }
  } catch {
    // fall through
  }
  return "/";
}
