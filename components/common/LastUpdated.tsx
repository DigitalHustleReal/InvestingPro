'use client';

import React, { useState, useEffect } from 'react';
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
    const [formattedDate, setFormattedDate] = useState<string>('');

    useEffect(() => {
        // Format date on client side only to avoid hydration mismatch
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const formatted = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        setFormattedDate(formatted);
    }, [date]);

    // Show placeholder during SSR to match client
    if (!formattedDate) {
        return (
            <div className={`flex items-center gap-2 text-xs text-gray-500 ${className}`}>
                {showIcon && <Clock className="w-3.5 h-3.5" />}
                <span>Last updated: <strong>—</strong></span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 text-xs text-gray-500 ${className}`}>
            {showIcon && <Clock className="w-3.5 h-3.5" />}
            <span>Last updated: <strong>{formattedDate}</strong></span>
        </div>
    );
}

export default LastUpdated;
