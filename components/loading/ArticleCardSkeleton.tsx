/**
 * Article Card Skeleton Loader
 * 
 * Shows loading placeholder for article cards
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ArticleCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="h-5 bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-700 rounded w-5/6" />
                    <div className="h-4 bg-slate-700 rounded w-4/6" />
                </div>
                <div className="flex gap-2 mt-4">
                    <div className="h-6 bg-slate-700 rounded w-20" />
                    <div className="h-6 bg-slate-700 rounded w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </div>
    );
}
