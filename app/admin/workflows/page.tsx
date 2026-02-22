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
    TrendingUp,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
            manual: 'bg-slate-500/20 text-slate-300',
            webhook: 'bg-violet-500/20 text-violet-400',
        };
        return colors[type] || 'bg-muted/20 text-muted-foreground';
    };

    const getSuccessRate = (workflow: WorkflowItem) => {
        if (workflow.total_runs === 0) return null;
        return Math.round((workflow.successful_runs / workflow.total_runs) * 100);
    };

    // Stats
    const workflowList = Array.isArray(workflows) ? workflows : [];
    const enabledCount = workflowList.filter(w => w.is_enabled).length;
    const totalRuns = workflowList.reduce((sum, w) => sum + w.total_runs, 0);
    const avgSuccessRate = workflowList.length > 0
        ? Math.round(workflowList.reduce((sum, w) => {
            const rate = getSuccessRate(w);
            return sum + (rate !== null ? rate : 100);
        }, 0) / workflowList.length)
        : 100;

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                {/* Header */}
                <div className="relative overflow-hidden mb-10 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 shadow-2xl">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl opacity-10 bg-amber-500" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 p-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <Workflow className="w-10 h-10 text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workflow Hub</h1>
                                <p className="text-slate-300 max-w-md">Automate content operations and pipeline routing with premium AI logic.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button onClick={() => refetch()} variant="outline" className="bg-white/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sync
                            </Button>
                            <Link href="/admin/workflows/new">
                                <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Workflow
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatBox label="Total Workflows" value={workflowList.length} icon={Workflow} color="amber" />
                    <StatBox label="Active Scripts" value={enabledCount} icon={Play} color="teal" />
                    <StatBox label="Total Executions" value={totalRuns} icon={Zap} color="blue" />
                    <StatBox label="Success Rate" value={`${avgSuccessRate}%`} icon={TrendingUp} color="emerald" />
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'enabled', 'disabled'] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className={cn(
                                "capitalize rounded-full px-6 transition-all",
                                filter === f ? "bg-amber-500 text-slate-900 hover:bg-amber-400" : "border-amber-500/20 text-slate-300 hover:text-amber-500"
                            )}
                        >
                            {f === 'all' ? 'All Channels' : f}
                        </Button>
                    ))}
                </div>

                {/* Workflows List */}
                <Card className="bg-white/5 border-border/20 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="text-center py-20 text-slate-300">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 opacity-50" />
                                <p>Ingesting workflow schema...</p>
                            </div>
                        ) : workflowList.length === 0 ? (
                            <div className="text-center py-20">
                                <Workflow className="w-16 h-16 mx-auto mb-6 text-slate-700" />
                                <p className="text-slate-300 mb-6 text-lg">No active workflows orchestration found</p>
                                <Link href="/admin/workflows/new">
                                    <Button className="bg-amber-500 text-slate-900 hover:bg-amber-400">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Initialize First Flow
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-amber-500/5">
                                {workflowList.map((workflow) => {
                                    const successRate = getSuccessRate(workflow);
                                    return (
                                        <div 
                                            key={workflow.id}
                                            className="p-6 hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                    {/* Enable/Disable Toggle */}
                                                    <button
                                                        onClick={() => toggleMutation.mutate({ 
                                                            id: workflow.id, 
                                                            enabled: !workflow.is_enabled 
                                                        })}
                                                        disabled={toggleMutation.isPending}
                                                        className={cn(
                                                            "w-12 h-6 rounded-full transition-all relative",
                                                            workflow.is_enabled 
                                                                ? 'bg-amber-500' 
                                                                : 'bg-slate-700'
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-md",
                                                            workflow.is_enabled ? 'left-7' : 'left-1'
                                                        )} />
                                                    </button>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1.5">
                                                            <Link 
                                                                href={`/admin/workflows/${workflow.id}`}
                                                                className="font-bold text-lg text-white group-hover:text-[#c49e48] transition-colors truncate"
                                                            >
                                                                {workflow.name}
                                                            </Link>
                                                            {workflow.is_system && (
                                                                <Badge className="bg-slate-500/20 text-slate-300 border-none px-2">
                                                                    SYSTEM_NODE
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <Badge className={cn("border-none px-2.5 py-0.5", getTriggerColor(workflow.trigger_type))}>
                                                                {getTriggerLabel(workflow.trigger_type)}
                                                            </Badge>
                                                            {workflow.description && (
                                                                <span className="text-slate-300 truncate max-w-md hidden sm:inline">
                                                                    {workflow.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="hidden lg:flex items-center gap-8 px-6">
                                                        <div className="text-center">
                                                            <div className="text-lg font-bold text-white leading-none mb-1">
                                                                {workflow.total_runs}
                                                            </div>
                                                            <div className="text-[10px] uppercase tracking-widest text-slate-500">Executions</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className={cn(
                                                                "text-lg font-bold leading-none mb-1",
                                                                successRate === null ? 'text-slate-500' :
                                                                successRate >= 90 ? 'text-emerald-400' :
                                                                successRate >= 70 ? 'text-amber-400' :
                                                                'text-rose-400'
                                                            )}>
                                                                {successRate !== null ? `${successRate}%` : '-'}
                                                            </div>
                                                            <div className="text-[10px] uppercase tracking-widest text-slate-500">Success</div>
                                                        </div>
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
                                                            className="border-amber-500/20 text-amber-500 hover:bg-amber-500/10 h-9"
                                                        >
                                                            <Play className="w-3.5 h-3.5 mr-2" />
                                                            Fire
                                                        </Button>
                                                    )}
                                                    <Link href={`/admin/workflows/${workflow.id}`}>
                                                        <Button variant="outline" size="sm" className="bg-white/5 border-slate-700 text-slate-300 hover:bg-white/10 h-9">
                                                            <Eye className="w-3.5 h-3.5 mr-2" />
                                                            Audit
                                                        </Button>
                                                    </Link>
                                                    {!workflow.is_system && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Erase this workflow node?')) {
                                                                    deleteMutation.mutate(workflow.id);
                                                                }
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                            className="hover:bg-rose-500/10 h-9 px-2"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-rose-500/50 hover:text-rose-500" />
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

                {/* Templates Deck */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-5 h-5 text-[#c49e48]" />
                        <h2 className="text-xl font-bold text-white">Flow Blueprints</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Auto-Publish High Quality',
                                desc: 'Autonomous publishing for 85+ score nodes',
                                trigger: 'quality_passed',
                                color: 'emerald'
                            },
                            {
                                name: 'Review Notification',
                                desc: 'Trigger alerts for manual editorial audit',
                                trigger: 'article_status_changed',
                                color: 'amber'
                            },
                            {
                                name: 'Daily Content Check',
                                desc: 'Scheduled maintenance for stale assets',
                                trigger: 'scheduled',
                                color: 'blue'
                            },
                        ].map((template, i) => (
                            <Link 
                                key={i}
                                href={`/admin/workflows/new?template=${i}`}
                                className="p-6 rounded-2xl border border-amber-500/10 bg-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group"
                            >
                                <h4 className="font-bold text-white mb-2 group-hover:text-amber-500">{template.name}</h4>
                                <p className="text-sm text-slate-300 mb-4">{template.desc}</p>
                                <Badge className={cn("border-none", getTriggerColor(template.trigger))}>
                                    {getTriggerLabel(template.trigger)}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatBox({ label, value, icon: Icon, color }: any) {
    const colors: Record<string, string> = {
        emerald: 'text-emerald-400 bg-emerald-400/10',
        amber: 'text-amber-400 bg-amber-400/10',
        blue: 'text-blue-400 bg-blue-400/10',
        teal: 'text-teal-400 bg-teal-400/10'
    };
    
    return (
        <Card className="bg-card dark:bg-card border-border dark:border-border backdrop-blur-sm p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", colors[color])}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
            </div>
            <div className="text-2xl font-bold text-foreground dark:text-foreground">{value}</div>
        </Card>
    );
}

