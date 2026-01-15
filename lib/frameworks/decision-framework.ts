/**
 * Decision Framework Logic
 * 
 * Implements the Problem → Compare → Decide → Apply framework.
 * Provides utilities for tracking user journey through decision stages.
 */

export type DecisionStage = 'problem' | 'compare' | 'decide' | 'apply';

export interface DecisionJourney {
    stage: DecisionStage;
    productId?: string;
    category?: string;
    timestamp: string;
    sessionId?: string;
}

export interface DecisionMetrics {
    problem_identified: number;
    comparison_viewed: number;
    decision_made: number;
    application_started: number;
    conversion_rate: number; // application_started / problem_identified
}

/**
 * Track user progress through decision stages
 */
export function trackDecisionStage(
    stage: DecisionStage,
    productId?: string,
    category?: string
): void {
    if (typeof window === 'undefined') return;

    const journey: DecisionJourney = {
        stage,
        productId,
        category,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId()
    };

    // Track in analytics
    if ((window as any).gtag) {
        (window as any).gtag('event', 'decision_stage', {
            stage,
            product_id: productId,
            category,
            session_id: journey.sessionId
        });
    }

    // Store in session storage for journey tracking
    const journeyHistory = getJourneyHistory();
    journeyHistory.push(journey);
    sessionStorage.setItem('decision_journey', JSON.stringify(journeyHistory.slice(-10))); // Keep last 10 steps
}

/**
 * Get session ID (creates if doesn't exist)
 */
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('decision_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('decision_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Get journey history from session storage
 */
function getJourneyHistory(): DecisionJourney[] {
    if (typeof window === 'undefined') return [];
    
    const stored = sessionStorage.getItem('decision_journey');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Get current decision stage from journey
 */
export function getCurrentStage(): DecisionStage {
    const history = getJourneyHistory();
    if (history.length === 0) return 'problem';
    
    const lastStage = history[history.length - 1].stage;
    return lastStage;
}

/**
 * Check if user has completed a stage
 */
export function hasCompletedStage(stage: DecisionStage): boolean {
    const history = getJourneyHistory();
    return history.some(j => j.stage === stage);
}

/**
 * Get next recommended action based on current stage
 */
export function getNextAction(currentStage: DecisionStage, category?: string): {
    action: string;
    href: string;
    cta: string;
} {
    switch (currentStage) {
        case 'problem':
            return {
                action: 'compare',
                href: category ? `/${category}/compare` : '/compare',
                cta: 'Compare Options'
            };
        case 'compare':
            return {
                action: 'decide',
                href: category ? `/${category}/find-your-${category === 'credit-cards' ? 'card' : 'fund'}` : '/recommendations',
                cta: 'Get Recommendations'
            };
        case 'decide':
            return {
                action: 'apply',
                href: '#apply', // Will be handled by scroll or modal
                cta: 'Apply Now'
            };
        case 'apply':
            return {
                action: 'complete',
                href: '/',
                cta: 'Explore More'
            };
        default:
            return {
                action: 'compare',
                href: '/compare',
                cta: 'Get Started'
            };
    }
}
