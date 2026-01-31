"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    FileText,
    TrendingUp,
    Shield,
    Zap,
    BarChart3
} from 'lucide-react';
import { ConfidenceIndicator, AutoPublishIndicator } from '@/components/admin/ConfidenceIndicator';
import { AnomalySummary, RiskIndicator } from '@/components/admin/AnomalyBadge';
import Link from 'next/link';

interface AutonomyStats {
    totalProcessed: number;
    autoPublished: number;
    queuedForReview: number;
    rejected: number;
    skipped: number;
    avgConfidence: number;
    lastProcessed: string | null;
}

interface PendingReview {
    id: string;
    title: string;
    category: string;
    confidence: number;
    score: number;
    reason: string;
    flags: { type: string; severity: string; message: string }[];
    createdAt: string;
}

export default function AutonomyDashboardPage() {
    const queryClient = useQueryClient();
    const [autonomyLevel, setAutonomyLevel] = useState<string>('semi-autonomous');

    // Fetch autonomy config
    const { data: configData, isLoading: configLoading, refetch: refetchConfig } = useQuery({
        queryKey: ['autonomy-config'],
        queryFn: async () => {
            const response = await fetch('/api/admin/autonomy/config');
            if (!response.ok) {
                return {
                    config: {
                        autonomyLevel: 'semi-autonomous',
                        autoPublish: { enabled: true, dryRun: false },
                    },
                    stats: { last7Days: { totalProcessed: 0, autoPublished: 0, queuedForReview: 0, rejected: 0, avgConfidence: 0 } },
                    presets: {},
                };
            }
            return response.json();
        },
        refetchInterval: 30000,
    });

    // Fetch pending reviews from approval queue
    const { data: pendingReviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['pending-reviews'],
        queryFn: async () => {
            // This would fetch from approval_queue table
            // For now, return mock data
            return [
                {
                    id: '1',
                    title: 'Best Credit Card for Groceries 2026',
                    category: 'credit-cards',
                    confidence: 78,
                    score: 82,
                    reason: 'Score below auto-publish threshold',
                    flags: [{ type: 'compliance_risk', severity: 'medium', message: 'Missing disclaimer' }],
                    createdAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    title: 'SEBI New Regulations for MF',
                    category: 'mutual-funds',
                    confidence: 85,
                    score: 88,
                    reason: 'Category requires expert review',
                    flags: [{ type: 'sensitive_content', severity: 'high', message: 'Regulatory content' }],
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                },
            ];
        },
        refetchInterval: 30000,
    });

    // Mutation to change autonomy level
    const changeLevel = useMutation({
        mutationFn: async (level: string) => {
            const response = await fetch('/api/admin/autonomy/config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setAutonomyLevel', level }),
            });
            if (!response.ok) throw new Error('Failed to update');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autonomy-config'] });
        },
    });

    // Toggle auto-publish
    const toggleAutoPublish = useMutation({
        mutationFn: async (enabled: boolean) => {
            const response = await fetch('/api/admin/autonomy/config', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: enabled ? 'enableAutoPublish' : 'disableAutoPublish' }),
            });
            if (!response.ok) throw new Error('Failed to update');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autonomy-config'] });
        },
    });

    const config = configData?.config || {};
    const stats = configData?.stats?.last7Days || {};
    const presets = configData?.presets || {};
    const isAutoPublishEnabled = config?.autoPublish?.enabled ?? true;

    const getStatusColor = (level: string) => {
        switch (level) {
            case 'autonomous': return 'bg-success-500/20 text-success-400 border-success-500/30';
            case 'semi-autonomous': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
            case 'assisted': return 'bg-warning-500/20 text-warning-400 border-warning-500/30';
            case 'manual': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
            default: return 'bg-muted/20 text-muted-foreground border-muted/30';
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 flex items-center justify-center">
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Autonomous Operations
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Monitor auto-publish activity and review exceptions
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => refetchConfig()} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Link href="/admin/autonomy/settings">
                            <Button variant="outline" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Autonomy Level Controls */}
                <Card className="bg-card/50 border-border/50 mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Autonomy Level:</span>
                                    <Badge className={getStatusColor(config.autonomyLevel || 'semi-autonomous')}>
                                        {(config.autonomyLevel || 'semi-autonomous').replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </Badge>
                                </div>
                                <div className="h-6 w-px bg-border" />
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Auto-Publish:</span>
                                    <Badge className={isAutoPublishEnabled ? 'bg-success-500/20 text-success-400' : 'bg-slate-500/20 text-slate-400'}>
                                        {isAutoPublishEnabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleAutoPublish.mutate(!isAutoPublishEnabled)}
                                    disabled={toggleAutoPublish.isPending}
                                    className="gap-2"
                                >
                                    {isAutoPublishEnabled ? (
                                        <>
                                            <Pause className="w-4 h-4" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Enable
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <FileText className="w-5 h-5 text-primary-400" />
                                <Badge variant="outline" className="text-xs">7 Days</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {configLoading ? '...' : stats.totalProcessed || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Total Processed</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Auto</Badge>
                            </div>
                            <div className="text-3xl font-bold text-success-400 mb-1">
                                {configLoading ? '...' : stats.autoPublished || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Auto Published</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-warning-500/10 to-warning-600/5 border-warning-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Clock className="w-5 h-5 text-warning-400" />
                                <Badge variant="outline" className="text-xs">Queue</Badge>
                            </div>
                            <div className="text-3xl font-bold text-warning-400 mb-1">
                                {configLoading ? '...' : stats.queuedForReview || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Queued for Review</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-danger-500/10 to-danger-600/5 border-danger-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <XCircle className="w-5 h-5 text-danger-400" />
                                <Badge variant="outline" className="text-xs">Rejected</Badge>
                            </div>
                            <div className="text-3xl font-bold text-danger-400 mb-1">
                                {configLoading ? '...' : stats.rejected || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Rejected</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 border-secondary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <TrendingUp className="w-5 h-5 text-secondary-400" />
                                <Badge variant="outline" className="text-xs">Avg</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {configLoading ? '...' : `${stats.avgConfidence || 0}%`}
                            </div>
                            <p className="text-xs text-muted-foreground">Avg Confidence</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Exception Review Queue & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Exception Review Queue */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-warning-400" />
                                    Needs Your Attention
                                </div>
                                <Badge variant="outline">{pendingReviews.length} items</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reviewsLoading ? (
                                <div className="text-center py-8 text-muted-foreground">Loading...</div>
                            ) : pendingReviews.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-success-400 opacity-50" />
                                    <p className="text-muted-foreground">All caught up! No items need review.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingReviews.map((item: PendingReview) => (
                                        <div 
                                            key={item.id}
                                            className="p-4 bg-muted/10 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0 mr-4">
                                                    <h4 className="font-medium text-foreground truncate">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {item.category} • {new Date(item.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <ConfidenceIndicator 
                                                    score={item.score} 
                                                    confidence={item.confidence / 100}
                                                    size="sm"
                                                    variant="compact"
                                                />
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {item.reason}
                                                    </p>
                                                    <AnomalySummary
                                                        count={item.flags.length}
                                                        overallRisk={item.flags[0]?.severity as any || 'low'}
                                                        size="sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" className="bg-success-600 hover:bg-success-700">
                                                        Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Autonomy Presets */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-400" />
                                Autonomy Presets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { level: 'manual', name: 'Manual', desc: 'All articles require human review', risk: 'None' },
                                    { level: 'assisted', name: 'Assisted', desc: 'AI suggests, you approve (dry-run)', risk: 'Low' },
                                    { level: 'semi-autonomous', name: 'Semi-Autonomous', desc: 'Auto-publish high-confidence (>95%)', risk: 'Medium' },
                                    { level: 'autonomous', name: 'Autonomous', desc: 'Auto-publish most content (>85%)', risk: 'Higher' },
                                ].map((preset) => (
                                    <button
                                        key={preset.level}
                                        onClick={() => changeLevel.mutate(preset.level)}
                                        disabled={changeLevel.isPending}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                                            config.autonomyLevel === preset.level
                                                ? 'bg-primary-500/20 border-primary-500/50'
                                                : 'bg-muted/10 border-border/50 hover:bg-muted/20'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-foreground">{preset.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                Risk: {preset.risk}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{preset.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* How It Works */}
                <Card className="bg-card/50 border-border/50 mt-8">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent-400" />
                            How Auto-Publish Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-3">
                                    <FileText className="w-6 h-6 text-primary-400" />
                                </div>
                                <h4 className="font-medium text-foreground mb-1">1. Article Created</h4>
                                <p className="text-sm text-muted-foreground">AI generates content based on topic</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center mx-auto mb-3">
                                    <BarChart3 className="w-6 h-6 text-secondary-400" />
                                </div>
                                <h4 className="font-medium text-foreground mb-1">2. Confidence Scored</h4>
                                <p className="text-sm text-muted-foreground">Quality, SEO, and pattern analysis</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-warning-500/20 flex items-center justify-center mx-auto mb-3">
                                    <AlertTriangle className="w-6 h-6 text-warning-400" />
                                </div>
                                <h4 className="font-medium text-foreground mb-1">3. Anomaly Check</h4>
                                <p className="text-sm text-muted-foreground">Detect issues and compliance risks</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-success-400" />
                                </div>
                                <h4 className="font-medium text-foreground mb-1">4. Decision</h4>
                                <p className="text-sm text-muted-foreground">Auto-publish or queue for review</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
