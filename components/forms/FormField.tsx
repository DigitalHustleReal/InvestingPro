/**
 * FormField Component
 * 
 * Reusable form field with validation and error display
 */

'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    helperText?: string;
    showCharCount?: boolean;
    maxLength?: number;
    currentLength?: number;
    children: React.ReactNode;
    className?: string;
}

export function FormField({
    label,
    name,
    error,
    required = false,
    helperText,
    showCharCount = false,
    maxLength,
    currentLength,
    children,
    className,
}: FormFieldProps) {
    const hasError = !!error;
    const charCount = currentLength || 0;

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between">
                <Label htmlFor={name} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-danger-500')}>
                    {label}
                </Label>
                {showCharCount && maxLength && (
                    <span
                        className={cn(
                            'text-xs text-slate-500',
                            charCount > maxLength * 0.9 && 'text-warning-500',
                            charCount > maxLength && 'text-danger-500'
                        )}
                    >
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>

            <div className="relative">
                {children}
                {hasError && (
                    <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-danger-500 text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {helperText && !hasError && (
                <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            )}

            {hasError && (
                <div className="mt-6" aria-live="polite" aria-atomic="true">
                    {/* Error message already shown above */}
                </div>
            )}
        </div>
    );
}
