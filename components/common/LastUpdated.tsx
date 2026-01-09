import React from 'react';
import { Clock, RefreshCcw } from 'lucide-react';

interface LastUpdatedProps {
    date: string | Date;
    showIcon?: boolean;
    className?: string;
}

export function LastUpdated({ 
    date, 
    showIcon = true,
    className = ""
}: LastUpdatedProps) {
    const formattedDate = typeof date === 'string' 
        ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
            {showIcon && <Clock className="w-3.5 h-3.5" />}
            <span>Last updated: <strong>{formattedDate}</strong></span>
        </div>
    );
}

export default LastUpdated;
