"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
    Shield, 
    CheckCircle2, 
    Star, 
    Users, 
    Award,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustSignalsProps {
    variant?: 'compact' | 'full';
    showReviews?: boolean;
    showRatings?: boolean;
    showUserCount?: boolean;
    showBadges?: boolean;
    className?: string;
}

export default function TrustSignals({
    variant = 'full',
    showReviews = true,
    showRatings = true,
    showUserCount = true,
    showBadges = true,
    className
}: TrustSignalsProps) {
    // In production, fetch from API
    const stats = {
        totalUsers: 125000,
        totalReviews: 8500,
        averageRating: 4.6,
        verifiedProducts: 1200
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-4", className)}>
            {showUserCount && (
                <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {stats.totalUsers.toLocaleString()}+
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">Users</span>
                </div>
            )}

            {showRatings && (
                <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {stats.averageRating}
                        </span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">
                        ({stats.totalReviews.toLocaleString()} reviews)
                    </span>
                </div>
            )}

            {showReviews && variant === 'full' && (
                <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                        {stats.totalReviews.toLocaleString()} Verified Reviews
                    </span>
                </div>
            )}

            {showBadges && (
                <>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-primary-600" />
                        Verified
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-success-600" />
                        Trusted Platform
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-primary-600" />
                        {stats.verifiedProducts}+ Products
                    </Badge>
                </>
            )}
        </div>
    );
}

/**
 * Trust Badge Component
 * Displays a single trust badge
 */
export function TrustBadge({ 
    type, 
    label 
}: { 
    type: 'verified' | 'secure' | 'award' | 'rating';
    label?: string;
}) {
    const icons = {
        verified: CheckCircle2,
        secure: Shield,
        award: Award,
        rating: Star
    };

    const colors = {
        verified: 'text-success-600',
        secure: 'text-primary-600',
        award: 'text-yellow-600',
        rating: 'text-yellow-400'
    };

    const Icon = icons[type];
    const color = colors[type];

    return (
        <div className="flex items-center gap-2 text-sm">
            <Icon className={cn("w-4 h-4", color)} />
            {label && (
                <span className="text-slate-600 dark:text-slate-400">{label}</span>
            )}
        </div>
    );
}

/**
 * Social Proof Component
 * Shows user count, reviews, ratings
 */
export function SocialProof({ 
    users, 
    reviews, 
    rating 
}: { 
    users?: number;
    reviews?: number;
    rating?: number;
}) {
    return (
        <div className="flex items-center gap-6 text-sm">
            {users && (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="font-semibold">{users.toLocaleString()}+</span>
                    <span className="text-slate-500">users</span>
                </div>
            )}
            {reviews && (
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                    <span className="font-semibold">{reviews.toLocaleString()}</span>
                    <span className="text-slate-500">reviews</span>
                </div>
            )}
            {rating && (
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{rating}</span>
                </div>
            )}
        </div>
    );
}
