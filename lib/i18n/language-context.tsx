"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English",          label: "EN", nativeName: "English"   },
  { code: "hi", name: "Hindi",            label: "HI", nativeName: "हिंदी"      },
  { code: "te", name: "Telugu",           label: "TE", nativeName: "తెలుగు"     },
  { code: "ta", name: "Tamil",            label: "TA", nativeName: "தமிழ்"      },
  { code: "kn", name: "Kannada",          label: "KN", nativeName: "ಕನ್ನಡ"      },
  { code: "ml", name: "Malayalam",        label: "ML", nativeName: "മലയാളം"     },
  { code: "mr", name: "Marathi",          label: "MR", nativeName: "मराठी"      },
  { code: "bn", name: "Bengali",          label: "BN", nativeName: "বাংলা"      },
  { code: "gu", name: "Gujarati",         label: "GU", nativeName: "ગુજરાતી"    },
] as const;

export type LangCode = typeof SUPPORTED_LANGUAGES[number]["code"];

// Flat key lookup: "common.applyNow" → translated string
type TranslationDict = Record<string, string>;

// Lazy-load translation JSON per locale
const translationCache: Partial<Record<LangCode, TranslationDict>> = {};

async function loadTranslations(lang: LangCode): Promise<TranslationDict> {
  if (translationCache[lang]) return translationCache[lang]!;
  try {
    const mod = await import(`../../messages/${lang}.json`);
    const flat = flattenObject(mod.default ?? mod);
    translationCache[lang] = flat;
    return flat;
  } catch {
    // Fall back to English
    if (lang !== "en") return loadTranslations("en");
    return {};
  }
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): TranslationDict {
  return Object.keys(obj).reduce<TranslationDict>((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key] as Record<string, unknown>, fullKey));
    } else {
      acc[fullKey] = String(obj[key]);
    }
    return acc;
  }, {});
}

// ─── Context ────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  /** Translate a dot-notation key. Falls back to key itself. */
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key, fb) => fb ?? key,
  isLoading: false,
});

const STORAGE_KEY = "ip_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const [dict, setDict] = useState<TranslationDict>({});
  const [isLoading, setIsLoading] = useState(false);

  // On mount: restore saved preference
  useEffect(() => {
    const saved = (typeof localStorage !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null) as LangCode | null;
    const initial: LangCode =
      saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)
        ? (saved as LangCode)
        : "en";
    if (initial !== "en") {
      applyLang(initial);
    } else {
      loadTranslations("en").then(setDict);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyLang = useCallback(async (code: LangCode) => {
    setIsLoading(true);
    const translations = await loadTranslations(code);
    setDict(translations);
    setLangState(code);
    // Persist
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    // Update html lang attribute for accessibility + SEO crawlers
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
    }
    setIsLoading(false);
  }, []);

  const setLang = useCallback((code: LangCode) => {
    if (code === lang) return;
    applyLang(code);
  }, [lang, applyLang]);

  const t = useCallback((key: string, fallback?: string): string => {
    return dict[key] ?? fallback ?? key;
  }, [dict]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand hook — just the t() function */
export function useT() {
  return useContext(LanguageContext).t;
}
