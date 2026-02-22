
/**
 * Golden Keyword Repository
 * 
 * Centralized dictionary of high-value keywords and their target URLs for internal linking.
 * 
 * Strategy:
 * - High Priority (100): Core commercial pages (Calculators, Best X)
 * - Medium Priority (50): Pillar pages and key guides
 * - Low Priority (10): Informational articles
 */

export interface GoldenKeyword {
    keyword: string;
    url: string;
    priority: number;
    category: 'calculator' | 'commercial' | 'informational';
    variants?: string[]; // Optional synonyms
}

export const GOLDEN_KEYWORDS: GoldenKeyword[] = [
    // --- Calculators (Highest Priority) ---
    { 
        keyword: 'SIP Calculator', 
        url: '/calculators/sip', 
        priority: 100, 
        category: 'calculator',
        variants: ['SIP return calculator', 'calculate SIP returns'] 
    },
    { 
        keyword: 'FD Calculator', 
        url: '/calculators/fd', 
        priority: 95, 
        category: 'calculator',
        variants: ['fixed deposit calculator', 'FD interest calculator']
    },
    { 
        keyword: 'EMI Calculator', 
        url: '/calculators/emi', 
        priority: 95, 
        category: 'calculator',
        variants: ['home loan calculator', 'loan emi calculator']
    },
    { 
        keyword: 'PPF Calculator', 
        url: '/calculators/ppf', 
        priority: 90, 
        category: 'calculator',
        variants: ['public provident fund calculator']
    },

    // --- Core Commercial Pages ---
    { 
        keyword: 'Best Credit Cards', 
        url: '/credit-cards', 
        priority: 90, 
        category: 'commercial',
        variants: ['top credit cards', 'apply for credit card']
    },
    { 
        keyword: 'Best Personal Loans', 
        url: '/loans/personal', 
        priority: 90, 
        category: 'commercial',
        variants: ['apply for personal loan', 'instant personal loan']
    },
    {
        keyword: 'Best Mutual Funds',
        url: '/mutual-funds',
        priority: 85,
        category: 'commercial',
        variants: ['top mutual funds', 'mutual fund schemes']
    },

    // --- Pillar Content ---
    {
        keyword: 'Income Tax Slabs',
        url: '/tax/income-tax-slabs-2025',
        priority: 60,
        category: 'informational',
        variants: ['tax slabs', 'income tax rates']
    },
    {
        keyword: 'Credit Score',
        url: '/credit-score/guide',
        priority: 50,
        category: 'informational',
        variants: ['cibil score', 'credit rating']
    }
];

export function getGoldenLink(text: string): GoldenKeyword | undefined {
    const lowerText = text.toLowerCase();
    return GOLDEN_KEYWORDS.find(k => 
        k.keyword.toLowerCase() === lowerText || 
        k.variants?.some(v => v.toLowerCase() === lowerText)
    );
}
