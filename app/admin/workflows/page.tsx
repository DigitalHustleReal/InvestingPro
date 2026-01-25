"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { 
    Workflow,
    Play,
    Pause,
    Plus,
    RefreshCw,
    Settings,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Zap,
    FileText,
    Eye,
    MoreVertical,
    TrendingUp
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import Link from 'next/link';

interface WorkflowItem {
    id: string;
    name: string;
    description?: string;
    is_enabled: boolean;
    is_system: boolean;
    trigger_type: string;
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    last_run_at?: string;
    created_at: string;
    tags: string[];
}

export default function WorkflowsPage() {
    const queryClient = useQueryClient();
    const supabase = createClient();
    const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

    // Fetch workflows
    const { data: workflows = [], isLoading, refetch } = useQuery({
        queryKey: ['workflows', filter],
        queryFn: async () => {
            let query = supabase
                .from('workflows')
                .select('*')
                .order('priority', { ascending: false });

            if (filter === 'enabled') {
                query = query.eq('is_enabled', true);
            } else if (filter === 'disabled') {
                query = query.eq('is_enabled', false);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching workflows:', error);
                return [];
            }
            return data as WorkflowItem[];
        },
    });

    // Toggle workflow
    const toggleMutation = useMutation({
        mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
            const { error } = await supabase
                .from('workflows')
                .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
    });

    // Delete workflow
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('workflows')
                .delete()
                .eq('id', id)
                .eq('is_system', false);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
    });

    // Run workflow manually
    const runMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch('/api/admin/workflows/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workflowId: id }),
            });
            if (!response.ok) throw new Error('Failed to run workflow');
            return response.json();
        },
    });

    const getTriggerLabel = (type: string) => {
        const labels: Record<string, string> = {
            article_created: 'Article Created',
            article_updated: 'Article Updated',
            article_status_changed: 'Status Changed',
            quality_passed: 'Quality Passed',
            quality_failed: 'Quality Failed',
            scheduled: 'Scheduled',
            manual: 'Manual',
            webhook: 'Webhook',
            scraper_completed: 'Scraper Done',
            revenue_threshold: 'Revenue Alert',
        };
        return labels[type] || type;
    };

    const getTriggerColor = (type: string) => {
        const colors: Record<string, string> = {
            article_created: 'bg-primary-500/20 text-primary-400',
            article_updated: 'bg-secondary-500/20 text-secondary-400',
            article_status_changed: 'bg-accent-500/20 text-accent-400',
            quality_passed: 'bg-success-500/20 text-success-400',
            quality_failed: 'bg-danger-500/20 text-danger-400',
            scheduled: 'bg-warning-500/20 text-warning-400',
            manual: 'bg-slate-500/20 text-slate-400',
            webhook: 'bg-violet-500/20 text-violet-400',
        };
        return colors[type] || 'bg-muted/20 text-muted-foreground';
    };

    const getSuccessRate = (workflow: WorkflowItem) => {
        if (workflow.total_runs === 0) return null;
        return Math.round((workflow.successful_runs / workflow.total_runs) * 100);
    };

    // Stats
    const enabledCount = workflows.filter(w => w.is_enabled).length;
    const totalRuns = workflows.reduce((sum, w) => sum + w.total_runs, 0);
    const avgSuccessRate = workflows.length > 0
        ? Math.round(workflows.reduce((sum, w) => {
            const rate = getSuccessRate(w);
            return sum + (rate !== null ? rate : 100);
        }, 0) / workflows.length)
        : 100;

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                <AdminBreadcrumb />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/25 flex items-center justify-center">
                            <Workflow className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Workflows
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Automate content operations with no-code workflows
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => refetch()} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Link href="/admin/workflows/new">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Workflow
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Workflow className="w-5 h-5 text-violet-400" />
                                <Badge variant="outline" className="text-xs">Total</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {workflows.length}
                            </div>
                            <p className="text-xs text-muted-foreground">Workflows created</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success-500/10 to-success-600/5 border-success-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Play className="w-5 h-5 text-success-400" />
                                <Badge variant="outline" className="text-xs">Active</Badge>
                            </div>
                            <div className="text-3xl font-bold text-success-400 mb-1">
                                {enabledCount}
                            </div>
                            <p className="text-xs text-muted-foreground">Enabled workflows</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary-500/10 to-primary-600/5 border-primary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Zap className="w-5 h-5 text-primary-400" />
                                <Badge variant="outline" className="text-xs">Runs</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {totalRuns}
                            </div>
                            <p className="text-xs text-muted-foreground">Total executions</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/5 border-secondary-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <TrendingUp className="w-5 h-5 text-secondary-400" />
                                <Badge variant="outline" className="text-xs">Success</Badge>
                            </div>
                            <div className="text-3xl font-bold text-foreground mb-1">
                                {avgSuccessRate}%
                            </div>
                            <p className="text-xs text-muted-foreground">Average success rate</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'enabled', 'disabled'] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className="capitalize"
                        >
                            {f === 'all' ? 'All Workflows' : f}
                        </Button>
                    ))}
                </div>

                {/* Workflows List */}
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="text-center py-12 text-muted-foreground">
                                Loading workflows...
                            </div>
                        ) : workflows.length === 0 ? (
                            <div className="text-center py-12">
                                <Workflow className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-4">No workflows found</p>
                                <Link href="/admin/workflows/new">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Your First Workflow
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {workflows.map((workflow) => {
                                    const successRate = getSuccessRate(workflow);
                                    return (
                                        <div 
                                            key={workflow.id}
                                            className="p-4 hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    {/* Enable/Disable Toggle */}
                                                    <button
                                                        onClick={() => toggleMutation.mutate({ 
                                                            id: workflow.id, 
                                                            enabled: !workflow.is_enabled 
                                                        })}
                                                        disabled={toggleMutation.isPending}
                                                        className={`w-10 h-6 rounded-full transition-colors relative ${
                                                            workflow.is_enabled 
                                                                ? 'bg-success-500' 
                                                                : 'bg-muted/50'
                                                        }`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                                                            workflow.is_enabled ? 'left-5' : 'left-1'
                                                        }`} />
                                                    </button>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Link 
                                                                href={`/admin/workflows/${workflow.id}`}
                                                                className="font-medium text-foreground hover:text-primary-400 truncate"
                                                            >
                                                                {workflow.name}
                                                            </Link>
                                                            {workflow.is_system && (
                                                                <Badge className="bg-slate-500/20 text-slate-400">
                                                                    System
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <Badge className={getTriggerColor(workflow.trigger_type)}>
                                                                {getTriggerLabel(workflow.trigger_type)}
                                                            </Badge>
                                                            {workflow.description && (
                                                                <span className="truncate max-w-[200px]">
                                                                    {workflow.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="hidden md:flex items-center gap-6 text-sm">
                                                        <div className="text-center">
                                                            <div className="font-medium text-foreground">
                                                                {workflow.total_runs}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">Runs</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className={`font-medium ${
                                                                successRate === null ? 'text-muted-foreground' :
                                                                successRate >= 90 ? 'text-success-400' :
                                                                successRate >= 70 ? 'text-warning-400' :
                                                                'text-danger-400'
                                                            }`}>
                                                                {successRate !== null ? `${successRate}%` : '-'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">Success</div>
                                                        </div>
                                                        {workflow.last_run_at && (
                                                            <div className="text-center">
                                                                <div className="font-medium text-foreground text-xs">
                                                                    {new Date(workflow.last_run_at).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">Last Run</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 ml-4">
                                                    {workflow.trigger_type === 'manual' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => runMutation.mutate(workflow.id)}
                                                            disabled={runMutation.isPending || !workflow.is_enabled}
                                                            className="gap-1"
                                                        >
                                                            <Play className="w-3 h-3" />
                                                            Run
                                                        </Button>
                                                    )}
                                                    <Link href={`/admin/workflows/${workflow.id}`}>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                    {!workflow.is_system && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Delete this workflow?')) {
                                                                    deleteMutation.mutate(workflow.id);
                                                                }
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-danger-400" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Templates */}
                <Card className="bg-card/50 border-border/50 mt-8">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-400" />
                            Quick Start Templates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    name: 'Auto-Publish High Quality',
                                    description: 'Publish articles with 85+ quality score automatically',
                                    trigger: 'quality_passed',
                                },
                                {
                                    name: 'Review Notification',
                                    description: 'Get notified when articles need review',
                                    trigger: 'article_status_changed',
                                },
                                {
                                    name: 'Daily Content Check',
                                    description: 'Run daily checks for stale content',
                                    trigger: 'scheduled',
                                },
                            ].map((template, i) => (
                                <Link 
                                    key={i}
                                    href={`/admin/workflows/new?template=${i}`}
                                    className="p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors"
                                >
                                    <h4 className="font-medium text-foreground mb-1">{template.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                                    <Badge className={getTriggerColor(template.trigger)}>
                                        {getTriggerLabel(template.trigger)}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
