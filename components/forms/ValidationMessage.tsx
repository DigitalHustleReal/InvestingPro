/**
 * Validation Message Component
 * 
 * Displays inline validation errors
 */

'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ValidationMessageProps {
    error?: string;
    success?: string;
    className?: string;
    id?: string; // For aria-describedby
}

export function ValidationMessage({ error, success, className, id }: ValidationMessageProps) {
    if (!error && !success) return null;

    return (
        <div
            id={id}
            className={cn(
                'flex items-center gap-2 text-sm mt-1',
                error && 'text-danger-500',
                success && 'text-success-500',
                className
            )}
            role="alert"
            aria-live="polite"
        >
            {error && <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
            {success && <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
            <span>{error || success}</span>
        </div>
    );
}
