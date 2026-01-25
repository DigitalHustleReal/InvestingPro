/**
 * Client-side A/B Testing
 * 
 * Provides hooks and utilities for A/B testing in React components.
 * Handles variant assignment, tracking, and persistence.
 */

"use client";

import { useEffect, useState, useCallback } from 'react';

export interface ABVariant {
    id: string;
    name: string;
    content: string;
    weight: number;
}

export interface ABTest {
    id: string;
    name: string;
    element: 'cta' | 'headline' | 'layout' | 'image' | 'copy' | 'popup';
    variants: ABVariant[];
    status: 'draft' | 'running' | 'paused' | 'completed';
    trafficSplit: number;
}

// Storage key for user variant assignments
const STORAGE_KEY = 'ab_test_assignments';

/**
 * Get or create a session ID for tracking
 */
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('ab_session_id');
    if (!sessionId) {
        sessionId = `ab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('ab_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Hash function for deterministic variant assignment
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Get stored variant assignments
 */
function getStoredAssignments(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Store variant assignment
 */
function storeAssignment(testId: string, variantId: string): void {
    if (typeof window === 'undefined') return;
    try {
        const assignments = getStoredAssignments();
        assignments[testId] = variantId;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch {
        // Ignore storage errors
    }
}

/**
 * Assign a variant to a user based on test configuration
 */
export function assignVariant(test: ABTest, userId?: string): ABVariant {
    // Check for stored assignment first (for consistency)
    const stored = getStoredAssignments();
    if (stored[test.id]) {
        const storedVariant = test.variants.find(v => v.id === stored[test.id]);
        if (storedVariant) return storedVariant;
    }
    
    // Generate deterministic seed
    const seed = userId || getSessionId() || Math.random().toString();
    const hash = hashString(seed + test.id);
    
    // First check if user is in test traffic
    const inTestTraffic = (hash % 100) < test.trafficSplit;
    
    if (!inTestTraffic || test.status !== 'running') {
        // User is in control group or test not running
        const control = test.variants.find(v => v.id === 'control' || v.name.toLowerCase().includes('control'));
        return control || test.variants[0];
    }
    
    // Assign based on variant weights
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    const randomValue = (hash % 1000) / 1000 * totalWeight;
    
    let cumulative = 0;
    for (const variant of test.variants) {
        cumulative += variant.weight;
        if (randomValue <= cumulative) {
            storeAssignment(test.id, variant.id);
            return variant;
        }
    }
    
    // Fallback to first variant
    const assigned = test.variants[0];
    storeAssignment(test.id, assigned.id);
    return assigned;
}

/**
 * Track an A/B test event (impression or conversion)
 */
export async function trackABEvent(
    testId: string,
    variantId: string,
    eventType: 'impression' | 'conversion',
    conversionValue?: number
): Promise<void> {
    try {
        await fetch('/api/ab-test/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                testId,
                variantId,
                eventType,
                sessionId: getSessionId(),
                conversionValue,
            }),
        });
    } catch (error) {
        // Silently fail - don't block user experience
        console.debug('Failed to track A/B event', error);
    }
}

/**
 * Hook to use A/B testing in components
 */
export function useABTest(test: ABTest | null, userId?: string): {
    variant: ABVariant | null;
    isLoading: boolean;
    trackImpression: () => void;
    trackConversion: (value?: number) => void;
} {
    const [variant, setVariant] = useState<ABVariant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [impressionTracked, setImpressionTracked] = useState(false);
    
    useEffect(() => {
        if (!test) {
            setIsLoading(false);
            return;
        }
        
        const assigned = assignVariant(test, userId);
        setVariant(assigned);
        setIsLoading(false);
    }, [test, userId]);
    
    const trackImpression = useCallback(() => {
        if (!test || !variant || impressionTracked) return;
        trackABEvent(test.id, variant.id, 'impression');
        setImpressionTracked(true);
    }, [test, variant, impressionTracked]);
    
    const trackConversion = useCallback((value?: number) => {
        if (!test || !variant) return;
        trackABEvent(test.id, variant.id, 'conversion', value);
    }, [test, variant]);
    
    return { variant, isLoading, trackImpression, trackConversion };
}

/**
 * Hook to fetch and use an active A/B test by element type
 */
export function useActiveABTest(element: ABTest['element']): {
    test: ABTest | null;
    variant: ABVariant | null;
    isLoading: boolean;
    trackImpression: () => void;
    trackConversion: (value?: number) => void;
} {
    const [test, setTest] = useState<ABTest | null>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    
    useEffect(() => {
        async function fetchTest() {
            try {
                const response = await fetch(`/api/ab-test/active?element=${element}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.test) {
                        setTest(data.test);
                    }
                }
            } catch (error) {
                console.debug('Failed to fetch A/B test', error);
            } finally {
                setFetchLoading(false);
            }
        }
        fetchTest();
    }, [element]);
    
    const { variant, isLoading: variantLoading, trackImpression, trackConversion } = useABTest(test);
    
    return {
        test,
        variant,
        isLoading: fetchLoading || variantLoading,
        trackImpression,
        trackConversion,
    };
}
