"use client";

import { useExperimentContext } from '@/components/ab-testing/ExperimentProvider';

/**
 * Hook for A/B Testing
 * 
 * Usage:
 * const { variant, trackConversion } = useExperiment('button-color-test');
 * 
 * if (variant === 'red') {
 *   // Show red button
 * } else {
 *   // Show blue button (control)
 * }
 * 
 * // Track conversion
 * onClick={() => trackConversion()}
 */
export function useExperiment(experimentId: string) {
    const { getVariant, trackConversion } = useExperimentContext();
    
    const variant = getVariant(experimentId);
    
    const track = (value?: number) => {
        trackConversion(experimentId, value);
    };
    
    return {
        variant,
        trackConversion: track,
        isControl: variant === 'control',
        isVariant: (variantId: string) => variant === variantId
    };
}

/**
 * Hook for feature flags (simplified A/B test)
 * 
 * Usage:
 * const isEnabled = useFeatureFlag('new-checkout-flow');
 */
export function useFeatureFlag(featureId: string): boolean {
    const { variant } = useExperiment(featureId);
    return variant === 'enabled';
}
