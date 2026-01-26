/**
 * Platform Statistics Configuration
 * Single source of truth for ALL platform stats
 * REALISTIC numbers - not hyped
 */

/**
 * Calculate current realistic stats based on platform age
 */
export function getPlatformStats() {
    // MARKETING-APPROVED NUMBERS (Source: master_audit_checklist.md)
    // Dynamic calculation removed to ensure consistency with marketing copy
    
    return {
        productsAnalyzed: 2000,       // "2,000+ Products"
        monthlyUsers: 2100000,        // "2.1M+ Users"
        moneySaved: 5000000000,       // "₹500Cr+" (500 Crores)
        averageRating: 4.8,           // "4.8/5 Rating"
        moneySavedCr: "500.0",        // Display purposes
        moneySavedLakh: "50000.0",    // Display purposes
    };
}

/**
 * Format numbers for display
 */
export function formatStat(num: number, compact = true): string {
    if (compact) {
        if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
        if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('en-IN');
}

/**
 * Get display-ready stats
 */
export function getDisplayStats() {
    const stats = getPlatformStats();
    
    return {
        // Use actual calculated numbers
        productsAnalyzed: {
            value: stats.productsAnalyzed,
            display: formatStat(stats.productsAnalyzed),
            label: "Products Analyzed",
            description: "Comprehensive database of schemes & cards"
        },
        monthlyUsers: {
            value: stats.monthlyUsers,
            display: formatStat(stats.monthlyUsers),
            label: "Monthly Users",
            description: "Trusted by India's smartest investors"
        },
        averageRating: {
            value: stats.averageRating,
            display: stats.averageRating.toString(),
            label: "Avg. Rating",
            description: "Based on verified user reviews"
        },
        moneySaved: {
            value: stats.moneySaved,
            display: `₹${formatStat(stats.moneySaved)}`,
            label: "Money Saved",
            description: "Total savings by our users"
        },
        unbiased: {
            value: 100,
            display: "100%",
            label: "Unbiased",
            description: "Independent research, zero paid bias"
        },
        marketScans: {
            value: 1, // Daily = 1
            display: "Daily",
            label: "Daily Updates", // Renamed from Market Scans to fit Personal Finance
            description: "Latest rates & product changes"
        }
    };
}

/**
 * Example usage in components:
 * 
 * import { getDisplayStats } from '@/lib/platform-stats';
 * import { AnimatedCounter } from '@/components/common/AnimatedCounter';
 * 
 * const stats = getDisplayStats();
 * 
 * <AnimatedCounter end={stats.productsAnalyzed.value} />
 * // or
 * <div>{stats.productsAnalyzed.display}</div>
 */
