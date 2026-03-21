/**
 * Product Card Skeleton Loaders
 *
 * Loading placeholders for product comparison cards (credit cards, loans, mutual funds)
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProductCardSkeleton() {
    return (
        <Card className="animate-pulse border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <div className="h-12 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-1">
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
                    <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
