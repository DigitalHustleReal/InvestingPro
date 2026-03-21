/**
 * Trust & Transparency Utilities
 */

/**
 * Format relative time for display
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Updated moments ago';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    
    return `Updated on ${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
}

/**
 * Calculate trust score breakdown
 */
export interface TrustScoreBreakdown {
    overall: number;
    components: {
        dataFreshness: number;
        userReviews: number;
        marketPresence: number;
        verification: number;
    };
    label: string;
    color: string;
}

export function calculateTrustScoreBreakdown(
    trustScore: number,
    verificationStatus: string,
    lastUpdated: Date
): TrustScoreBreakdown {
    // Calculate component scores
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    const dataFreshness = Math.max(0, 30 - (daysSinceUpdate * 6)); // Max 30 points, -6 per day
    
    const verificationScore = verificationStatus === 'verified' ? 25 : 
                            verificationStatus === 'pending' ? 10 : 0;
    
    // Derive user reviews and market presence from overall score
    const remaining = trustScore - dataFreshness - verificationScore;
    const userReviews = Math.floor(remaining * 0.4);
    const marketPresence = remaining - userReviews;
    
    // Vibrant colors are GOOD - just replace red with amber for low scores
    let label = 'Needs Review';
    let color = 'amber'; // Amber instead of red for low scores
    
    if (trustScore >= 80) {
        label = 'Excellent';
        color = 'emerald'; // Keep vibrant emerald
    } else if (trustScore >= 60) {
        label = 'Good';
        color = 'teal'; // Keep vibrant teal
    } else if (trustScore >= 40) {
        label = 'Fair';
        color = 'amber'; // Amber for caution, not red
    }
    
    return {
        overall: trustScore,
        components: {
            dataFreshness: Math.round(dataFreshness),
            userReviews: Math.round(userReviews),
            marketPresence: Math.round(marketPresence),
            verification: verificationScore
        },
        label,
        color
    };
}

/**
 * Generate verification badge data
 */
export interface VerificationBadge {
    status: 'verified' | 'pending' | 'outdated';
    label: string;
    description: string;
    icon: 'check' | 'clock' | 'alert';
    color: string;
}

export function getVerificationBadge(
    verificationStatus: string,
    lastVerified?: Date
): VerificationBadge {
    if (verificationStatus === 'verified' && lastVerified) {
        const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince <= 30) {
            return {
                status: 'verified',
                label: 'Verified',
                description: `Data verified ${daysSince} days ago by our editorial team`,
                icon: 'check',
                color: 'emerald' // Keep vibrant emerald for success
            };
        } else {
            return {
                status: 'outdated',
                label: 'Pending Review',
                description: 'Verification due - data may need update',
                icon: 'alert',
                color: 'amber' // Amber for warnings, not red
            };
        }
    }
    
    return {
        status: 'pending',
        label: 'Under Review',
        description: 'Our team is verifying this information',
        icon: 'clock',
        color: 'slate'
    };
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}
