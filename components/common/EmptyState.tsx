"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Inbox, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export default function EmptyState({
    title = "No data available",
    description = "There's nothing to display here yet.",
    actionLabel,
    onAction,
    icon
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                {icon || <Inbox className="w-8 h-8 text-slate-400" />}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-center max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

