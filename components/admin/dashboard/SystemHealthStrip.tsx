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
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md cursor-default">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                colors.bg,
                colors.text
            )}>
                <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {label}
                </p>

                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", colors.dot)} />
                    <span className="text-base font-bold text-foreground capitalize">
                        {status === 'loading' ? 'Checking...' : status}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
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
