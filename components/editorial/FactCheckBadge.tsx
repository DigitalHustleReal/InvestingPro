import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FactCheckBadgeProps {
    checkedBy: string;
    date?: string;
    variant?: 'inline' | 'card';
}

export function FactCheckBadge({ checkedBy, date, variant = 'inline' }: FactCheckBadgeProps) {
    if (variant === 'card') {
        return (
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                        Fact-Checked
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 ml-1">
                        by {checkedBy}
                    </span>
                    {date && (
                        <span className="text-emerald-600 dark:text-emerald-400 ml-1">
                            • {date}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Inline variant (default)
    return (
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">
                Fact-checked by {checkedBy}
            </span>
            {date && (
                <span className="text-emerald-600 dark:text-emerald-500">
                    • {date}
                </span>
            )}
        </div>
    );
}
