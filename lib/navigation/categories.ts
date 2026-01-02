/**
 * Navigation Categories Configuration
 * 
 * Defines all pillar categories and their subcategories
 * Used for generating pillar and subcategory pages
 */

export interface Subcategory {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    keywords: string[]; // For automated categorization
}

export interface Category {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    subcategories: Subcategory[];
    keywords: string[]; // For automated categorization
}

export const NAVIGATION_CATEGORIES: Category[] = [
    {
        name: 'Credit Cards',
        slug: 'credit-cards',
        description: 'Compare credit cards with rewards, cashback, and travel benefits from top Indian banks.',
        keywords: ['credit card', 'visa', 'mastercard', 'rupay', 'amex', 'reward points', 'lounge access', 'annual fee'],
        subcategories: [
            { name: 'Rewards Cards', slug: 'rewards', description: 'Earn points and rewards on every spend', keywords: ['rewards', 'points', 'miles', 'redemption'] },
            { name: 'Cashback Cards', slug: 'cashback', description: 'Get cashback on your purchases', keywords: ['cashback', 'statement credit', 'rebate'] },
            { name: 'Travel Cards', slug: 'travel', description: 'Travel benefits and miles for frequent travelers', keywords: ['travel', 'flight', 'hotel', 'lounge', 'airport'] },
            { name: 'Fuel Cards', slug: 'fuel', description: 'Save on fuel expenses with fuel credit cards', keywords: ['fuel', 'petrol', 'diesel', 'surcharge'] },
            { name: 'Shopping Cards', slug: 'shopping', description: 'E-commerce benefits and shopping rewards', keywords: ['shopping', 'amazon', 'flipkart', 'myntra'] },
            { name: 'Co-branded Cards', slug: 'co-branded', description: 'Brand partnership credit cards', keywords: ['co-branded', 'partner', 'brand'] },
        ],
    },
    {
        name: 'Loans',
        slug: 'loans',
        description: 'Personal, home, car, education, gold, and business loans with lowest interest rates.',
        keywords: ['loan', 'emi', 'interest rate', 'lending', 'borrow', 'credit score', 'cibil'],
        subcategories: [
            { name: 'Personal Loans', slug: 'personal', description: 'Quick personal financing for your needs', keywords: ['personal loan', 'unsecured loan', 'instant loan'] },
            { name: 'Home Loans', slug: 'home', description: 'Buy your dream home with affordable home loans', keywords: ['home loan', 'mortgage', 'housing loan', 'property'] },
            { name: 'Car Loans', slug: 'car', description: 'Finance your vehicle with competitive rates', keywords: ['car loan', 'auto loan', 'vehicle loan'] },
            { name: 'Education Loans', slug: 'education', description: 'Fund your education with education loans', keywords: ['education loan', 'student loan', 'study abroad'] },
            { name: 'Gold Loans', slug: 'gold', description: 'Loan against gold with flexible terms', keywords: ['gold loan', 'ornament loan'] },
            { name: 'Business Loans', slug: 'business', description: 'Grow your business with business loans', keywords: ['business loan', 'msme loan', 'working capital'] },
        ],
    },
    {
        name: 'Banking',
        slug: 'banking',
        description: 'Savings accounts, fixed deposits, recurring deposits with best interest rates.',
        keywords: ['banking', 'savings', 'interest', 'fd', 'bank account', 'neft', 'rtgs', 'upi'],
        subcategories: [
            { name: 'Savings Accounts', slug: 'savings-accounts', description: 'Compare savings account interest rates', keywords: ['savings account', 'interest rate', 'minimum balance'] },
            { name: 'Fixed Deposits', slug: 'fixed-deposits', description: 'Highest FD rates from top banks', keywords: ['fixed deposit', 'fd rates', 'senior citizen fd'] },
            { name: 'Recurring Deposits', slug: 'recurring-deposits', description: 'Systematic savings with RDs', keywords: ['recurring deposit', 'rd rates', 'monthly saving'] },
            { name: 'Current Accounts', slug: 'current-accounts', description: 'Business banking accounts', keywords: ['current account', 'business banking', 'overdraft'] },
        ],
    },
    {
        name: 'Investing',
        slug: 'investing',
        description: 'Mutual funds, stocks, PPF/NPS, ELSS, gold, and demat accounts compared.',
        keywords: ['investing', 'share market', 'mutual fund', 'sip', 'equity', 'debt', 'tax saving'],
        subcategories: [
            { name: 'Mutual Funds', slug: 'mutual-funds', description: 'Compare top-rated mutual funds', keywords: ['mutual fund', 'sip', 'nav', 'amc'] },
            { name: 'Stocks & IPOs', slug: 'stocks', description: 'Best brokers and stock picks', keywords: ['stock', 'share', 'ipo', 'portfolio', 'trading'] },
            { name: 'PPF & NPS', slug: 'ppf-nps', description: 'Tax-saving retirement options', keywords: ['ppf', 'nps', 'pension', 'retirement'] },
            { name: 'ELSS', slug: 'elss', description: 'Tax-saving mutual funds', keywords: ['elss', 'tax saving', 'equity linked'] },
            { name: 'Gold Investments', slug: 'gold-investments', description: 'Gold ETFs and funds', keywords: ['gold etf', 'sovereign gold bond', 'sgb', 'gold fund'] },
            { name: 'Demat Accounts', slug: 'demat-accounts', description: 'Top brokers compared', keywords: ['demat', 'brokerage', 'trading account'] },
        ],
    },
    {
        name: 'Insurance',
        slug: 'insurance',
        description: 'Life, health, term, car, bike, and travel insurance from top insurers.',
        keywords: ['insurance', 'policy', 'premium', 'coverage', 'claim', 'term life'],
        subcategories: [
            { name: 'Life Insurance', slug: 'life', description: 'Protect your family with life insurance', keywords: ['life insurance', 'endowment', 'whole life'] },
            { name: 'Health Insurance', slug: 'health', description: 'Medical coverage and health plans', keywords: ['health insurance', 'mediclaim', 'medical insurance'] },
            { name: 'Term Insurance', slug: 'term', description: 'Pure protection plans', keywords: ['term insurance', 'death benefit'] },
            { name: 'Car Insurance', slug: 'car', description: 'Vehicle protection and coverage', keywords: ['car insurance', 'motor insurance', 'third party'] },
            { name: 'Bike Insurance', slug: 'bike', description: 'Two-wheeler insurance coverage', keywords: ['bike insurance', 'two wheeler insurance'] },
            { name: 'Travel Insurance', slug: 'travel', description: 'Travel protection plans', keywords: ['travel insurance', 'intl travel insurance'] },
            { name: 'ULIPs', slug: 'ulip', description: 'Investment plus insurance plans', keywords: ['ulip', 'unit linked'] },
        ],
    },
    {
        name: 'Small Business',
        slug: 'small-business',
        description: 'Business loans, credit cards, accounts, GST calculator, and services for small businesses.',
        keywords: ['business', 'msme', 'startup', 'gst', 'merchant', 'working capital'],
        subcategories: [
            { name: 'Business Loans', slug: 'business-loans', description: 'Working capital and term loans', keywords: ['business loan', 'startup loan', 'msme loan'] },
            { name: 'Business Credit Cards', slug: 'business-credit-cards', description: 'Corporate credit cards', keywords: ['business credit card', 'corporate card'] },
            { name: 'Current Accounts', slug: 'current-accounts', description: 'Business banking accounts', keywords: ['current account', 'business account'] },
            { name: 'GST Calculator', slug: 'gst-calculator', description: 'Calculate GST for goods and services', keywords: ['gst calculator', 'gst rate'] },
            { name: 'Merchant Services', slug: 'merchant-services', description: 'Payment processing solutions', keywords: ['pos terminal', 'payment gateway', 'merchant account'] },
            { name: 'Business Insurance', slug: 'business-insurance', description: 'Commercial insurance plans', keywords: ['business insurance', 'commercial insurance'] },
            { name: 'Invoice Financing', slug: 'invoice-financing', description: 'Invoice discounting and factoring', keywords: ['invoice factoring', 'bill discounting'] },
        ],
    },
    {
        name: 'Taxes',
        slug: 'taxes',
        description: 'Income tax, GST, TDS, tax-saving investments, and ITR filing guides for Indian taxpayers.',
        keywords: ['tax', 'income tax', 'itr', 'gst', 'tds', 'section 80c'],
        subcategories: [
            { name: 'Income Tax', slug: 'income-tax', description: 'Personal income tax filing and planning', keywords: ['income tax', 'itr login', 'itr filing'] },
            { name: 'GST', slug: 'gst', description: 'Goods and Services Tax compliance', keywords: ['gst return', 'gst registration'] },
            { name: 'Tax Saving', slug: 'tax-saving', description: 'Legal ways to save tax in India', keywords: ['tax saving', '80c', '80d'] },
            { name: 'TDS & TCS', slug: 'tds-tcs', description: 'Tax deducted at source guides', keywords: ['tds return', 'tds rate'] },
        ],
    },
    {
        name: 'Personal Finance',
        slug: 'personal-finance',
        description: 'Financial planning, budgeting, wealth management, debt management, and retirement planning guides.',
        keywords: ['money management', 'budget', 'saving', 'wealth', 'retirement', 'debt'],
        subcategories: [
            { name: 'Budgeting', slug: 'budgeting', description: 'Master your money with effective budgeting', keywords: ['budget plan', 'expense tracker'] },
            { name: 'Financial Planning', slug: 'financial-planning', description: 'Comprehensive financial roadmap', keywords: ['financial goal', 'wealth planning'] },
            { name: 'Debt Management', slug: 'debt-management', description: 'Strategies to become debt-free', keywords: ['debt free', 'loan repayment'] },
            { name: 'Retirement Planning', slug: 'retirement', description: 'Plan for a secure retirement', keywords: ['retirement fund', 'pension plan'] },
        ],
    },
];

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
    return NAVIGATION_CATEGORIES.find(cat => cat.slug === slug);
}

/**
 * Get subcategory by category and subcategory slug
 */
export function getSubcategoryBySlug(
    categorySlug: string,
    subcategorySlug: string
): Subcategory | undefined {
    const category = getCategoryBySlug(categorySlug);
    return category?.subcategories.find(sub => sub.slug === subcategorySlug);
}

/**
 * Get all subcategories for a category
 */
export function getSubcategoriesForCategory(categorySlug: string): Subcategory[] {
    const category = getCategoryBySlug(categorySlug);
    return category?.subcategories || [];
}

