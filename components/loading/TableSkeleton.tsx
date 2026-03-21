/**
 * Table Skeleton Loader
 *
 * Loading placeholder for data tables (admin lists, comparison tables)
 */

'use client';

import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    cols?: number;
    showHeader?: boolean;
}

export function TableSkeleton({ rows = 5, cols = 4, showHeader = true }: TableSkeletonProps) {
    return (
        <div className="w-full animate-pulse">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {showHeader && (
                    <div className="flex gap-4 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        {Array.from({ length: cols }).map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-slate-200 dark:bg-slate-700 rounded"
                                style={{ width: `${Math.floor(100 / cols)}%` }}
                            />
                        ))}
                    </div>
                )}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Array.from({ length: rows }).map((_, rowIdx) => (
                        <div key={rowIdx} className="flex gap-4 px-4 py-3">
                            {Array.from({ length: cols }).map((_, colIdx) => (
                                <div
                                    key={colIdx}
                                    className="h-4 bg-slate-100 dark:bg-slate-700/60 rounded"
                                    style={{ width: `${Math.floor(100 / cols) - 2}%` }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
