/**
 * Lazy Loading Utilities
 *
 * Provides utilities for lazy loading components and code splitting
 */

import { ComponentType, lazy, Suspense, ReactNode } from 'react';
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Lazy load a component with loading fallback
 */
export function lazyLoad<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: ReactNode
) {
    const LazyComponent = lazy(importFn);

    return function LazyWrapper(props: any) {
        const defaultFallback = React.createElement(LoadingSpinner, { text: "Loading..." });
        return React.createElement(
            Suspense,
            { fallback: fallback || defaultFallback },
            React.createElement(LazyComponent, props)
        );
    };
}

/**
 * Lazy load admin components (heavy, not needed on public pages)
 */
export const LazyArticleEditor = lazyLoad(
    () => import('@/components/admin/ArticleEditor'),
    React.createElement(LoadingSpinner, { text: "Loading editor..." })
);

export const LazyAIContentGenerator = lazyLoad(
    () => import('@/components/admin/AIContentGenerator'),
    React.createElement(LoadingSpinner, { text: "Loading AI generator..." })
);

/**
 * Lazy load calculator components (heavy, only needed on calculator pages)
 */
export const LazySIPCalculator = lazyLoad(
    () => import('@/components/calculators/SIPCalculator').then(m => ({ default: m.SIPCalculator as any })),
    React.createElement(LoadingSpinner, { text: "Loading calculator..." })
);

export const LazyFDCalculator = lazyLoad(
    () => import('@/components/calculators/FDCalculator').then(m => ({ default: m.FDCalculator as any })),
    React.createElement(LoadingSpinner, { text: "Loading calculator..." })
);

export const LazyTaxCalculator = lazyLoad(
    () => import('@/components/calculators/TaxCalculator').then(m => ({ default: m.TaxCalculator as any })),
    React.createElement(LoadingSpinner, { text: "Loading calculator..." })
);

export const LazyRetirementCalculator = lazyLoad(
    () => import('@/components/calculators/RetirementCalculator').then(m => ({ default: m.RetirementCalculator as any })),
    React.createElement(LoadingSpinner, { text: "Loading calculator..." })
);

/**
 * Preload component (for critical paths)
 */
export function preloadComponent(importFn: () => Promise<any>) {
    if (typeof window !== 'undefined') {
        // Preload on mouseover or focus
        const preload = () => {
            importFn().catch(() => {
                // Ignore errors
            });
        };

        return {
            onMouseEnter: preload,
            onFocus: preload,
        };
    }
    return {};
}
