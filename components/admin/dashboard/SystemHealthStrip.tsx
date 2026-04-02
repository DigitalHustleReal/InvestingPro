"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Database, Server, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'healthy' | 'degraded' | 'error' | 'loading';

const STATUS_CLASSES = {
    healthy: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    degraded: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
    error: { bg: 'bg-error/10', text: 'text-error', dot: 'bg-error' },
    loading: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
};

interface HealthIndicatorProps {
    label: string;
    status: Status;
    icon: LucideIcon;
}

function HealthIndicator({ label, status, icon: Icon }: HealthIndicatorProps) {
    const colors = STATUS_CLASSES[status];
    
    return (
        <div className="bento-card flex items-center gap-3 p-3 transition-all hover:bg-white/5 cursor-default group">
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                colors.bg,
                colors.text
            )}>
                <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5 truncate">
                    {label}
                </p>

                <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", colors.dot)} />
                    <span className="text-[13px] font-extrabold text-white capitalize leading-none">
                        {status === 'loading' ? 'Checking...' : status}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function SystemHealthStrip({ variant = 'grid' }: { variant?: 'grid' | 'column' }) {
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
        <div className={cn(
            variant === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                : "flex flex-col gap-3",
            "animate-slide-up"
        )} style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
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
