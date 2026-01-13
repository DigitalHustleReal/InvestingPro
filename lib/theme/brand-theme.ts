/**
 * InvestingPro Brand Theme System
 * 
 * Unified 3-Tier Color Architecture for India's Largest Personal Finance Platform
 * 
 * TIER 1: Primary Brand (90% of UI) - Instant Recognition
 * TIER 2: Semantic Status (Contextual) - Gains, Warnings, Errors
 * TIER 3: Category Accents (Subtle, <10%) - Navigation Aids
 * 
 * Design Philosophy:
 * - One dominant brand color (Teal) for instant recognition
 * - Psychologically appropriate colors for Indian audience
 * - Subtle category differentiation, not full-page takeovers
 * - Consistent experience across all pages
 */

export type BrandMode = 'light' | 'dark';

// =============================================================================
// TIER 1: PRIMARY BRAND PALETTE (90% of UI)
// =============================================================================

/**
 * Core brand colors - Use these for 90% of the interface
 * These create instant brand recognition like PhonePe (Purple) or Zerodha (Blue)
 */
export const BRAND_COLORS = {
  // Primary: Trust Teal - Our signature color
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',  // ← Main brand color
    600: '#0D9488',
    700: '#0F766E',  // ← Strong variant
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },
  
  // Secondary: Sky Blue - Information, Trust, Technology
  secondary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',  // ← Info color
    600: '#0284C7',
    700: '#0369A1',  // ← Strong variant
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },
  
  // Accent: Amber Gold - CTAs, Highlights, Attention
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // ← Accent color
    600: '#D97706',  // ← Strong variant
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },
  
  // Neutral: Slate - Text, Backgrounds, Borders
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',  // ← Dark text/bg
    950: '#020617',
  },
} as const;

// =============================================================================
// TIER 2: SEMANTIC STATUS COLORS (Contextual Only)
// =============================================================================

/**
 * Semantic colors for status indication
 * Use ONLY for gains/losses, success/error states - NOT for categories
 */
export const SEMANTIC_COLORS = {
  // Success: Emerald Green - Gains, Approvals, Positive
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // ← Positive states
    600: '#059669',
    700: '#047857',
  },
  
  // Warning: Amber - Attention, Caution (shares with accent)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  
  // Danger: Red - Losses, Errors, Destructive Actions
  // Note: NEVER use for category theming (psychologically negative in India)
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    400: '#F87171',
    500: '#EF4444',  // ← Negative states
    600: '#DC2626',
    700: '#B91C1C',
  },
  
  // Info: Sky Blue - Informational, Tips
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
  },
} as const;

// =============================================================================
// TIER 3: CATEGORY ACCENTS (Subtle, <10% of UI)
// =============================================================================

export interface CategoryAccent {
  key: string;
  name: string;
  description: string;
  accent: string;           // Single accent color
  accentLight: string;      // Light variant for backgrounds
  accentDark: string;       // Dark variant for text
  gradient: [string, string]; // Gradient pair
  psychology: string;       // Why this color
  usage: string[];          // Where to use
}

/**
 * Simplified Category Accents
 * 
 * Reduced from 8 to 5 distinct categories:
 * - Merged Insurance + Credit Cards → "Protection & Cards"
 * - Merged Tax + Retirement → "Planning"
 * - Changed Stocks from Red → Green (positive psychology)
 * - Changed Loans from Purple → Deep Teal (accessible, not luxury)
 */
export const CATEGORY_ACCENTS: Record<string, CategoryAccent> = {
  // INVESTING: Mutual Funds, Stocks, SIP, Lumpsum
  'investing': {
    key: 'investing',
    name: 'Growth Green',
    description: 'Wealth creation, growth, prosperity',
    accent: '#10B981',      // Emerald 500
    accentLight: '#D1FAE5', // Emerald 100
    accentDark: '#047857',  // Emerald 700
    gradient: ['#10B981', '#14B8A6'],
    psychology: 'Green = Growth, Money, Prosperity in Indian culture. Auspicious.',
    usage: ['Hero accent dots', 'Growth indicators', 'SIP/MF badges', 'Stock gain highlights']
  },
  
  // PROTECTION: Insurance, Credit Cards, Banking
  'protection': {
    key: 'protection',
    name: 'Trust Blue',
    description: 'Security, reliability, protection',
    accent: '#0EA5E9',      // Sky 500
    accentLight: '#E0F2FE', // Sky 100
    accentDark: '#0369A1',  // Sky 700
    gradient: ['#0EA5E9', '#14B8A6'],
    psychology: 'Blue = Trust, Security, Stability. Banks use blue for a reason.',
    usage: ['Insurance shields', 'Credit card highlights', 'Security badges', 'Trust indicators']
  },
  
  // BORROWING: Loans, EMI, Home Loans, Personal Loans
  'borrowing': {
    key: 'borrowing',
    name: 'Reliable Teal',
    description: 'Accessibility, support, reliability',
    accent: '#0D9488',      // Teal 600 (deeper, mature)
    accentLight: '#CCFBF1', // Teal 100
    accentDark: '#115E59',  // Teal 800
    gradient: ['#0D9488', '#0369A1'],
    psychology: 'Deep Teal = Mature, Reliable, Accessible. Not luxury purple which alienates middle-class.',
    usage: ['Loan approval badges', 'EMI highlights', 'Rate indicators', 'Eligibility markers']
  },
  
  // PLANNING: Tax, Retirement, Goals, NPS, PPF
  'planning': {
    key: 'planning',
    name: 'Warm Amber',
    description: 'Foresight, preparation, golden future',
    accent: '#F59E0B',      // Amber 500
    accentLight: '#FEF3C7', // Amber 100
    accentDark: '#B45309',  // Amber 700
    gradient: ['#F59E0B', '#14B8A6'],
    psychology: 'Amber/Gold = Wisdom, Future, Prosperity. Culturally positive for retirement/planning.',
    usage: ['Tax savings highlights', 'Retirement timeline', 'Goal progress', 'Planning badges']
  },
  
  // EDUCATION: Investing Basics, Guides, Glossary, How-To
  'education': {
    key: 'education',
    name: 'Fresh Teal',
    description: 'Learning, foundation, empowerment',
    accent: '#14B8A6',      // Primary Teal (brand consistency)
    accentLight: '#CCFBF1', // Teal 100
    accentDark: '#0F766E',  // Teal 700
    gradient: ['#14B8A6', '#0EA5E9'],
    psychology: 'Brand Teal = Consistency, Foundation. Education is core to brand identity.',
    usage: ['Learning badges', 'Guide highlights', 'Glossary markers', 'Tutorial progress']
  },
  
  // DEFAULT: Fallback for unspecified categories
  'default': {
    key: 'default',
    name: 'Brand Primary',
    description: 'Default brand experience',
    accent: '#14B8A6',
    accentLight: '#CCFBF1',
    accentDark: '#0F766E',
    gradient: ['#14B8A6', '#0EA5E9'],
    psychology: 'Consistent brand experience when no specific category applies.',
    usage: ['General pages', 'Home page', 'Search results', 'Misc content']
  }
} as const;

/**
 * Category URL slug to accent mapping
 * Maps all possible category slugs to the simplified 5-category system
 */
export const CATEGORY_MAPPING: Record<string, keyof typeof CATEGORY_ACCENTS> = {
  // Investing category
  'mutual-funds': 'investing',
  'stocks': 'investing',
  'sip': 'investing',
  'lumpsum': 'investing',
  'equity': 'investing',
  'demat-accounts': 'investing',
  'ipo': 'investing',
  
  // Protection category
  'insurance': 'protection',
  'credit-cards': 'protection',
  'banking': 'protection',
  'fixed-deposits': 'protection',
  'savings': 'protection',
  
  // Borrowing category
  'loans': 'borrowing',
  'home-loans': 'borrowing',
  'personal-loans': 'borrowing',
  'car-loans': 'borrowing',
  'education-loans': 'borrowing',
  'emi': 'borrowing',
  
  // Planning category
  'tax-planning': 'planning',
  'taxes': 'planning',
  'retirement': 'planning',
  'ppf-nps': 'planning',
  'goals': 'planning',
  'financial-planning': 'planning',
  
  // Education category
  'investing-basics': 'education',
  'guides': 'education',
  'glossary': 'education',
  'learn': 'education',
  'tutorials': 'education',
  'calculators': 'education',
};

// =============================================================================
// THEME PALETTE INTERFACE
// =============================================================================

export interface ThemePalette {
  // Tier 1: Primary Brand
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  secondary: string;
  secondaryStrong: string;
  accent: string;
  accentStrong: string;
  
  // Neutrals
  neutral: string;
  neutralMuted: string;
  
  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  
  // Text
  text: string;
  textMuted: string;
  textInverse: string;
  
  // Borders
  border: string;
  borderStrong: string;
  
  // Category (if applicable)
  categoryAccent: string;
  categoryAccentLight: string;
  categoryAccentDark: string;
  
  // Gradients
  gradients: {
    brand: [string, string];
    hero: [string, string];
    subtle: [string, string];
    category: [string, string];
  };
  
  // Overlays
  overlay: {
    dark: string;
    medium: string;
    light: string;
  };
}

// =============================================================================
// MODE-SPECIFIC TOKENS
// =============================================================================

const lightModeTokens = {
  background: BRAND_COLORS.neutral[50],    // #F8FAFC
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: BRAND_COLORS.neutral[900],         // #0F172A
  textMuted: BRAND_COLORS.neutral[600],    // #475569
  textInverse: '#FFFFFF',
  border: BRAND_COLORS.neutral[200],       // #E2E8F0
  borderStrong: BRAND_COLORS.neutral[300], // #CBD5E1
};

const darkModeTokens = {
  background: '#0B1220',                    // Deep navy
  surface: BRAND_COLORS.neutral[900],      // #0F172A
  surfaceElevated: BRAND_COLORS.neutral[800], // #1E293B
  text: BRAND_COLORS.neutral[100],         // #F1F5F9
  textMuted: BRAND_COLORS.neutral[400],    // #94A3B8
  textInverse: BRAND_COLORS.neutral[900],  // #0F172A
  border: BRAND_COLORS.neutral[800],       // #1E293B
  borderStrong: BRAND_COLORS.neutral[700], // #334155
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the category accent for a given category slug
 * Maps URL slugs to simplified category system
 */
export function getCategoryAccent(categorySlug?: string): CategoryAccent {
  if (!categorySlug) return CATEGORY_ACCENTS.default;
  
  const mappedCategory = CATEGORY_MAPPING[categorySlug];
  if (mappedCategory) {
    return CATEGORY_ACCENTS[mappedCategory];
  }
  
  // Direct match fallback
  if (CATEGORY_ACCENTS[categorySlug]) {
    return CATEGORY_ACCENTS[categorySlug];
  }
  
  return CATEGORY_ACCENTS.default;
}

/**
 * Get complete theme palette for a mode and optional category
 */
export function getThemePalette(mode: BrandMode = 'light', categorySlug?: string): ThemePalette {
  const modeTokens = mode === 'light' ? lightModeTokens : darkModeTokens;
  const category = getCategoryAccent(categorySlug);
  
  return {
    // Tier 1: Primary Brand
    primary: BRAND_COLORS.primary[500],
    primaryStrong: BRAND_COLORS.primary[700],
    primarySoft: BRAND_COLORS.primary[300],
    secondary: BRAND_COLORS.secondary[500],
    secondaryStrong: BRAND_COLORS.secondary[700],
    accent: BRAND_COLORS.accent[500],
    accentStrong: BRAND_COLORS.accent[600],
    
    // Neutrals
    neutral: BRAND_COLORS.neutral[900],
    neutralMuted: BRAND_COLORS.neutral[600],
    
    // Surfaces
    ...modeTokens,
    
    // Category Accent
    categoryAccent: category.accent,
    categoryAccentLight: category.accentLight,
    categoryAccentDark: category.accentDark,
    
    // Gradients
    gradients: {
      brand: [BRAND_COLORS.primary[700], BRAND_COLORS.secondary[500]],
      hero: [BRAND_COLORS.primary[500], BRAND_COLORS.secondary[700]],
      subtle: [BRAND_COLORS.primary[50], BRAND_COLORS.secondary[50]],
      category: category.gradient,
    },
    
    // Overlays
    overlay: {
      dark: 'rgba(15, 23, 42, 0.75)',
      medium: 'rgba(15, 23, 42, 0.50)',
      light: 'rgba(15, 23, 42, 0.25)',
    },
  };
}

/**
 * Get brand color set for image generation and media
 */
export function getBrandColorSet(mode: BrandMode = 'light', categorySlug?: string) {
  const palette = getThemePalette(mode, categorySlug);
  const category = getCategoryAccent(categorySlug);
  
  return {
    // Primary brand colors (use for 90% of media)
    brand: [
      palette.primary,
      palette.primaryStrong,
      palette.secondary,
      palette.accent,
    ],
    
    // Category accent (use sparingly, <10%)
    category: {
      ...category,
      useSubtly: true, // Reminder: category accents are subtle additions
    },
    
    // Backgrounds
    background: palette.background,
    surface: palette.surface,
    
    // Recommended gradient
    gradient: palette.gradients.brand,
    
    // Overlay for text on images
    overlay: palette.overlay.dark,
  };
}

/**
 * CSS custom properties for runtime theming
 */
export function getThemeCSSVariables(mode: BrandMode = 'light', categorySlug?: string): Record<string, string> {
  const palette = getThemePalette(mode, categorySlug);
  
  return {
    '--color-primary': palette.primary,
    '--color-primary-strong': palette.primaryStrong,
    '--color-primary-soft': palette.primarySoft,
    '--color-secondary': palette.secondary,
    '--color-accent': palette.accent,
    '--color-background': palette.background,
    '--color-surface': palette.surface,
    '--color-text': palette.text,
    '--color-text-muted': palette.textMuted,
    '--color-border': palette.border,
    '--color-category-accent': palette.categoryAccent,
    '--color-category-accent-light': palette.categoryAccentLight,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  BRAND_COLORS,
  SEMANTIC_COLORS,
  CATEGORY_ACCENTS,
  CATEGORY_MAPPING,
  getCategoryAccent,
  getThemePalette,
  getBrandColorSet,
  getThemeCSSVariables,
};
