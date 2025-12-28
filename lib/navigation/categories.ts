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
}

export interface Category {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    subcategories: Subcategory[];
}

export const NAVIGATION_CATEGORIES: Category[] = [
    {
        name: 'Credit Cards',
        slug: 'credit-cards',
        description: 'Compare credit cards with rewards, cashback, and travel benefits from top Indian banks.',
        subcategories: [
            { name: 'Rewards Cards', slug: 'rewards', description: 'Earn points and rewards on every spend' },
            { name: 'Cashback Cards', slug: 'cashback', description: 'Get cashback on your purchases' },
            { name: 'Travel Cards', slug: 'travel', description: 'Travel benefits and miles for frequent travelers' },
            { name: 'Fuel Cards', slug: 'fuel', description: 'Save on fuel expenses with fuel credit cards' },
            { name: 'Shopping Cards', slug: 'shopping', description: 'E-commerce benefits and shopping rewards' },
            { name: 'Co-branded Cards', slug: 'co-branded', description: 'Brand partnership credit cards' },
        ],
    },
    {
        name: 'Loans',
        slug: 'loans',
        description: 'Personal, home, car, education, gold, and business loans with lowest interest rates.',
        subcategories: [
            { name: 'Personal Loans', slug: 'personal', description: 'Quick personal financing for your needs' },
            { name: 'Home Loans', slug: 'home', description: 'Buy your dream home with affordable home loans' },
            { name: 'Car Loans', slug: 'car', description: 'Finance your vehicle with competitive rates' },
            { name: 'Education Loans', slug: 'education', description: 'Fund your education with education loans' },
            { name: 'Gold Loans', slug: 'gold', description: 'Loan against gold with flexible terms' },
            { name: 'Business Loans', slug: 'business', description: 'Grow your business with business loans' },
        ],
    },
    {
        name: 'Banking',
        slug: 'banking',
        description: 'Savings accounts, fixed deposits, recurring deposits with best interest rates.',
        subcategories: [
            { name: 'Savings Accounts', slug: 'savings-accounts', description: 'Compare savings account interest rates' },
            { name: 'Fixed Deposits', slug: 'fixed-deposits', description: 'Highest FD rates from top banks' },
            { name: 'Recurring Deposits', slug: 'recurring-deposits', description: 'Systematic savings with RDs' },
            { name: 'Current Accounts', slug: 'current-accounts', description: 'Business banking accounts' },
        ],
    },
    {
        name: 'Investing',
        slug: 'investing',
        description: 'Mutual funds, stocks, PPF/NPS, ELSS, gold, and demat accounts compared.',
        subcategories: [
            { name: 'Mutual Funds', slug: 'mutual-funds', description: 'Compare top-rated mutual funds' },
            { name: 'Stocks & IPOs', slug: 'stocks', description: 'Best brokers and stock picks' },
            { name: 'PPF & NPS', slug: 'ppf-nps', description: 'Tax-saving retirement options' },
            { name: 'ELSS', slug: 'elss', description: 'Tax-saving mutual funds' },
            { name: 'Gold Investments', slug: 'gold-investments', description: 'Gold ETFs and funds' },
            { name: 'Demat Accounts', slug: 'demat-accounts', description: 'Top brokers compared' },
        ],
    },
    {
        name: 'Insurance',
        slug: 'insurance',
        description: 'Life, health, term, car, bike, and travel insurance from top insurers.',
        subcategories: [
            { name: 'Life Insurance', slug: 'life', description: 'Protect your family with life insurance' },
            { name: 'Health Insurance', slug: 'health', description: 'Medical coverage and health plans' },
            { name: 'Term Insurance', slug: 'term', description: 'Pure protection plans' },
            { name: 'Car Insurance', slug: 'car', description: 'Vehicle protection and coverage' },
            { name: 'Bike Insurance', slug: 'bike', description: 'Two-wheeler insurance coverage' },
            { name: 'Travel Insurance', slug: 'travel', description: 'Travel protection plans' },
            { name: 'ULIPs', slug: 'ulip', description: 'Investment plus insurance plans' },
        ],
    },
    {
        name: 'Small Business',
        slug: 'small-business',
        description: 'Business loans, credit cards, accounts, GST calculator, and services for small businesses.',
        subcategories: [
            { name: 'Business Loans', slug: 'business-loans', description: 'Working capital and term loans' },
            { name: 'Business Credit Cards', slug: 'business-credit-cards', description: 'Corporate credit cards' },
            { name: 'Current Accounts', slug: 'current-accounts', description: 'Business banking accounts' },
            { name: 'GST Calculator', slug: 'gst-calculator', description: 'Calculate GST for goods and services' },
            { name: 'Merchant Services', slug: 'merchant-services', description: 'Payment processing solutions' },
            { name: 'Business Insurance', slug: 'business-insurance', description: 'Commercial insurance plans' },
            { name: 'Invoice Financing', slug: 'invoice-financing', description: 'Invoice discounting and factoring' },
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

