"use client";

import React, { useEffect } from 'react';
import { useABTest, ABTest, ABVariant } from '@/lib/ab-testing/client';

interface ABTestWrapperProps {
    /** The A/B test configuration */
    test: ABTest;
    /** User ID for consistent assignment (optional) */
    userId?: string;
    /** Render function that receives the assigned variant */
    children: (variant: ABVariant, actions: {
        trackConversion: (value?: number) => void;
    }) => React.ReactNode;
    /** Fallback content while loading */
    fallback?: React.ReactNode;
    /** Track impression automatically on mount */
    trackImpression?: boolean;
}

/**
 * ABTestWrapper Component
 * 
 * Wraps content that should be A/B tested, providing the assigned
 * variant and tracking functions to children.
 * 
 * @example
 * <ABTestWrapper test={headlineTest} trackImpression>
 *   {(variant, { trackConversion }) => (
 *     <h1 onClick={() => trackConversion()}>{variant.content}</h1>
 *   )}
 * </ABTestWrapper>
 */
export function ABTestWrapper({
    test,
    userId,
    children,
    fallback,
    trackImpression: shouldTrackImpression = true,
}: ABTestWrapperProps) {
    const { variant, isLoading, trackImpression, trackConversion } = useABTest(test, userId);
    
    // Track impression on mount
    useEffect(() => {
        if (shouldTrackImpression && variant && !isLoading) {
            trackImpression();
        }
    }, [shouldTrackImpression, variant, isLoading, trackImpression]);
    
    if (isLoading || !variant) {
        return <>{fallback}</>;
    }
    
    return <>{children(variant, { trackConversion })}</>;
}

interface HeadlineABTestProps {
    /** The A/B test configuration for headlines */
    test: ABTest;
    /** Default headline if no test or loading */
    defaultHeadline: string;
    /** Heading level */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Additional class names */
    className?: string;
    /** User ID for consistent assignment */
    userId?: string;
}

/**
 * HeadlineABTest Component
 * 
 * Specialized component for A/B testing headlines.
 * Automatically tracks impressions and provides click-based conversion.
 */
export function HeadlineABTest({
    test,
    defaultHeadline,
    as: Component = 'h1',
    className,
    userId,
}: HeadlineABTestProps) {
    return (
        <ABTestWrapper
            test={test}
            userId={userId}
            fallback={<Component className={className}>{defaultHeadline}</Component>}
        >
            {(variant) => (
                <Component 
                    className={className}
                    data-ab-test={test.id}
                    data-ab-variant={variant.id}
                >
                    {variant.content || defaultHeadline}
                </Component>
            )}
        </ABTestWrapper>
    );
}

interface CTAABTestProps {
    /** The A/B test configuration for CTAs */
    test: ABTest;
    /** Default CTA text if no test or loading */
    defaultText: string;
    /** Click handler */
    onClick?: () => void;
    /** Additional class names */
    className?: string;
    /** User ID for consistent assignment */
    userId?: string;
    /** Conversion value to track on click */
    conversionValue?: number;
}

/**
 * CTAABTest Component
 * 
 * Specialized component for A/B testing Call-to-Action buttons.
 * Tracks conversion on click.
 */
export function CTAABTest({
    test,
    defaultText,
    onClick,
    className,
    userId,
    conversionValue,
}: CTAABTestProps) {
    return (
        <ABTestWrapper
            test={test}
            userId={userId}
            fallback={
                <button className={className} onClick={onClick}>
                    {defaultText}
                </button>
            }
        >
            {(variant, { trackConversion }) => (
                <button
                    className={className}
                    data-ab-test={test.id}
                    data-ab-variant={variant.id}
                    onClick={() => {
                        trackConversion(conversionValue);
                        onClick?.();
                    }}
                >
                    {variant.content || defaultText}
                </button>
            )}
        </ABTestWrapper>
    );
}

export default ABTestWrapper;
