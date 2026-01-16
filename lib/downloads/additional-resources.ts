/**
 * Additional Downloadable Resources
 * More guides, templates, and resources to add
 */

export interface AdditionalResource {
    title: string;
    description: string;
    type: 'dashboard' | 'guide' | 'ebook' | 'pdf' | 'template';
    format: 'excel' | 'google-sheets' | 'notion' | 'pdf' | 'csv';
    category: string;
    slug: string;
    tags: string[];
    requiresEmail: boolean;
}

export const ADDITIONAL_RESOURCES: AdditionalResource[] = [
    // Credit Card Resources
    {
        title: 'Credit Card Comparison Matrix',
        description: 'Compare multiple credit cards side-by-side with rewards, fees, and benefits',
        type: 'dashboard',
        format: 'excel',
        category: 'credit-cards',
        slug: 'credit-card-comparison-matrix',
        tags: ['credit-cards', 'comparison', 'rewards'],
        requiresEmail: true
    },
    {
        title: 'Credit Card Rewards Calculator',
        description: 'Calculate how much you can earn in rewards based on your spending patterns',
        type: 'template',
        format: 'excel',
        category: 'credit-cards',
        slug: 'credit-card-rewards-calculator',
        tags: ['credit-cards', 'calculator', 'rewards'],
        requiresEmail: true
    },
    
    // Mutual Fund Resources
    {
        title: 'SIP vs Lump Sum Calculator',
        description: 'Compare SIP and lump sum investments to see which works better for you',
        type: 'template',
        format: 'excel',
        category: 'mutual-funds',
        slug: 'sip-vs-lump-sum-calculator',
        tags: ['mutual-funds', 'sip', 'calculator'],
        requiresEmail: true
    },
    {
        title: 'Mutual Fund Portfolio Tracker',
        description: 'Track all your mutual fund investments, SIPs, and returns in one place',
        type: 'dashboard',
        format: 'excel',
        category: 'mutual-funds',
        slug: 'mutual-fund-portfolio-tracker',
        tags: ['mutual-funds', 'portfolio', 'tracking'],
        requiresEmail: true
    },
    
    // Loan Resources
    {
        title: 'Home Loan EMI Calculator & Tracker',
        description: 'Calculate EMI, track payments, and see how prepayments affect your loan',
        type: 'template',
        format: 'excel',
        category: 'loans',
        slug: 'home-loan-emi-calculator',
        tags: ['loans', 'home-loan', 'emi', 'calculator'],
        requiresEmail: true
    },
    {
        title: 'Personal Loan Comparison Sheet',
        description: 'Compare personal loan offers from multiple banks with interest rates and fees',
        type: 'dashboard',
        format: 'excel',
        category: 'loans',
        slug: 'personal-loan-comparison',
        tags: ['loans', 'personal-loan', 'comparison'],
        requiresEmail: true
    },
    
    // Tax Resources
    {
        title: 'Income Tax Calculator 2026',
        description: 'Calculate your income tax liability with all deductions and exemptions',
        type: 'template',
        format: 'excel',
        category: 'tax',
        slug: 'income-tax-calculator-2026',
        tags: ['tax', 'calculator', '2026', 'income-tax'],
        requiresEmail: true
    },
    {
        title: 'Section 80C Investment Planner',
        description: 'Plan your Section 80C investments to maximize tax savings',
        type: 'dashboard',
        format: 'excel',
        category: 'tax',
        slug: 'section-80c-planner',
        tags: ['tax', '80C', 'planning'],
        requiresEmail: true
    },
    
    // Guides & eBooks
    {
        title: 'Complete Guide to SIP Investment',
        description: 'Everything you need to know about Systematic Investment Plans (SIPs)',
        type: 'guide',
        format: 'pdf',
        category: 'mutual-funds',
        slug: 'sip-investment-guide',
        tags: ['mutual-funds', 'sip', 'guide', 'investing'],
        requiresEmail: true
    },
    {
        title: 'Credit Card Rewards Optimization Guide',
        description: 'Learn how to maximize credit card rewards and cashback',
        type: 'guide',
        format: 'pdf',
        category: 'credit-cards',
        slug: 'credit-card-rewards-guide',
        tags: ['credit-cards', 'rewards', 'optimization'],
        requiresEmail: true
    },
    {
        title: 'Emergency Fund Calculator',
        description: 'Calculate how much emergency fund you need based on your expenses',
        type: 'template',
        format: 'excel',
        category: 'budget',
        slug: 'emergency-fund-calculator',
        tags: ['budget', 'emergency-fund', 'calculator'],
        requiresEmail: true
    },
    {
        title: 'Retirement Planning Calculator',
        description: 'Calculate how much you need to save for retirement',
        type: 'template',
        format: 'excel',
        category: 'retirement',
        slug: 'retirement-planning-calculator',
        tags: ['retirement', 'planning', 'calculator'],
        requiresEmail: true
    }
];

/**
 * Get SQL INSERT statements for additional resources
 */
export function getAdditionalResourcesSQL(): string {
    return ADDITIONAL_RESOURCES.map(resource => {
        const values = [
            `'${resource.title.replace(/'/g, "''")}'`,
            `'${resource.description.replace(/'/g, "''")}'`,
            `'${resource.type}'`,
            `'${resource.format}'`,
            `'${resource.category}'`,
            `'${resource.slug}'`,
            `ARRAY[${resource.tags.map(t => `'${t}'`).join(', ')}]`,
            resource.requiresEmail ? 'true' : 'false'
        ].join(', ');
        
        return `INSERT INTO downloadable_resources (title, description, type, format, category, slug, tags, requires_email) VALUES (${values});`;
    }).join('\n');
}
