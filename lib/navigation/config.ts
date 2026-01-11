/**
 * Centralized Navigation Configuration
 * 
 * 3-Level Structure: Category → Intent → Collection
 * 
 * Intents are editorial (Best, Compare, Reviews, Calculators, Guides),
 * NOT product filters.
 * 
 * This structure is reusable for:
 * - Navbar dropdowns
 * - Breadcrumbs
 * - Internal linking
 * - SEO sitemap generation
 */

export interface Collection {
    name: string;
    slug: string;
    href: string;
    description?: string;
}

export interface Intent {
    name: string;
    slug: string;
    description?: string;
    collections: Collection[];
}

export interface NavigationCategory {
    name: string;
    slug: string;
    description: string;
    intents: Intent[];
}

/**
 * Standard Editorial Intents
 */
export const EDITORIAL_INTENTS = {
    BEST: 'best',
    COMPARE: 'compare',
    REVIEWS: 'reviews',
    CALCULATORS: 'calculators',
    GUIDES: 'guides',
} as const;

export type EditorialIntent = typeof EDITORIAL_INTENTS[keyof typeof EDITORIAL_INTENTS];

/**
 * Centralized Navigation Configuration
 */
export const NAVIGATION_CONFIG: NavigationCategory[] = [
    {
        name: 'Credit Cards',
        slug: 'credit-cards',
        description: 'Compare credit cards with rewards, cashback, and travel benefits from top Indian banks.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top-rated credit cards',
                collections: [
                    { name: 'Best Credit Cards', slug: 'all', href: '/credit-cards' },
                    { name: 'Best Rewards Cards', slug: 'rewards', href: '/credit-cards?filter=rewards' },
                    { name: 'Best Cashback Cards', slug: 'cashback', href: '/credit-cards?filter=cashback' },
                    { name: 'Best Travel Cards', slug: 'travel', href: '/credit-cards?filter=travel' },
                    { name: 'Best Fuel Cards', slug: 'fuel', href: '/credit-cards?filter=fuel' },
                    { name: 'Best Shopping Cards', slug: 'shopping', href: '/credit-cards?filter=shopping' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Side-by-side comparisons',
                collections: [
                    { name: 'Compare Credit Cards', slug: 'all', href: '/credit-cards/compare' },
                    { name: 'Rewards vs Cashback', slug: 'rewards-vs-cashback', href: '/credit-cards/compare/rewards-vs-cashback' },
                    { name: 'Travel Cards Comparison', slug: 'travel', href: '/credit-cards/compare/travel' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Expert credit card reviews',
                collections: [
                    { name: 'Credit Card Reviews', slug: 'all', href: '/credit-cards/reviews' },
                    { name: 'Expert Reviews', slug: 'expert', href: '/credit-cards/reviews/expert' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Credit card calculators',
                collections: [
                    { name: 'Rewards Calculator', slug: 'rewards', href: '/calculators?type=rewards' },
                    { name: 'Eligibility Calculator', slug: 'eligibility', href: '/credit-cards/calculators/eligibility' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Credit card guides and tips',
                collections: [
                    { name: 'All Credit Card Articles', slug: 'all-articles', href: '/category/credit-cards' },
                    { name: 'How to Choose a Credit Card', slug: 'how-to-choose', href: '/credit-cards/guides/how-to-choose' },
                    { name: 'Credit Card Benefits Guide', slug: 'benefits', href: '/credit-cards/guides/benefits' },
                    { name: 'Credit Score Guide', slug: 'credit-score', href: '/credit-cards/guides/credit-score' },
                ],
            },
        ],
    },
    {
        name: 'Loans',
        slug: 'loans',
        description: 'Personal, home, car, education, gold, and business loans with lowest interest rates.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top-rated loan products',
                collections: [
                    { name: 'Best Personal Loans', slug: 'personal', href: '/loans?type=personal' },
                    { name: 'Best Home Loans', slug: 'home', href: '/loans?type=home' },
                    { name: 'Best Car Loans', slug: 'car', href: '/loans?type=car' },
                    { name: 'Best Education Loans', slug: 'education', href: '/loans?type=education' },
                    { name: 'Best Business Loans', slug: 'business', href: '/loans?type=business' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare loan products',
                collections: [
                    { name: 'Compare Loans', slug: 'all', href: '/loans/compare' },
                    { name: 'Personal Loan Rates', slug: 'personal-rates', href: '/loans/compare/personal-rates' },
                    { name: 'Home Loan Rates', slug: 'home-rates', href: '/loans/compare/home-rates' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Loan product reviews',
                collections: [
                    { name: 'Loan Reviews', slug: 'all', href: '/loans/reviews' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Loan calculators',
                collections: [
                    { name: 'EMI Calculator', slug: 'emi', href: '/calculators/emi' },
                    { name: 'Home Loan EMI', slug: 'home-emi', href: '/calculators/emi?type=home' },
                    { name: 'Personal Loan EMI', slug: 'personal-emi', href: '/calculators/emi?type=personal' },
                    { name: 'Loan Eligibility', slug: 'eligibility', href: '/loans/calculators/eligibility' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Loan guides and tips',
                collections: [
                    { name: 'All Loan Articles', slug: 'all-articles', href: '/category/loans' },
                    { name: 'Loan Eligibility Guide', slug: 'eligibility', href: '/loans/guides/eligibility' },
                    { name: 'Home Loan Guide', slug: 'home-loan', href: '/loans/guides/home-loan' },
                    { name: 'Compare Interest Rates', slug: 'interest-rates', href: '/loans/guides/interest-rates' },
                ],
            },
        ],
    },
    {
        name: 'Banking',
        slug: 'banking',
        description: 'Savings accounts, fixed deposits, recurring deposits with best interest rates.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top banking products',
                collections: [
                    { name: 'Best Savings Accounts', slug: 'savings', href: '/banking/best/savings' },
                    { name: 'Best Fixed Deposits', slug: 'fd', href: '/banking/best/fd' },
                    { name: 'Best Recurring Deposits', slug: 'rd', href: '/banking/best/rd' },
                    { name: 'Highest FD Rates', slug: 'fd-rates', href: '/banking/best/fd-rates' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare banking products',
                collections: [
                    { name: 'Compare Interest Rates', slug: 'rates', href: '/banking/compare/rates' },
                    { name: 'FD vs RD', slug: 'fd-vs-rd', href: '/banking/compare/fd-vs-rd' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Banking calculators',
                collections: [
                    { name: 'FD Calculator', slug: 'fd', href: '/calculators/fd' },
                    { name: 'RD Calculator', slug: 'rd', href: '/calculators?type=rd' },
                    { name: 'Savings Goal Calculator', slug: 'savings-goal', href: '/calculators/goal-planning' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Expert bank and account reviews',
                collections: [
                    { name: 'Bank Reviews', slug: 'all', href: '/banking/reviews' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Banking guides',
                collections: [
                    { name: 'FD Rates Guide', slug: 'fd-rates', href: '/banking/guides/fd-rates' },
                    { name: 'FD vs RD Comparison', slug: 'fd-vs-rd', href: '/banking/guides/fd-vs-rd' },
                    { name: 'Tax on FD Interest', slug: 'fd-tax', href: '/banking/guides/fd-tax' },
                    { name: 'Best Banks for FD', slug: 'best-banks', href: '/banking/guides/best-banks' },
                ],
            },
        ],
    },
    {
        name: 'Investing',
        slug: 'investing',
        description: 'Mutual funds, stocks, PPF/NPS, ELSS, gold, and demat accounts compared.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top investment products',
                collections: [
                    { name: 'Best Mutual Funds', slug: 'mutual-funds', href: '/mutual-funds' },
                    { name: 'Best Stock Brokers', slug: 'brokers', href: '/stocks' },
                    { name: 'Best Demat Accounts', slug: 'demat', href: '/demat-accounts' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare investments',
                collections: [
                    { name: 'Compare Mutual Funds', slug: 'mutual-funds', href: '/mutual-funds/compare' },
                    { name: 'Compare Brokers', slug: 'brokers', href: '/stocks' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Investment calculators',
                collections: [
                    { name: 'SIP Calculator', slug: 'sip', href: '/calculators/sip' },
                    { name: 'Lumpsum Calculator', slug: 'lumpsum', href: '/calculators/lumpsum' },
                    { name: 'Goal Planning', slug: 'goal-planning', href: '/calculators/goal-planning' },
                    { name: 'Retirement Calculator', slug: 'retirement', href: '/calculators/retirement' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Investment platform and fund reviews',
                collections: [
                    { name: 'Mutual Fund Reviews', slug: 'mutual-funds', href: '/mutual-funds/reviews' },
                    { name: 'Broker Reviews', slug: 'brokers', href: '/stocks/reviews' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Investment guides',
                collections: [
                    { name: 'All Investment Articles', slug: 'all-articles', href: '/category/investing-basics' },
                    { name: 'Mutual Funds Articles', slug: 'mutual-funds', href: '/category/mutual-funds' },
                    { name: 'Stocks Articles', slug: 'stocks', href: '/category/stocks' },
                    { name: 'SIP Guide', slug: 'sip', href: '/calculators/sip' },
                    { name: 'SIP vs Lumpsum', slug: 'sip-vs-lumpsum', href: '/investing/guides/sip-vs-lumpsum' },
                    { name: 'Tax Saving Funds', slug: 'tax-saving', href: '/mutual-funds?type=elss' },
                ],
            },
        ],
    },
    {
        name: 'Insurance',
        slug: 'insurance',
        description: 'Life, health, term, car, bike, and travel insurance from top insurers.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top insurance plans',
                collections: [
                    { name: 'Best Health Insurance', slug: 'health', href: '/insurance?type=health' },
                    { name: 'Best Term Insurance', slug: 'term', href: '/insurance?type=term' },
                    { name: 'Best Life Insurance', slug: 'life', href: '/insurance?type=life' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare insurance plans',
                collections: [
                    { name: 'Compare Plans', slug: 'all', href: '/insurance/compare' },
                    { name: 'Health Insurance Comparison', slug: 'health', href: '/insurance/compare/health' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Insurance plan reviews',
                collections: [
                    { name: 'Insurance Reviews', slug: 'all', href: '/insurance/reviews' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Insurance calculators',
                collections: [
                    { name: 'Premium Calculator', slug: 'premium', href: '/insurance/calculators/premium' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Insurance guides',
                collections: [
                    { name: 'All Insurance Articles', slug: 'all-articles', href: '/category/insurance' },
                    { name: 'Health Insurance Guide', slug: 'health', href: '/insurance/guides/health' },
                    { name: 'Term Insurance Basics', slug: 'term', href: '/insurance/guides/term' },
                    { name: 'Claim Settlement Guide', slug: 'claims', href: '/insurance/guides/claims' },
                ],
            },
        ],
    },
    {
        name: 'Small Business',
        slug: 'small-business',
        description: 'Business loans, credit cards, accounts, GST calculator, and services for small businesses.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top business products',
                collections: [
                    { name: 'Best Business Loans', slug: 'loans', href: '/loans/best/business' },
                    { name: 'Best Business Credit Cards', slug: 'credit-cards', href: '/credit-cards/best/business' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare business products',
                collections: [
                    { name: 'Compare Business Loans', slug: 'loans', href: '/loans/compare/business' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Business calculators',
                collections: [
                    { name: 'GST Calculator', slug: 'gst', href: '/calculators/gst' },
                    { name: 'Business Loan Calculator', slug: 'loan', href: '/calculators/emi?type=business' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Business service and tool reviews',
                collections: [
                    { name: 'Business Service Reviews', slug: 'all', href: '/small-business/reviews' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Business guides',
                collections: [
                    { name: 'GST Guide', slug: 'gst', href: '/calculators/gst' },
                    { name: 'Business Loan Guide', slug: 'loans', href: '/loans/guides/business' },
                ],
            },
        ],
    },
    {
        name: 'Taxes',
        slug: 'taxes',
        description: 'Income tax, GST, TDS, tax-saving investments, and ITR filing guides for Indian taxpayers.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top tax-saving options',
                collections: [
                    { name: 'Best Tax-Saving Investments', slug: 'investments', href: '/investing/best?type=tax-saving' },
                    { name: 'Best Tax Software', slug: 'software', href: '/taxes/best/software' },
                    { name: 'Best ELSS Funds', slug: 'elss', href: '/mutual-funds?type=elss' },
                    { name: 'Best Tax Consultants', slug: 'consultants', href: '/taxes/best/consultants' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare tax-saving options',
                collections: [
                    { name: 'Tax-Saving Options Comparison', slug: 'options', href: '/taxes/compare/options' },
                    { name: 'ELSS vs PPF vs NPS', slug: 'elss-vs-ppf-vs-nps', href: '/taxes/compare/elss-vs-ppf-vs-nps' },
                    { name: 'ITR Filing Platforms', slug: 'itr-platforms', href: '/taxes/compare/itr-platforms' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Tax calculators',
                collections: [
                    { name: 'Income Tax Calculator', slug: 'income-tax', href: '/calculators/tax' },
                    { name: 'GST Calculator', slug: 'gst', href: '/calculators/gst' },
                    { name: 'TDS Calculator', slug: 'tds', href: '/taxes/calculators/tds' },
                    { name: 'Tax-Saving Calculator', slug: 'tax-saving', href: '/taxes/calculators/tax-saving' },
                    { name: 'HRA Calculator', slug: 'hra', href: '/taxes/calculators/hra' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Tax tool and consultant reviews',
                collections: [
                    { name: 'Tax Tool Reviews', slug: 'all', href: '/taxes/reviews' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Tax guides and tips',
                collections: [
                    { name: 'All Tax Articles', slug: 'all-articles', href: '/category/tax-planning' },
                    { name: 'ITR Filing Guide', slug: 'itr-filing', href: '/taxes/guides/itr-filing' },
                    { name: 'Tax-Saving Investments Guide', slug: 'tax-saving-investments', href: '/taxes/guides/tax-saving-investments' },
                    { name: 'GST Guide', slug: 'gst', href: '/taxes/guides/gst' },
                    { name: 'Tax Planning Guide', slug: 'tax-planning', href: '/taxes/guides/tax-planning' },
                    { name: 'Section 80C Guide', slug: 'section-80c', href: '/taxes/guides/section-80c' },
                    { name: 'TDS Guide', slug: 'tds', href: '/taxes/guides/tds' },
                ],
            },
        ],
    },
    {
        name: 'Personal Finance',
        slug: 'personal-finance',
        description: 'Financial planning, budgeting, wealth management, debt management, and retirement planning guides.',
        intents: [
            {
                name: 'Best',
                slug: EDITORIAL_INTENTS.BEST,
                description: 'Top financial planning tools',
                collections: [
                    { name: 'Best Budgeting Apps', slug: 'budgeting-apps', href: '/personal-finance/best/budgeting-apps' },
                    { name: 'Best Financial Planning Tools', slug: 'planning-tools', href: '/personal-finance/best/planning-tools' },
                    { name: 'Best Wealth Management Services', slug: 'wealth-management', href: '/personal-finance/best/wealth-management' },
                ],
            },
            {
                name: 'Compare',
                slug: EDITORIAL_INTENTS.COMPARE,
                description: 'Compare financial planning approaches',
                collections: [
                    { name: 'Financial Planning Approaches', slug: 'approaches', href: '/personal-finance/compare/approaches' },
                    { name: 'Wealth Management Services', slug: 'wealth-services', href: '/personal-finance/compare/wealth-services' },
                    { name: 'Budgeting Methods', slug: 'budgeting-methods', href: '/personal-finance/compare/budgeting-methods' },
                ],
            },
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Personal finance calculators',
                collections: [
                    { name: 'Budget Calculator', slug: 'budget', href: '/personal-finance/calculators/budget' },
                    { name: 'Emergency Fund Calculator', slug: 'emergency-fund', href: '/personal-finance/calculators/emergency-fund' },
                    { name: 'Debt Payoff Calculator', slug: 'debt-payoff', href: '/personal-finance/calculators/debt-payoff' },
                    { name: 'Retirement Calculator', slug: 'retirement', href: '/calculators/retirement' },
                    { name: 'Goal Planning Calculator', slug: 'goal-planning', href: '/calculators/goal-planning' },
                ],
            },
            {
                name: 'Reviews',
                slug: EDITORIAL_INTENTS.REVIEWS,
                description: 'Personal finance app and tool reviews',
                collections: [
                    { name: 'App Reviews', slug: 'apps', href: '/personal-finance/reviews/apps' },
                ],
            },
            {
                name: 'Guides',
                slug: EDITORIAL_INTENTS.GUIDES,
                description: 'Personal finance guides',
                collections: [
                    { name: 'All Personal Finance Articles', slug: 'all-articles', href: '/articles' },
                    { name: 'Retirement Articles', slug: 'retirement', href: '/category/retirement' },
                    { name: 'Financial Planning Guide', slug: 'financial-planning', href: '/personal-finance/guides/financial-planning' },
                    { name: 'Budgeting Guide', slug: 'budgeting', href: '/personal-finance/guides/budgeting' },
                    { name: 'Debt Management Guide', slug: 'debt-management', href: '/personal-finance/guides/debt-management' },
                    { name: 'Emergency Fund Guide', slug: 'emergency-fund', href: '/personal-finance/guides/emergency-fund' },
                    { name: 'Retirement Planning Guide', slug: 'retirement-planning', href: '/personal-finance/guides/retirement-planning' },
                    { name: 'Wealth Building Guide', slug: 'wealth-building', href: '/personal-finance/guides/wealth-building' },
                ],
            },
        ],
    },
    {
        name: 'Calculators',
        slug: 'calculators',
        description: 'Financial calculators and analysis tools.',
        intents: [
            {
                name: 'Calculators',
                slug: EDITORIAL_INTENTS.CALCULATORS,
                description: 'Financial calculators',
                collections: [
                    { name: 'SIP Calculator', slug: 'sip', href: '/calculators/sip' },
                    { name: 'EMI Calculator', slug: 'emi', href: '/calculators/emi' },
                    { name: 'FD Calculator', slug: 'fd', href: '/calculators/fd' },
                    { name: 'Tax Calculator', slug: 'tax', href: '/calculators/tax' },
                    { name: 'Retirement Calculator', slug: 'retirement', href: '/calculators/retirement' },
                    { name: 'Goal Planning Calculator', slug: 'goal-planning', href: '/calculators/goal-planning' },
                ],
            },
            {
                name: 'Analysis',
                slug: 'analysis',
                description: 'Analysis and comparison tools',
                collections: [
                    { name: 'Compare Products', slug: 'compare', href: '/compare' },
                    { name: 'Risk Profiler', slug: 'risk', href: '/risk-profiler' },
                    { name: 'Portfolio Tracker', slug: 'portfolio', href: '/portfolio' },
                    { name: 'Alpha Terminal', slug: 'terminal', href: '/terminal' },
                ],
            },
        ],
    },
];

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): NavigationCategory | undefined {
    return NAVIGATION_CONFIG.find(cat => cat.slug === slug);
}

/**
 * Get intent by category and intent slug
 */
export function getIntentBySlug(
    categorySlug: string,
    intentSlug: string
): Intent | undefined {
    const category = getCategoryBySlug(categorySlug);
    return category?.intents.find(intent => intent.slug === intentSlug);
}

/**
 * Get collection by category, intent, and collection slug
 */
export function getCollectionBySlug(
    categorySlug: string,
    intentSlug: string,
    collectionSlug: string
): Collection | undefined {
    const intent = getIntentBySlug(categorySlug, intentSlug);
    return intent?.collections.find(collection => collection.slug === collectionSlug);
}

/**
 * Get all intents for a category
 */
export function getIntentsForCategory(categorySlug: string): Intent[] {
    const category = getCategoryBySlug(categorySlug);
    return category?.intents || [];
}

/**
 * Get all collections for an intent
 */
export function getCollectionsForIntent(
    categorySlug: string,
    intentSlug: string
): Collection[] {
    const intent = getIntentBySlug(categorySlug, intentSlug);
    return intent?.collections || [];
}

/**
 * Generate breadcrumb path from navigation structure
 */
export function generateBreadcrumbPath(
    categorySlug: string,
    intentSlug?: string,
    collectionSlug?: string
): Array<{ label: string; url: string }> {
    const breadcrumbs: Array<{ label: string; url: string }> = [
        { label: 'Home', url: '/' },
    ];

    const category = getCategoryBySlug(categorySlug);
    if (!category) return breadcrumbs;

    breadcrumbs.push({ label: category.name, url: `/${categorySlug}` });

    if (intentSlug) {
        const intent = getIntentBySlug(categorySlug, intentSlug);
        if (intent) {
            breadcrumbs.push({ label: intent.name, url: `/${categorySlug}/${intentSlug}` });
        }
    }

    if (collectionSlug && intentSlug) {
        const collection = getCollectionBySlug(categorySlug, intentSlug, collectionSlug);
        if (collection) {
            breadcrumbs.push({ label: collection.name, url: collection.href });
        }
    }

    return breadcrumbs;
}

/**
 * Get all URLs for sitemap generation
 */
export function getAllNavigationUrls(): string[] {
    const urls: string[] = [];

    for (const category of NAVIGATION_CONFIG) {
        // Category page
        urls.push(`/${category.slug}`);

        for (const intent of category.intents) {
            // Intent page
            urls.push(`/${category.slug}/${intent.slug}`);

            for (const collection of intent.collections) {
                // Collection page
                urls.push(collection.href);
            }
        }
    }

    return urls;
}

