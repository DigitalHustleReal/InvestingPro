"use client";

import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Bot, 
    CheckCircle2, 
    Clock, 
    AlertTriangle,
    XCircle,
    RefreshCw,
    Settings,
    Play,
    Pause,
    Eye,
    TrendingUp,
    Shield,
    Zap,
    BarChart3,
    ArrowUpRight,
    Search,
    ChevronRight
} from 'lucide-react';
import { ConfidenceIndicator, ScoreBadge } from '@/components/admin/ConfidenceIndicator';
import { AnomalyBadgeGroup, RiskIndicator } from '@/components/admin/AnomalyBadge';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AutonomyLevel {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
}

const AUTONOMY_LEVELS: AutonomyLevel[] = [
    { 
        id: 'manual', 
        name: 'Manual Control', 
        description: 'Human approval required for every action',
        icon: Shield,
        color: 'slate'
    },
    { 
        id: 'assisted', 
        name: 'AI Assisted', 
        description: 'AI suggests patterns, humans confirm',
        icon: Eye,
        color: 'blue'
    },
    { 
        id: 'semi-autonomous', 
        name: 'Semi-Autonomous', 
        description: 'Auto-publish high confidence (>90%)',
        icon: Zap,
        color: 'amber'
    },
    { 
        id: 'autonomous', 
        name: 'Fully Autonomous', 
        description: 'End-to-end auto generation & publishing',
        icon: Bot,
        color: 'teal'
    }
];

export default function AutonomyDashboardPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch autonomy config & stats
    const { data: configData, isLoading: configLoading, refetch: refetchConfig } = useQuery({
        queryKey: ['autonomy-config'],
        queryFn: async () => {
            const response = await fetch('/api/admin/autonomy/config');
            if (!response.ok) throw new Error('Failed to fetch config');
            return response.json();
        },
        refetchInterval: 30000,
    });

    // Fetch pending reviews
    const { data: pendingReviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['pending-reviews'],
        queryFn: async () => {
            // Fetch from real API when ready
            return [
                {
                    id: '1',
                    title: 'Best Credit Card for Groceries 2026',
                    category: 'credit-cards',
                    confidence: 0.88,
                    score: 82,
                    reason: 'Score below threshold',
                    anomalies: [
                        { type: 'compliance_risk' as const, severity: 'medium' as const, message: 'Missing disclaimer', requiresReview: true }
                    ],
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'SEBI New Regulations for MF',
                    category: 'mutual-funds',
                    confidence: 0.92,
                    score: 88,
                    reason: 'Sensitive category',
                    anomalies: [
                        { type: 'sensitive_content' as const, severity: 'high' as const, message: 'Regulatory', requiresReview: true }
                    ],
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                },
            ];
        }
    });

    const config = configData?.config || {};
    const stats = configData?.stats?.last7Days || { totalProcessed: 0, autoPublished: 0, rejected: 0, queuedForReview: 0 };
    const currentLevel = config?.autonomyLevel || 'semi-autonomous';

    // Mutation to change level
    const setLevelMutation = useMutation({
        mutationFn: async (level: string) => {
            const resp = await fetch('/api/admin/autonomy/config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setAutonomyLevel', level })
            });
            return resp.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['autonomy-config'] })
    });

    // Chart Data
    const pieData = [
        { name: 'Auto-Published', value: stats.autoPublished || 1, color: '#0d9488' },
        { name: 'Manual Review', value: stats.queuedForReview || 1, color: '#f59e0b' },
        { name: 'Rejected', value: stats.rejected || 0, color: '#e11d48' }
    ];

    const barData = [
        { name: '0.7', count: 12 },
        { name: '0.8', count: 25 },
        { name: '0.9', count: 42 },
        { name: '0.95', count: 18 },
        { name: '1.0', count: 5 }
    ];

    if (configLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <RefreshCw className="w-8 h-8 text-wt-gold animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wt-navy-800 to-wt-navy-950 border border-wt-border flex items-center justify-center shadow-xl">
                            <Bot className="w-8 h-8 text-wt-gold shadow-glow" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-wt-text tracking-tight">Autonomous Ops</h1>
                            <p className="text-wt-text-muted flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-wt-green animate-pulse" />
                                System Operating at Level: <span className="text-wt-gold font-bold uppercase">{currentLevel}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/autonomy/settings">
                            <Button variant="outline" className="gap-2 border-wt-border hover:bg-wt-surface-hover">
                                <Settings className="w-4 h-4" />
                                Configure Rules
                            </Button>
                        </Link>
                        <Button onClick={() => refetchConfig()} className="bg-wt-gold text-wt-navy-950 hover:bg-wt-gold/90">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Force Pulse
                        </Button>
                    </div>
                </div>

                {/* Autonomy Level Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {AUTONOMY_LEVELS.map((level) => {
                        const Icon = level.icon;
                        const isActive = currentLevel === level.id;
                        return (
                            <button
                                key={level.id}
                                onClick={() => setLevelMutation.mutate(level.id)}
                                disabled={setLevelMutation.isPending}
                                className={cn(
                                    "relative p-5 rounded-2xl border transition-all text-left group overflow-hidden",
                                    isActive 
                                        ? "bg-wt-navy-900 border-wt-gold shadow-[0_0_20px_rgba(232,189,122,0.15)] ring-1 ring-wt-gold/50" 
                                        : "bg-wt-card border-wt-border hover:border-wt-gold/30 hover:bg-wt-surface-hover shadow-sm"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                    isActive ? "bg-wt-gold text-wt-navy-950" : "bg-wt-surface text-wt-text-muted"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className={cn("font-bold mb-1", isActive ? "text-white" : "text-wt-text")}>{level.name}</h3>
                                <p className="text-xs text-wt-text-muted leading-tight">{level.description}</p>
                                {isActive && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-wt-gold text-wt-navy-950 text-[10px] font-black">ACTIVE</Badge>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Intelligence Matrix & Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Analytics */}
                    <Card className="lg:col-span-2 bg-wt-card border-wt-border overflow-hidden">
                        <CardHeader className="border-b border-wt-border/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-wt-text-muted flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-wt-gold" />
                                Logic Distribution (7D Velocity)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center pointer-events-none">
                                        <span className="text-2xl font-black text-wt-text tabular-nums">{stats.totalProcessed || 0}</span>
                                        <span className="text-[10px] text-wt-text-muted block uppercase font-bold tracking-tighter">Units</span>
                                    </div>
                                </div>

                                <div className="space-y-4 flex flex-col justify-center">
                                    {pieData.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-wt-surface/50 border border-wt-border/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-xs font-semibold text-wt-text-muted uppercase tracking-wider">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-wt-text">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meta Indicators */}
                    <div className="space-y-6">
                        <Card className="bg-wt-card border-wt-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-wt-text-muted uppercase tracking-[0.2em]">Average System Precision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-4xl font-black text-wt-gold tabular-nums tracking-tighter">
                                            {stats.avgConfidence ? Math.round(stats.avgConfidence * 100) : 92}%
                                        </span>
                                        <div className="flex items-center gap-1 text-wt-green text-[10px] font-bold pb-2">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +2.4%
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-wt-surface rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-wt-gold shadow-[0_0_10px_rgba(232,189,122,0.3)]" 
                                            style={{ width: `${stats.avgConfidence ? stats.avgConfidence * 100 : 92}%` }} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-gradient-to-br from-wt-navy-900 to-wt-navy-950 rounded-2xl border border-wt-gold/20 relative overflow-hidden group">
                           <Zap className="absolute -right-8 -bottom-8 w-32 h-32 text-wt-gold/5 group-hover:scale-110 transition-transform duration-700" />
                           <div className="relative z-10">
                               <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                                   <Shield className="w-4 h-4 text-wt-gold" />
                                   Risk Propagation
                               </h4>
                               <p className="text-xs text-wt-text-muted mb-4 leading-relaxed">System currently detecting low anomaly vectors across all nodes.</p>
                               <RiskIndicator level="low" size="sm" />
                           </div>
                        </div>
                    </div>
                </div>

                {/* Review Vector Table */}
                <Card className="bg-wt-card border-wt-border">
                    <CardHeader className="border-b border-wt-border/50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-wt-text">Editorial Review Vector</CardTitle>
                            <CardDescription>Items flagged by autonomous logic requiring human verification</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wt-text-muted" />
                            <input 
                                type="text"
                                placeholder="Search queue..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-wt-surface border border-wt-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-wt-gold/50"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-wt-border/30 bg-wt-surface/30">
                                        <th className="text-left px-6 py-4 text-[10px] font-bold text-wt-text-muted uppercase tracking-widest">Asset Details</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold text-wt-text-muted uppercase tracking-widest">Logic Score</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold text-wt-text-muted uppercase tracking-widest">Flag Hierarchy</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold text-wt-text-muted uppercase tracking-widest">Timestamp</th>
                                        <th className="text-right px-6 py-4 text-[10px] font-bold text-wt-text-muted uppercase tracking-widest">Tactical Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-wt-border/10">
                                    {pendingReviews.length > 0 ? (
                                        pendingReviews.map((item) => (
                                            <tr key={item.id} className="hover:bg-wt-surface/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-wt-text group-hover:text-wt-gold transition-colors">{item.title}</p>
                                                        <p className="text-[10px] uppercase font-bold text-wt-text-muted tracking-tighter mt-0.5">{item.category}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <ConfidenceIndicator score={item.score} confidence={item.confidence} size="sm" />
                                                        <span className="text-[10px] text-wt-danger font-medium">{item.reason}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <AnomalyBadgeGroup anomalies={item.anomalies} size="sm" />
                                                </td>
                                                <td className="px-6 py-4 text-xs tabular-nums text-wt-text-muted">
                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border border-wt-border hover:bg-wt-surface text-wt-text-muted">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" className="h-8 bg-wt-gold/10 text-wt-gold border border-wt-gold/20 hover:bg-wt-gold hover:text-wt-navy-950 font-bold text-[10px] uppercase">
                                                            Neutralize & Publish
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-wt-text-muted font-bold uppercase tracking-widest text-[10px]">
                                                Queue Neutralized. No Manual Logic Required.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

// Utility for cleaner class handling
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}


