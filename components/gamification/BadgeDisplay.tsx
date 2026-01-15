"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    Award,
    Target,
    Flame,
    ShieldCheck,
    Zap,
    Star
} from "lucide-react";

interface BadgeDisplayProps {
    badges: string[];
    showTooltip?: boolean;
}

const BADGE_CONFIG: Record<string, { icon: any, color: string, bg: string }> = {
    'Beta Tester': { icon: Zap, color: 'text-secondary-600', bg: 'bg-secondary-50' },
    'Pioneer': { icon: Target, color: 'text-primary-600', bg: 'bg-secondary-50' },
    'Top Contributor': { icon: Star, color: 'text-accent-600', bg: 'bg-accent-50' },
    'Expert Reviewer': { icon: ShieldCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
    'Power Trader': { icon: Flame, color: 'text-danger-600', bg: 'bg-danger-50' },
    'Certified Pro': { icon: Award, color: 'text-primary-600', bg: 'bg-primary-50' }
};

export default function BadgeDisplay({ badges = [], showTooltip = false }: BadgeDisplayProps) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badgeName) => {
                const config = BADGE_CONFIG[badgeName] || { icon: Award, color: 'text-slate-600', bg: 'bg-slate-50' };
                const Icon = config.icon;

                return (
                    <Badge
                        key={badgeName}
                        className={`${config.bg} ${config.color} border-0 rounded-xl px-3 py-1.5 flex items-center gap-2 hover:scale-105 transition-transform`}
                        title={showTooltip ? badgeName : undefined}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold uppercase tracking-st">{badgeName}</span>
                    </Badge>
                );
            })}
        </div>
    );
}
