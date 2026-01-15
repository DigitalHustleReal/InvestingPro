/**
 * Chart Color Utilities
 * 
 * Standardized color palette for charts and data visualizations.
 * Ensures consistent colors across all charts and graphs.
 */

import { BRAND_COLORS, SEMANTIC_COLORS } from '@/lib/theme/brand-theme';
import { getThemeColor } from './theme-colors';

/**
 * Standard chart color palette
 * Use these for all charts and data visualizations
 */
export const CHART_COLORS = {
    // Brand colors
    primary: BRAND_COLORS.primary[500],      // #14b8a6 - Teal
    primaryLight: BRAND_COLORS.primary[400], // #2dd4bf
    primaryDark: BRAND_COLORS.primary[600],  // #0d9488
    
    secondary: BRAND_COLORS.secondary[500],  // #0ea5e9 - Sky Blue
    secondaryLight: BRAND_COLORS.secondary[400], // #38bdf8
    secondaryDark: BRAND_COLORS.secondary[600],  // #0284c7
    
    accent: BRAND_COLORS.accent[500],        // #f59e0b - Amber
    accentLight: BRAND_COLORS.accent[400],   // #fbbf24
    accentDark: BRAND_COLORS.accent[600],    // #d97706
    
    // Semantic colors
    success: SEMANTIC_COLORS.success[500],   // #10b981 - Emerald
    successLight: SEMANTIC_COLORS.success[400], // #34d399
    successDark: SEMANTIC_COLORS.success[600],  // #059669
    
    danger: SEMANTIC_COLORS.danger[500],      // #ef4444 - Red
    dangerLight: SEMANTIC_COLORS.danger[400], // #f87171
    dangerDark: SEMANTIC_COLORS.danger[600],  // #dc2626
    
    warning: SEMANTIC_COLORS.warning[500],    // #f59e0b - Amber (same as accent)
    warningLight: SEMANTIC_COLORS.warning[400],
    warningDark: SEMANTIC_COLORS.warning[600],
    
    info: SEMANTIC_COLORS.info[500],         // #0ea5e9 - Sky Blue (same as secondary)
    infoLight: SEMANTIC_COLORS.info[400],
    infoDark: SEMANTIC_COLORS.info[600],
    
    // Neutral colors
    neutral: BRAND_COLORS.neutral[400],      // #94a3b8 - Slate
    neutralLight: BRAND_COLORS.neutral[300], // #cbd5e1
    neutralDark: BRAND_COLORS.neutral[600],  // #475569
} as const;

/**
 * Get chart color for asset category
 * Maps asset categories to appropriate theme colors
 */
export function getAssetColor(category: string): string {
    const categoryLower = category.toLowerCase();
    
    const colorMap: Record<string, string> = {
        // Equity - Use secondary (blue) for growth/investment
        'equity': CHART_COLORS.secondary,
        'equities': CHART_COLORS.secondary,
        'stocks': CHART_COLORS.secondary,
        'stock': CHART_COLORS.secondary,
        
        // Debt - Use success (green) for stable/secure
        'debt': CHART_COLORS.success,
        'bonds': CHART_COLORS.success,
        'bond': CHART_COLORS.success,
        'fixed income': CHART_COLORS.success,
        
        // Hybrid - Use primary (teal) for balanced
        'hybrid': CHART_COLORS.primary,
        'balanced': CHART_COLORS.primary,
        'flexi-cap': CHART_COLORS.primary,
        
        // Gold - Use accent (amber) for precious metals
        'gold': CHART_COLORS.accent,
        'precious metals': CHART_COLORS.accent,
        'silver': CHART_COLORS.accent,
        
        // International - Use secondary light for global
        'international': CHART_COLORS.secondaryLight,
        'global': CHART_COLORS.secondaryLight,
        'us equity': CHART_COLORS.secondaryLight,
        
        // Cash - Use neutral for liquidity
        'cash': CHART_COLORS.neutral,
        'liquid': CHART_COLORS.neutral,
        'savings': CHART_COLORS.neutral,
    };
    
    return colorMap[categoryLower] || CHART_COLORS.neutral;
}

/**
 * Get chart color array for multiple data series
 * Returns a consistent color palette for charts with multiple series
 */
export function getChartColorPalette(count: number = 5): string[] {
    const baseColors = [
        CHART_COLORS.primary,
        CHART_COLORS.secondary,
        CHART_COLORS.success,
        CHART_COLORS.accent,
        CHART_COLORS.info,
    ];
    
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    }
    
    // For more than 5 colors, generate variations
    const colors: string[] = [...baseColors];
    const variations = [
        CHART_COLORS.primaryLight,
        CHART_COLORS.secondaryLight,
        CHART_COLORS.successLight,
        CHART_COLORS.accentLight,
        CHART_COLORS.primaryDark,
        CHART_COLORS.secondaryDark,
        CHART_COLORS.successDark,
        CHART_COLORS.accentDark,
    ];
    
    for (let i = 0; i < count - baseColors.length; i++) {
        colors.push(variations[i % variations.length]);
    }
    
    return colors;
}

/**
 * Get gradient colors for charts
 */
export function getChartGradient(
    color: 'primary' | 'secondary' | 'success' | 'accent' | 'info' = 'primary',
    opacity: { start: number; end: number } = { start: 0.3, end: 0 }
): { start: string; end: string } {
    const baseColor = getThemeColor(color, 500);
    const rgb = hexToRgb(baseColor);
    
    return {
        start: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.start})`,
        end: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.end})`,
    };
}

/**
 * Helper: Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
}

/**
 * Get color for financial metric (positive/negative)
 */
export function getMetricColor(value: number, type: 'positive' | 'negative' | 'neutral' = 'neutral'): string {
    if (type === 'positive' || value > 0) {
        return CHART_COLORS.success;
    }
    if (type === 'negative' || value < 0) {
        return CHART_COLORS.danger;
    }
    return CHART_COLORS.neutral;
}

/**
 * Get color for score/rating (0-100)
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return CHART_COLORS.success;
    if (score >= 60) return CHART_COLORS.primary;
    if (score >= 40) return CHART_COLORS.accent;
    return CHART_COLORS.danger;
}
