/**
 * Lazy Loading Utilities
 * 
 * Provides utilities for lazy loading components and code splitting
 */

import { ComponentType, lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Lazy load a component with loading fallback
 */
export function lazyLoad<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ReactNode
) {
    const LazyComponent = lazy(importFn);
    
    return function LazyWrapper(props: any) {
        return (
            <Suspense fallback={fallback || <LoadingSpinner text="Loading..." />}>
                <LazyComponent {...props} />
            </Suspense>
        );
    };
}

/**
 * Lazy load admin components (heavy, not needed on public pages)
 */
export const LazyAdminDashboard = lazyLoad(
    () => import('@/components/admin/Dashboard'),
    <LoadingSpinner text="Loading admin dashboard..." />
);

export const LazyArticleEditor = lazyLoad(
    () => import('@/components/admin/ArticleEditor'),
    <LoadingSpinner text="Loading editor..." />
);

export const LazyAIContentGenerator = lazyLoad(
    () => import('@/components/admin/AIContentGenerator'),
    <LoadingSpinner text="Loading AI generator..." />
);

export const LazyWorkflowManager = lazyLoad(
    () => import('@/components/admin/WorkflowManager'),
    <LoadingSpinner text="Loading workflows..." />
);

/**
 * Lazy load calculator components (heavy, only needed on calculator pages)
 */
export const LazySIPCalculator = lazyLoad(
    () => import('@/components/calculators/SIPCalculator'),
    <LoadingSpinner text="Loading calculator..." />
);

export const LazyEMICalculator = lazyLoad(
    () => import('@/components/calculators/EMICalculator'),
    <LoadingSpinner text="Loading calculator..." />
);

export const LazyFDCalculator = lazyLoad(
    () => import('@/components/calculators/FDCalculator'),
    <LoadingSpinner text="Loading calculator..." />
);

export const LazyTaxCalculator = lazyLoad(
    () => import('@/components/calculators/TaxCalculator'),
    <LoadingSpinner text="Loading calculator..." />
);

export const LazyRetirementCalculator = lazyLoad(
    () => import('@/components/calculators/RetirementCalculator'),
    <LoadingSpinner text="Loading calculator..." />
);

/**
 * Lazy load chart/visualization components (heavy libraries)
 */
export const LazyChart = lazyLoad(
    () => import('@/components/charts/Chart'),
    <div className="h-64 bg-slate-100 animate-pulse rounded" />
);

export const LazyDataTable = lazyLoad(
    () => import('@/components/common/DataTable'),
    <LoadingSpinner text="Loading table..." />
);

/**
 * Lazy load markdown renderer (heavy library)
 */
export const LazyMarkdownRenderer = lazyLoad(
    () => import('@/components/common/MarkdownRenderer'),
    <LoadingSpinner text="Loading content..." />
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
