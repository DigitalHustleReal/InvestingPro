/**
 * Dashboard Skeleton Loader
 * 
 * Shows loading placeholder for dashboard stats
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StatCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
            </CardHeader>
            <CardContent>
                <div className="h-8 bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-20" />
            </CardContent>
        </Card>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}
