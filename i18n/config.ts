/**
 * i18n Configuration
 * Multi-language support for InvestingPro
 */

export const locales = ['en', 'hi'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
    en: 'English',
    hi: 'हिंदी',
};

export const localeMetadata = {
    en: {
        name: 'English',
        nativeName: 'English',
        direction: 'ltr' as const,
    },
    hi: {
        name: 'Hindi',
        nativeName: 'हिंदी',
        direction: 'ltr' as const,
    },
};

