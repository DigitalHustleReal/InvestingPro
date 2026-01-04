"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { getVerificationBadge, formatRelativeTime, generateLastUpdated } from '@/lib/trust/trust-utils';

interface VerificationBadgeProps {
    verificationStatus: string;
    productId?: string;
    lastVerified?: Date;
    showDescription?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({ 
    verificationStatus, 
    productId,
    lastVerified,
    showDescription = false,
    size = 'md'
}: VerificationBadgeProps) {
    // Generate deterministic "last updated" if not provided
    const verifiedDate = lastVerified || generateLastUpdated(productId);
    const badge = getVerificationBadge(verificationStatus, verifiedDate);
    
    const IconComponent = {
        check: CheckCircle,
        clock: Clock,
        alert: AlertCircle
    }[badge.icon];

    const sizeClasses = {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5'
    };

    const iconSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4'
    };

    const colorClasses = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        slate: 'bg-slate-50 text-slate-600 border-slate-200'
    };

    if (showDescription) {
        return (
            <div className={`flex items-start gap-3 p-3 rounded-lg ${colorClasses[badge.color as keyof typeof colorClasses]}`}>
                <div className="mt-0.5">
                    <IconComponent className={iconSizeClasses[size]} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-0.5">{badge.label}</div>
                    <div className="text-xs opacity-80 leading-relaxed">{badge.description}</div>
                    <div className="text-[10px] font-medium mt-1 opacity-60">
                        {formatRelativeTime(verifiedDate)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Badge 
            variant="outline" 
            className={`${sizeClasses[size]} ${colorClasses[badge.color as keyof typeof colorClasses]} border font-semibold inline-flex items-center gap-1.5`}
        >
            <IconComponent className={iconSizeClasses[size]} />
            {badge.label}
        </Badge>
    );
}

/**
 * Last Updated Timestamp Component
 * Shows when product data was last verified/updated
 */
interface LastUpdatedProps {
    productId?: string;
    timestamp?: Date;
    variant?: 'subtle' | 'prominent';
}

export function LastUpdated({ productId, timestamp, variant = 'subtle' }: LastUpdatedProps) {
    const updatedDate = timestamp || generateLastUpdated(productId);
    const relativeTime = formatRelativeTime(updatedDate);

    if (variant === 'prominent') {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <Shield className="w-4 h-4 text-teal-600" />
                <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-700">{relativeTime}</div>
                    <div className="text-[10px] text-slate-500">Our team verifies data regularly</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{relativeTime}</span>
        </div>
    );
}
