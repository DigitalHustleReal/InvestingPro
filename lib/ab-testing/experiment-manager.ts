/**
 * A/B Testing Experiment Manager
 * 
 * Core engine for running A/B tests with:
 * - Consistent variant assignment
 * - Experiment tracking
 * - Statistical significance testing
 * - Multi-variate support
 */

export interface Experiment {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    variants: Variant[];
    startDate?: Date;
    endDate?: Date;
    targetMetric: string;
    trafficAllocation: number; // 0-100 percentage
}

export interface Variant {
    id: string;
    name: string;
    weight: number; // 0-100 percentage
    description?: string;
}

export interface ExperimentAssignment {
    experimentId: string;
    variantId: string;
    userId: string;
    assignedAt: Date;
}

export interface ExperimentResult {
    experimentId: string;
    variant: string;
    participants: number;
    conversions: number;
    conversionRate: number;
    confidence: number;
    isWinner: boolean;
}

/**
 * Assign user to experiment variant using consistent hashing
 */
export function assignVariant(
    userId: string,
    experiment: Experiment
): string {
    // Check if user should be in experiment (traffic allocation)
    const trafficHash = hashString(`${userId}-${experiment.id}-traffic`);
    const trafficPercentage = (trafficHash % 100);
    
    if (trafficPercentage >= experiment.trafficAllocation) {
        return 'control'; // User not in experiment
    }
    
    // Assign to variant using consistent hashing
    const variantHash = hashString(`${userId}-${experiment.id}`);
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    const normalizedHash = variantHash % totalWeight;
    
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
        cumulativeWeight += variant.weight;
        if (normalizedHash < cumulativeWeight) {
            return variant.id;
        }
    }
    
    // Fallback to first variant
    return experiment.variants[0]?.id || 'control';
}

/**
 * Simple hash function for consistent variant assignment
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Calculate statistical significance using Z-test
 */
export function calculateSignificance(
    controlConversions: number,
    controlParticipants: number,
    variantConversions: number,
    variantParticipants: number
): {
    pValue: number;
    zScore: number;
    isSignificant: boolean;
    confidence: number;
} {
    // Calculate conversion rates
    const p1 = controlConversions / controlParticipants;
    const p2 = variantConversions / variantParticipants;
    
    // Pooled probability
    const pPool = (controlConversions + variantConversions) / 
                  (controlParticipants + variantParticipants);
    
    // Standard error
    const se = Math.sqrt(pPool * (1 - pPool) * 
                        (1/controlParticipants + 1/variantParticipants));
    
    // Z-score
    const zScore = (p2 - p1) / se;
    
    // P-value (two-tailed test)
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
    
    // Significance (p < 0.05)
    const isSignificant = pValue < 0.05;
    
    // Confidence level
    const confidence = (1 - pValue) * 100;
    
    return {
        pValue,
        zScore,
        isSignificant,
        confidence
    };
}

/**
 * Normal cumulative distribution function
 */
function normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
}

/**
 * Determine experiment winner
 */
export function determineWinner(
    results: ExperimentResult[]
): ExperimentResult | null {
    if (results.length < 2) return null;
    
    // Find control variant
    const control = results.find(r => r.variant === 'control');
    if (!control) return null;
    
    // Find best performing variant with statistical significance
    let winner: ExperimentResult | null = null;
    let bestLift = 0;
    
    for (const variant of results) {
        if (variant.variant === 'control') continue;
        
        const significance = calculateSignificance(
            control.conversions,
            control.participants,
            variant.conversions,
            variant.participants
        );
        
        if (significance.isSignificant) {
            const lift = (variant.conversionRate - control.conversionRate) / control.conversionRate;
            if (lift > bestLift) {
                bestLift = lift;
                winner = {
                    ...variant,
                    confidence: significance.confidence,
                    isWinner: true
                };
            }
        }
    }
    
    return winner;
}

/**
 * Calculate minimum sample size for experiment
 */
export function calculateSampleSize(
    baselineConversionRate: number,
    minimumDetectableEffect: number, // e.g., 0.1 for 10% lift
    alpha: number = 0.05, // Significance level
    power: number = 0.8 // Statistical power
): number {
    const p1 = baselineConversionRate;
    const p2 = p1 * (1 + minimumDetectableEffect);
    
    const zAlpha = 1.96; // Z-score for 95% confidence
    const zBeta = 0.84; // Z-score for 80% power
    
    const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
    const denominator = Math.pow(p2 - p1, 2);
    
    return Math.ceil(numerator / denominator);
}

/**
 * Check if experiment has reached statistical significance
 */
export function hasReachedSignificance(
    experiment: Experiment,
    results: ExperimentResult[]
): boolean {
    const control = results.find(r => r.variant === 'control');
    if (!control) return false;
    
    // Check if any variant has significant difference from control
    for (const variant of results) {
        if (variant.variant === 'control') continue;
        
        const significance = calculateSignificance(
            control.conversions,
            control.participants,
            variant.conversions,
            variant.participants
        );
        
        if (significance.isSignificant) {
            return true;
        }
    }
    
    return false;
}
