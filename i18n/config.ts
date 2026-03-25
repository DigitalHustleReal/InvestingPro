/**
 * i18n Configuration
 * Multi-language support for InvestingPro
 * Language is controlled via the LanguageSwitcher — no URL routing.
 */

export const locales = ['en','hi','te','ta','kn','ml','mr','bn','gu'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  mr: 'मराठी',
  bn: 'বাংলা',
  gu: 'ગુજરાતી',
};

export const localeMetadata: Record<Locale, { name: string; nativeName: string; direction: 'ltr' | 'rtl'; region: string }> = {
  en: { name: 'English',   nativeName: 'English',   direction: 'ltr', region: 'All India' },
  hi: { name: 'Hindi',     nativeName: 'हिंदी',      direction: 'ltr', region: 'North India' },
  te: { name: 'Telugu',    nativeName: 'తెలుగు',     direction: 'ltr', region: 'Andhra Pradesh, Telangana' },
  ta: { name: 'Tamil',     nativeName: 'தமிழ்',      direction: 'ltr', region: 'Tamil Nadu' },
  kn: { name: 'Kannada',   nativeName: 'ಕನ್ನಡ',      direction: 'ltr', region: 'Karnataka' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം',     direction: 'ltr', region: 'Kerala' },
  mr: { name: 'Marathi',   nativeName: 'मराठी',      direction: 'ltr', region: 'Maharashtra' },
  bn: { name: 'Bengali',   nativeName: 'বাংলা',      direction: 'ltr', region: 'West Bengal' },
  gu: { name: 'Gujarati',  nativeName: 'ગુજરાતી',    direction: 'ltr', region: 'Gujarat' },
};
