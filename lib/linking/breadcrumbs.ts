/**
 * Automated Breadcrumb Generator
 * 
 * Generates breadcrumbs automatically based on URL structure
 * Uses NAVIGATION_CONFIG for Category → Intent → Collection structure
 */

import { NAVIGATION_CONFIG } from '@/lib/navigation/config';

export interface BreadcrumbItem {
    label: string;
    url: string;
}

/**
 * Generate breadcrumbs from URL path
 * Uses NAVIGATION_CONFIG to resolve category, intent, and collection names
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', url: '/' },
    ];

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
        return breadcrumbs;
    }

    // Fallback labels for non-navigation routes
    const fallbackLabels: Record<string, string> = {
        'glossary': 'Glossary',
        'article': 'Articles',
        'blog': 'Blog',
        'calculators': 'Calculators',
        'mutual-funds': 'Mutual Funds',
        'stocks': 'Stocks',
        'fixed-deposits': 'Fixed Deposits',
        'ppf-nps': 'PPF & NPS',
        'demat-accounts': 'Demat Accounts',
        'savings-accounts': 'Savings Accounts',
        'current-accounts': 'Current Accounts',
        'sip': 'SIP Calculator',
        'emi': 'EMI Calculator',
        'fd': 'FD Calculator',
        'tax': 'Tax Calculator',
        'retirement': 'Retirement Calculator',
        'ppf': 'PPF Calculator',
        'nps': 'NPS Calculator',
        'lumpsum': 'Lumpsum Calculator',
        'swp': 'SWP Calculator',
        'goal-planning': 'Goal Planning Calculator',
        'inflation-adjusted-returns': 'Inflation Adjusted Returns',
    };

    let currentPath = '';
    
    // Try to match against NAVIGATION_CONFIG structure
    const firstSegment = segments[0];
    const category = NAVIGATION_CONFIG.find(cat => cat.slug === firstSegment);
    
    if (category) {
        // Category level
        currentPath = `/${category.slug}`;
        breadcrumbs.push({
            label: category.name,
            url: currentPath,
        });

        // Intent level (if present)
        if (segments.length > 1) {
            const intentSegment = segments[1];
            const intent = category.intents.find(int => int.slug === intentSegment);
            
            if (intent) {
                currentPath += `/${intent.slug}`;
                breadcrumbs.push({
                    label: intent.name,
                    url: currentPath,
                });

                // Collection level (if present)
                if (segments.length > 2) {
                    const collectionSegment = segments[2];
                    const collection = intent.collections.find(col => {
                        // Extract slug from href (e.g., "/credit-cards/best/rewards" -> "rewards")
                        const hrefSegments = col.href.split('/').filter(Boolean);
                        return hrefSegments[hrefSegments.length - 1] === collectionSegment;
                    });

                    if (collection) {
                        currentPath += `/${collectionSegment}`;
                        breadcrumbs.push({
                            label: collection.name,
                            url: currentPath,
                        });
                    } else {
                        // Fallback for unknown collection
                        currentPath += `/${collectionSegment}`;
                        breadcrumbs.push({
                            label: formatSegmentLabel(collectionSegment),
                            url: currentPath,
                        });
                    }
                }
            } else {
                // Fallback for unknown intent
                currentPath += `/${intentSegment}`;
                breadcrumbs.push({
                    label: formatSegmentLabel(intentSegment),
                    url: currentPath,
                });
            }
        }
    } else {
        // Not a navigation config route, use fallback or format
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            currentPath += `/${segment}`;
            
            const label = fallbackLabels[segment] || formatSegmentLabel(segment);
            breadcrumbs.push({
                label,
                url: currentPath,
            });
        }
    }

    return breadcrumbs;
}

/**
 * Format segment label (slug to readable)
 */
function formatSegmentLabel(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): any {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://investingpro.in'}${crumb.url}`,
        })),
    };
}

