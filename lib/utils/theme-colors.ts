/**
 * Theme Color Utilities
 * 
 * Provides utility functions to get theme colors consistently across the platform.
 * Replaces hardcoded hex colors with theme-aware functions.
 */

import { BRAND_COLORS, SEMANTIC_COLORS } from '@/lib/theme/brand-theme';

export type ThemeColorName = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'warning' | 'info';
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Get theme color hex value by name and shade
 */
export function getThemeColor(
    color: ThemeColorName,
    shade: ColorShade = 500
): string {
    if (color === 'primary' || color === 'secondary' || color === 'accent') {
        return BRAND_COLORS[color][shade];
    }
    
    // Semantic colors
    const hasShade = (obj: any, s: number) => Object.prototype.hasOwnProperty.call(obj, s);

    if (color === 'success') {
        return hasShade(SEMANTIC_COLORS.success, shade) ? (SEMANTIC_COLORS.success as any)[shade] : SEMANTIC_COLORS.success[500];
    }
    if (color === 'danger') {
        return hasShade(SEMANTIC_COLORS.danger, shade) ? (SEMANTIC_COLORS.danger as any)[shade] : SEMANTIC_COLORS.danger[500];
    }
    if (color === 'warning') {
        return hasShade(SEMANTIC_COLORS.warning, shade) ? (SEMANTIC_COLORS.warning as any)[shade] : SEMANTIC_COLORS.warning[500];
    }
    if (color === 'info') {
        return hasShade(SEMANTIC_COLORS.info, shade) ? (SEMANTIC_COLORS.info as any)[shade] : SEMANTIC_COLORS.info[500];
    }
    
    // Fallback to primary
    return BRAND_COLORS.primary[shade];
}

/**
 * Get Tailwind class for theme color
 */
export function getThemeClass(
    color: ThemeColorName,
    type: 'bg' | 'text' | 'border' | 'ring' | 'shadow',
    shade: ColorShade = 500
): string {
    return `${type}-${color}-${shade}`;
}

/**
 * Get RGB values for theme color (for use in CSS/JS)
 */
export function getThemeColorRGB(
    color: ThemeColorName,
    shade: ColorShade = 500
): { r: number; g: number; b: number } {
    const hex = getThemeColor(color, shade).replace('#', '');
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
    };
}

/**
 * Get RGBA string for theme color
 */
export function getThemeColorRGBA(
    color: ThemeColorName,
    shade: ColorShade = 500,
    opacity: number = 1
): string {
    const rgb = getThemeColorRGB(color, shade);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Social media brand colors
 * These are external brand colors, acceptable to keep as constants
 */
export const SOCIAL_COLORS = {
    twitter: '#1DA1F2',      // Twitter blue
    twitterHover: '#1a8cd8', // Twitter blue hover
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    whatsapp: '#25D366',
    instagram: '#E4405F',
} as const;

/**
 * Get social media color
 */
export function getSocialColor(platform: keyof typeof SOCIAL_COLORS): string {
    return SOCIAL_COLORS[platform];
}

/**
 * Neutral colors (for borders, backgrounds, etc.)
 */
export const NEUTRAL_COLORS = {
    slate: BRAND_COLORS.neutral,
    stone: {
        50: '#FAFAF9',
        100: '#F5F5F4',
        200: '#E7E5E4',
        300: '#D6D3D1',
        400: '#A8A29E',
        500: '#78716C',
        600: '#57534E',
        700: '#44403C',
        800: '#292524',
        900: '#1C1917',
    },
} as const;

/**
 * Get neutral color
 */
export function getNeutralColor(
    palette: 'slate' | 'stone' = 'slate',
    shade: ColorShade = 500
): string {
    const colors = NEUTRAL_COLORS[palette];
    const hasShade = (obj: any, s: number) => Object.prototype.hasOwnProperty.call(obj, s);
    return hasShade(colors, shade) ? (colors as any)[shade] : colors[500];
}
