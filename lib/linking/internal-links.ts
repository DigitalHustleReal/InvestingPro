/**
 * Internal Link Registry for Credit Card Pages
 *
 * Provides a comprehensive link map and contextual link generation
 * for all credit card related pages to improve crawlability and
 * topical authority across the site.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type LinkType = 'card' | 'guide' | 'category' | 'salary' | 'tool' | 'compare';

export interface InternalLinkEntry {
    href: string;
    title: string;
    description: string;
    type: LinkType;
    /** Tags used for relevance matching */
    tags: string[];
}

// ─── Category Pages ──────────────────────────────────────────────────────────

const CATEGORY_LINKS: InternalLinkEntry[] = [
    {
        href: '/credit-cards/category/cashback',
        title: 'Best Cashback Credit Cards',
        description: 'Earn 1-5% cashback on every purchase with top-rated cashback cards in India.',
        type: 'category',
        tags: ['cashback', 'savings', 'shopping', 'everyday'],
    },
    {
        href: '/credit-cards/category/travel',
        title: 'Best Travel Credit Cards',
        description: 'Airport lounge access, air miles, and low forex markup for frequent travellers.',
        type: 'category',
        tags: ['travel', 'lounge', 'miles', 'forex', 'flights'],
    },
    {
        href: '/credit-cards/category/rewards',
        title: 'Best Rewards Credit Cards',
        description: 'Earn valuable reward points on every purchase and redeem for flights, shopping, and more.',
        type: 'category',
        tags: ['rewards', 'points', 'redemption', 'benefits'],
    },
    {
        href: '/credit-cards/category/premium',
        title: 'Best Premium Credit Cards',
        description: 'Luxury benefits, unlimited lounges, concierge services, and elite reward programs.',
        type: 'category',
        tags: ['premium', 'luxury', 'concierge', 'lounge', 'high-income'],
    },
    {
        href: '/credit-cards/category/shopping',
        title: 'Best Shopping Credit Cards',
        description: 'Maximise savings on online and offline shopping with instant discounts and offers.',
        type: 'category',
        tags: ['shopping', 'online', 'amazon', 'flipkart', 'discounts'],
    },
    {
        href: '/credit-cards/category/fuel',
        title: 'Best Fuel Credit Cards',
        description: 'Save on fuel surcharges and earn rewards on petrol and diesel purchases.',
        type: 'category',
        tags: ['fuel', 'petrol', 'diesel', 'surcharge', 'transport'],
    },
    {
        href: '/credit-cards/category/lifetime-free',
        title: 'Best Lifetime Free Credit Cards',
        description: 'Zero annual fee cards with no hidden charges — great value for all spending levels.',
        type: 'category',
        tags: ['lifetime-free', 'no-fee', 'free', 'zero-fee', 'beginner'],
    },
    {
        href: '/credit-cards/category/airport-lounge',
        title: 'Best Airport Lounge Credit Cards',
        description: 'Cards with Priority Pass, DreamFolks, and complimentary domestic and international lounge access.',
        type: 'category',
        tags: ['lounge', 'airport', 'priority-pass', 'dreamfolks', 'travel'],
    },
];

// ─── Salary Bracket Pages ────────────────────────────────────────────────────

const SALARY_LINKS: InternalLinkEntry[] = [
    {
        href: '/credit-cards/salary/15000-25000',
        title: 'Cards for Salary ₹15K - ₹25K',
        description: 'Entry-level credit cards with low fees, cashback, and easy approval.',
        type: 'salary',
        tags: ['entry-level', 'beginner', 'low-income', 'starter'],
    },
    {
        href: '/credit-cards/salary/25000-40000',
        title: 'Cards for Salary ₹25K - ₹40K',
        description: 'Mid-range cards with cashback, rewards, fuel surcharge waivers, and more.',
        type: 'salary',
        tags: ['mid-range', 'cashback', 'fuel', 'rewards'],
    },
    {
        href: '/credit-cards/salary/40000-60000',
        title: 'Cards for Salary ₹40K - ₹60K',
        description: 'Mid-premium cards with lounge access, travel benefits, and high cashback.',
        type: 'salary',
        tags: ['mid-premium', 'lounge', 'travel', 'cashback'],
    },
    {
        href: '/credit-cards/salary/60000-100000',
        title: 'Cards for Salary ₹60K - ₹1L',
        description: 'Premium cards with international travel benefits, golf privileges, and elite rewards.',
        type: 'salary',
        tags: ['premium', 'travel', 'golf', 'international'],
    },
    {
        href: '/credit-cards/salary/above-100000',
        title: 'Cards for Salary Above ₹1 Lakh',
        description: 'Super-premium and luxury cards with unlimited lounges and concierge services.',
        type: 'salary',
        tags: ['luxury', 'super-premium', 'high-income', 'concierge', 'unlimited-lounge'],
    },
];

// ─── Guide Pages ─────────────────────────────────────────────────────────────

const GUIDE_LINKS: InternalLinkEntry[] = [
    {
        href: '/credit-cards/airport-lounge-access-india',
        title: 'Airport Lounge Access Guide',
        description: 'Complete guide to airport lounge access using credit cards in India — rules, activation, and card comparison.',
        type: 'guide',
        tags: ['lounge', 'airport', 'travel', 'priority-pass', 'dreamfolks', 'guide'],
    },
];

// ─── Tool / Calculator Pages ─────────────────────────────────────────────────

const TOOL_LINKS: InternalLinkEntry[] = [
    {
        href: '/credit-cards',
        title: 'All Credit Cards',
        description: 'Browse and compare all credit cards available in India with filters and sorting.',
        type: 'tool',
        tags: ['all', 'browse', 'compare', 'listing'],
    },
    {
        href: '/credit-cards/find-your-card',
        title: 'Find Your Perfect Card',
        description: 'Answer a few questions to get personalised credit card recommendations.',
        type: 'tool',
        tags: ['finder', 'recommendation', 'quiz', 'personalised'],
    },
    {
        href: '/credit-cards/smart-compare',
        title: 'Smart Compare',
        description: 'Compare up to 3 credit cards side-by-side with detailed feature breakdown.',
        type: 'tool',
        tags: ['compare', 'side-by-side', 'features', 'tool'],
    },
    {
        href: '/calculators',
        title: 'Financial Calculators',
        description: 'EMI, SIP, tax, and other financial calculators to help plan your finances.',
        type: 'tool',
        tags: ['calculator', 'emi', 'sip', 'tax', 'planning'],
    },
];

// ─── All Links Combined ──────────────────────────────────────────────────────

const ALL_LINKS: InternalLinkEntry[] = [
    ...CATEGORY_LINKS,
    ...SALARY_LINKS,
    ...GUIDE_LINKS,
    ...TOOL_LINKS,
];

// ─── Relevance Scoring ──────────────────────────────────────────────────────

/**
 * Category relationship map for cross-linking relevance.
 * Keys are category slugs; values are related categories ordered by relevance.
 */
const CATEGORY_RELATIONS: Record<string, string[]> = {
    cashback: ['shopping', 'rewards', 'lifetime-free', 'fuel'],
    travel: ['airport-lounge', 'premium', 'rewards', 'fuel'],
    rewards: ['cashback', 'premium', 'shopping', 'travel'],
    premium: ['travel', 'airport-lounge', 'rewards'],
    shopping: ['cashback', 'rewards', 'lifetime-free'],
    fuel: ['cashback', 'travel', 'lifetime-free'],
    'lifetime-free': ['cashback', 'shopping', 'fuel', 'rewards'],
    'airport-lounge': ['travel', 'premium'],
};

/**
 * Score a link's relevance to the current page context.
 * Higher score = more relevant.
 */
function scoreLink(
    link: InternalLinkEntry,
    currentSlug: string,
    category: string,
): number {
    // Never link to self
    if (link.href === `/credit-cards/${currentSlug}` || link.href === currentSlug) {
        return -1;
    }

    let score = 0;

    // Same category gets a boost
    if (link.tags.includes(category)) {
        score += 10;
    }

    // Related categories get a smaller boost
    const related = CATEGORY_RELATIONS[category] || [];
    for (let i = 0; i < related.length; i++) {
        if (link.tags.includes(related[i])) {
            score += 6 - i; // Diminishing relevance
            break;
        }
    }

    // Guides are always useful
    if (link.type === 'guide') {
        score += 4;
    }

    // Tools are moderately useful
    if (link.type === 'tool') {
        score += 3;
    }

    // Salary links are useful from card detail pages
    if (link.type === 'salary') {
        score += 2;
    }

    return score;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get contextually relevant internal links for a given page.
 *
 * @param currentSlug - The slug of the current page (e.g., "hdfc-regalia" or "category/travel")
 * @param category    - The category context (e.g., "travel", "cashback", "premium")
 * @param maxLinks    - Maximum number of links to return (default 6)
 * @returns Array of relevant internal links, grouped and sorted by relevance
 */
export function getRelatedLinks(
    currentSlug: string,
    category: string,
    maxLinks: number = 6,
): InternalLinkEntry[] {
    const normalizedCategory = category.toLowerCase().trim();

    const scored = ALL_LINKS
        .map((link) => ({
            link,
            score: scoreLink(link, currentSlug, normalizedCategory),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.slice(0, maxLinks).map(({ link }) => link);
}

/**
 * Get links grouped by type for display in the RelatedPages component.
 *
 * @param currentSlug - The slug of the current page
 * @param category    - The category context
 * @param maxLinks    - Maximum total links (default 6)
 * @returns Record grouped by display label
 */
export function getGroupedRelatedLinks(
    currentSlug: string,
    category: string,
    maxLinks: number = 6,
): Record<string, InternalLinkEntry[]> {
    const links = getRelatedLinks(currentSlug, category, maxLinks);

    const TYPE_LABELS: Record<LinkType, string> = {
        card: 'Related Cards',
        category: 'Categories',
        salary: 'Salary Brackets',
        guide: 'Guides',
        tool: 'Tools',
        compare: 'Comparisons',
    };

    const grouped: Record<string, InternalLinkEntry[]> = {};

    for (const link of links) {
        const label = TYPE_LABELS[link.type] || 'Related';
        if (!grouped[label]) {
            grouped[label] = [];
        }
        grouped[label].push(link);
    }

    return grouped;
}

/**
 * Get all category links (useful for footer or navigation sections).
 */
export function getCategoryLinks(): InternalLinkEntry[] {
    return [...CATEGORY_LINKS];
}

/**
 * Get all salary bracket links.
 */
export function getSalaryLinks(): InternalLinkEntry[] {
    return [...SALARY_LINKS];
}
