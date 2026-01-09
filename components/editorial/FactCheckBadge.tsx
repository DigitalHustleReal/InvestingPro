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
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <div className="text-xs">
                    <span className="font-semibold text-primary-900 dark:text-primary-200">
                        Fact-Checked
                    </span>
                    <span className="text-primary-700 dark:text-primary-300 ml-1">
                        by {checkedBy}
                    </span>
                    {date && (
                        <span className="text-primary-600 dark:text-primary-400 ml-1">
                            • {date}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Inline variant (default)
    return (
        <div className="inline-flex items-center gap-1.5 text-xs text-primary-700 dark:text-primary-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">
                Fact-checked by {checkedBy}
            </span>
            {date && (
                <span className="text-primary-600 dark:text-primary-500">
                    • {date}
                </span>
            )}
        </div>
    );
}
