/**
 * A/B Testing Module
 * 
 * Comprehensive A/B testing framework for InvestingPro.
 * Supports headline, CTA, copy, image, layout, and popup testing.
 * 
 * @example
 * // Client-side usage with hooks
 * import { useABTest, useActiveABTest } from '@/lib/ab-testing';
 * 
 * const { variant, trackImpression, trackConversion } = useActiveABTest('headline');
 * 
 * @example
 * // Server-side test creation
 * import { createABTest, getActiveTests } from '@/lib/analytics/ab-testing';
 * 
 * const test = await createABTest({
 *   name: 'Homepage Hero Test',
 *   element: 'headline',
 *   variants: [...],
 *   trafficSplit: 50,
 * });
 */

// Client-side hooks and utilities
export {
    useABTest,
    useActiveABTest,
    assignVariant,
    trackABEvent,
    type ABTest,
    type ABVariant,
} from './client';

// Re-export server-side utilities for convenience
export {
    createABTest,
    getVariantForUser,
    trackImpression,
    trackConversion,
    getTestResults,
    calculateStatisticalSignificance,
    isStatisticallySignificant,
    getActiveTests,
    stopTest,
} from '@/lib/analytics/ab-testing';
