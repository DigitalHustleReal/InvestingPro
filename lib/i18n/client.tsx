"use client";

/**
 * Client-side locale plumbing.
 *
 * The root layout (server component) resolves the locale via
 * `getServerLocale()` and the dictionary via `loadDictionary()`,
 * then renders:
 *
 *   <LocaleProvider locale={locale} dict={dict}>{children}</LocaleProvider>
 *
 * Client components below the provider read either:
 *   - `useLocale()`  — current locale code (for switcher, links)
 *   - `useT()`       — `(key) => string` synchronous lookup
 *
 * The dictionary is shipped as a serialised prop (small — ~60
 * keys × ~30 chars). No fetch round-trip from the client.
 *
 * The strings type contract is `LocalizedStrings` (defined in
 * `./strings/en`). Missing keys fall back to English at lookup time.
 */

import * as React from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { EN, type LocalizedStrings, type StringKey } from "./strings/en";

interface LocaleContextValue {
  locale: Locale;
  dict: LocalizedStrings;
}

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dict: EN as LocalizedStrings,
});

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: LocalizedStrings;
  children: React.ReactNode;
}) {
  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, dict }),
    [locale, dict],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return React.useContext(LocaleContext).locale;
}

/**
 * Returns `(key) => string`. Looks up the key in the active
 * dictionary, falls back to English if missing or empty.
 */
export function useT(): (key: StringKey) => string {
  const { dict } = React.useContext(LocaleContext);
  return React.useCallback(
    (key: StringKey) => {
      const value = dict[key];
      if (typeof value === "string" && value.length > 0) return value;
      return EN[key];
    },
    [dict],
  );
}
