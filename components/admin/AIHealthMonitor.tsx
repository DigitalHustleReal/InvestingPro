
"use client";

import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

interface HealthData {
    timestamp: string;
    providers: Record<string, {
        status: 'healthy' | 'degraded' | 'failing';
        lastError?: string;
        failureCount: number;
    }>;
}

export default function AIHealthMonitor() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchHealth = async () => {
        try {
            const res = await fetch('/api/admin/health');
            const data = await res.json();
            setHealth(data);
        } catch (e) {
            console.error("Failed to fetch AI health", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3 text-primary-400" />
                Provider Status:
            </span>
            <div className="flex gap-2">
                {health && Object.entries(health.providers).map(([name, data]) => {
                    const isHealthy = data.status === 'healthy';
                    const isDegraded = data.status === 'degraded';
                    
                    return (
                        <div key={name} className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5">
                            <span className="text-[10px] font-mono uppercase text-slate-400">{name}</span>
                            {isHealthy ? (
                                <CheckCircle2 className="w-2.5 h-2.5 text-primary-500" />
                            ) : isDegraded ? (
                                <AlertTriangle className="w-2.5 h-2.5 text-accent-500" />
                            ) : (
                                <RefreshCw className="w-2.5 h-2.5 text-danger-500 animate-spin" />
                            )}
                        </div>
                    );
                })}
            </div>
            {health && Object.values(health.providers).some(p => p.status === 'degraded') && (
                <div className="animate-pulse flex items-center gap-2 px-2 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-[10px] font-bold text-accent-500 uppercase">
                    Failover Active
                </div>
            )}
        </div>
    );
}
