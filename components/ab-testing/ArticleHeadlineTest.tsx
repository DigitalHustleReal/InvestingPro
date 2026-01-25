"use client";

import React, { useEffect } from 'react';
import { useActiveABTest } from '@/lib/ab-testing/client';

interface ArticleHeadlineTestProps {
    /** Original article title as fallback */
    originalTitle: string;
    /** Article ID for tracking context */
    articleId?: string;
    /** Heading level */
    as?: 'h1' | 'h2' | 'h3';
    /** Additional class names */
    className?: string;
}

/**
 * ArticleHeadlineTest Component
 * 
 * Renders an article headline that can be A/B tested.
 * Automatically finds active headline test and shows appropriate variant.
 * 
 * @example
 * <ArticleHeadlineTest
 *   originalTitle={article.title}
 *   articleId={article.id}
 *   className="text-3xl font-bold"
 * />
 */
export function ArticleHeadlineTest({
    originalTitle,
    articleId,
    as: Component = 'h1',
    className,
}: ArticleHeadlineTestProps) {
    const { test, variant, isLoading, trackImpression } = useActiveABTest('headline');
    
    // Track impression when variant is determined
    useEffect(() => {
        if (!isLoading && variant) {
            trackImpression();
        }
    }, [isLoading, variant, trackImpression]);
    
    // Show original title while loading or if no test
    if (isLoading || !test || !variant) {
        return (
            <Component className={className}>
                {originalTitle}
            </Component>
        );
    }
    
    // Show variant content
    return (
        <Component 
            className={className}
            data-ab-test={test.id}
            data-ab-variant={variant.id}
            data-article={articleId}
        >
            {variant.content || originalTitle}
        </Component>
    );
}

interface CTAButtonTestProps {
    /** Original CTA text as fallback */
    originalText: string;
    /** Click handler */
    onClick?: () => void;
    /** Conversion value to track */
    conversionValue?: number;
    /** Additional class names */
    className?: string;
    /** Link href (if CTA is a link) */
    href?: string;
    /** Open in new tab */
    target?: '_blank' | '_self';
}

/**
 * CTAButtonTest Component
 * 
 * Renders a CTA button that can be A/B tested.
 * Automatically finds active CTA test and shows appropriate variant.
 * Tracks conversion on click.
 */
export function CTAButtonTest({
    originalText,
    onClick,
    conversionValue,
    className,
    href,
    target = '_self',
}: CTAButtonTestProps) {
    const { test, variant, isLoading, trackImpression, trackConversion } = useActiveABTest('cta');
    
    // Track impression when variant is determined
    useEffect(() => {
        if (!isLoading && variant) {
            trackImpression();
        }
    }, [isLoading, variant, trackImpression]);
    
    const handleClick = () => {
        if (variant) {
            trackConversion(conversionValue);
        }
        onClick?.();
    };
    
    const content = variant?.content || originalText;
    
    // Show original while loading or if no test
    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={handleClick}
                className={className}
                data-ab-test={test?.id}
                data-ab-variant={variant?.id}
            >
                {content}
            </a>
        );
    }
    
    return (
        <button
            onClick={handleClick}
            className={className}
            data-ab-test={test?.id}
            data-ab-variant={variant?.id}
        >
            {content}
        </button>
    );
}

export default ArticleHeadlineTest;
