"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  type Locale,
} from "@/lib/i18n/config";
import { localizedPath, stripLocale } from "@/lib/i18n/url";

/**
 * Locales whose strings dictionary is not yet shipped — they fall
 * back to English at lookup time. Surfaced as a hint in the picker
 * so users aren't surprised when the chrome stays English. Removed
 * from this list in Phase 2b once `lib/i18n/strings/{gu,kn}.ts`
 * land.
 */
const FALLBACK_LOCALES: ReadonlyArray<Locale> = ["gu", "kn"];

/**
 * Language switcher — wired to the locked i18n architecture
 * (lib/i18n/config + lib/i18n/url). Reads the current locale from
 * the URL prefix; on change, navigates to the equivalent path under
 * the chosen locale (default locale = root, others prefixed).
 *
 * Behaviour:
 *   /credit-cards  → switching to Hindi → /hi/credit-cards
 *   /hi/articles/foo → switching to English → /articles/foo
 *
 * No alerts, no hardcoded behaviour, no special-casing of articles —
 * it just rewrites the path through the canonical helpers.
 */
export default function LanguageSwitcher({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale: Locale = React.useMemo(() => {
    if (!pathname) return DEFAULT_LOCALE;
    return stripLocale(pathname).locale;
  }, [pathname]);

  const handleChange = (next: string) => {
    if (!pathname || next === currentLocale) return;
    const { basePath } = stripLocale(pathname);
    const target = localizedPath(basePath, next as Locale);
    router.push(target);
  };

  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const active = currentLocale === code;
          const isFallback = FALLBACK_LOCALES.includes(code);
          return (
            <Button
              key={code}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => handleChange(code)}
              className="w-full justify-start text-xs"
              title={
                isFallback
                  ? `${meta.english} — UI in English until full translation ships`
                  : meta.english
              }
            >
              <span className="font-mono mr-2 opacity-70">{meta.label}</span>
              <span className="truncate">{meta.native}</span>
              {isFallback && (
                <span className="ml-1 font-mono text-[9px] opacity-60 uppercase tracking-wider">
                  (en)
                </span>
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger
        aria-label="Language"
        className="w-[120px] h-9 text-xs font-mono uppercase tracking-wider border-ink-12 bg-transparent hover:border-indian-gold focus:ring-0"
      >
        <Globe className="w-3 h-3 mr-2 opacity-50" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code];
          const isFallback = FALLBACK_LOCALES.includes(code);
          return (
            <SelectItem key={code} value={code} className="text-xs">
              <span className="inline-flex items-center w-full">
                <span className="font-mono mr-2 opacity-60">{meta.label}</span>
                <span>{meta.native}</span>
                {isFallback && (
                  <span
                    className="ml-2 font-mono text-[9px] opacity-50 uppercase tracking-wider"
                    aria-label="English fallback"
                  >
                    (English)
                  </span>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
