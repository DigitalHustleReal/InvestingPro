"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Database, Server, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'healthy' | 'degraded' | 'error' | 'loading';

const STATUS_CLASSES = {
    healthy: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    error: { bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-400' },
    loading: { bg: 'bg-slate-500/10', text: 'text-slate-300', dot: 'bg-slate-400' },
};

interface HealthIndicatorProps {
    label: string;
    status: Status;
    icon: LucideIcon;
}

function HealthIndicator({ label, status, icon: Icon }: HealthIndicatorProps) {
    const colors = STATUS_CLASSES[status];
    
    return (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm transition-all hover:shadow-md hover:border-white/15 cursor-default">
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                colors.bg,
                colors.text
            )}>
                <Icon className="w-5 h-5" />
            </div>

            <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {label}
                </p>

                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
                    <span className="text-sm font-bold text-slate-200 capitalize">
                        {status === 'loading' ? 'Checking…' : status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function SystemHealthStrip() {
    const { data: healthData, isLoading: healthLoading } = useQuery({
        queryKey: ['cms-health'],
        queryFn: async () => {
            const res = await fetch('/api/cms/health');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        refetchInterval: 30000,
    });

    const { data: budgetData, isLoading: budgetLoading } = useQuery({
        queryKey: ['daily-budget'],
        queryFn: async () => {
            const res = await fetch('/api/cms/budget');
            if (!res.ok) throw new Error('Failed');
            return res.json();
        },
        refetchInterval: 60000,
    });

    const dbStatus: Status = healthData?.status === 'error' ? 'error' : 'healthy';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <HealthIndicator
                label="CMS Pipeline"
                status={healthLoading ? 'loading' : (healthData?.health?.overall === 'healthy' ? 'healthy' : 'degraded')}
                icon={Activity}
            />
            <HealthIndicator
                label="Database"
                status={healthLoading ? 'loading' : dbStatus}
                icon={Database}
            />
            <HealthIndicator
                label="Budget Governor"
                status={budgetLoading ? 'loading' : (budgetData?.budget?.paused ? 'degraded' : 'healthy')}
                icon={Server}
            />
        </div>
    );
}
