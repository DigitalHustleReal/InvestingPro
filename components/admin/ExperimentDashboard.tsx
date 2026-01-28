"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { 
    FlaskConical, 
    TrendingUp, 
    Users, 
    Target, 
    CheckCircle2, 
    XCircle,
    Play,
    Pause,
    Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Experiment, ExperimentResult } from '@/lib/ab-testing/experiment-manager';

/**
 * Experiment Dashboard
 * 
 * Admin dashboard for managing and viewing A/B test results
 */
export default function ExperimentDashboard() {
    const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

    const { data: experiments = [], isLoading } = useQuery<Experiment[]>({
        queryKey: ['experiments'],
        queryFn: async () => {
            const response = await fetch('/api/experiments');
            if (!response.ok) throw new Error('Failed to fetch experiments');
            return response.json();
        }
    });

    const { data: results } = useQuery<ExperimentResult[]>({
        queryKey: ['experiment-results', selectedExperiment],
        queryFn: async () => {
            if (!selectedExperiment) return [];
            const response = await fetch(`/api/experiments/${selectedExperiment}/results`);
            if (!response.ok) throw new Error('Failed to fetch results');
            return response.json();
        },
        enabled: !!selectedExperiment
    });

    if (isLoading) {
        return <div className="animate-pulse">Loading experiments...</div>;
    }

    const runningExperiments = experiments.filter(e => e.status === 'running');
    const completedExperiments = experiments.filter(e => e.status === 'completed');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        A/B Testing Dashboard
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Manage and analyze experiments
                    </p>
                </div>
                <Button>
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Create Experiment
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                                <FlaskConical className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {experiments.length}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    Total Experiments
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-success-500/10 flex items-center justify-center">
                                <Play className="w-5 h-5 text-success-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {runningExperiments.length}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    Running
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {completedExperiments.length}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    Completed
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {completedExperiments.filter(e => e.variants.some(v => v.weight > 50)).length}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    Winners Found
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Running Experiments */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-success-600" />
                        Running Experiments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {runningExperiments.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                            No running experiments
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {runningExperiments.map((experiment) => (
                                <ExperimentCard
                                    key={experiment.id}
                                    experiment={experiment}
                                    onClick={() => setSelectedExperiment(experiment.id)}
                                    selected={selectedExperiment === experiment.id}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Experiment Results */}
            {selectedExperiment && results && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                            Experiment Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ExperimentResults results={results} />
                    </CardContent>
                </Card>
            )}

            {/* Completed Experiments */}
            {completedExperiments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-slate-600" />
                            Completed Experiments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {completedExperiments.map((experiment) => (
                                <ExperimentCard
                                    key={experiment.id}
                                    experiment={experiment}
                                    onClick={() => setSelectedExperiment(experiment.id)}
                                    selected={selectedExperiment === experiment.id}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function ExperimentCard({ 
    experiment, 
    onClick, 
    selected 
}: { 
    experiment: Experiment; 
    onClick: () => void;
    selected: boolean;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 border rounded-lg cursor-pointer transition-colors",
                selected 
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                    : "border-slate-200 dark:border-slate-800 hover:border-primary-300"
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                            {experiment.name}
                        </h4>
                        <Badge variant={experiment.status === 'running' ? 'default' : 'secondary'}>
                            {experiment.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {experiment.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {experiment.targetMetric}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {experiment.trafficAllocation}% traffic
                        </span>
                        <span>
                            {experiment.variants.length} variants
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ExperimentResults({ results }: { results: ExperimentResult[] }) {
    const control = results.find(r => r.variant === 'control');
    
    return (
        <div className="space-y-4">
            {results.map((result) => {
                const isControl = result.variant === 'control';
                const lift = control && !isControl
                    ? ((result.conversionRate - control.conversionRate) / control.conversionRate) * 100
                    : 0;

                return (
                    <div
                        key={result.variant}
                        className={cn(
                            "p-4 border rounded-lg",
                            result.isWinner 
                                ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                                : "border-slate-200 dark:border-slate-800"
                        )}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <h5 className="font-semibold text-slate-900 dark:text-white capitalize">
                                    {result.variant}
                                </h5>
                                {result.isWinner && (
                                    <Badge className="bg-success-500">
                                        <Trophy className="w-3 h-3 mr-1" />
                                        Winner
                                    </Badge>
                                )}
                                {isControl && (
                                    <Badge variant="secondary">Control</Badge>
                                )}
                            </div>
                            {!isControl && (
                                <div className={cn(
                                    "text-sm font-semibold",
                                    lift > 0 ? "text-success-600" : "text-error-600"
                                )}>
                                    {lift > 0 ? '+' : ''}{lift.toFixed(1)}% lift
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                    Participants
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {result.participants.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                    Conversions
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {result.conversions.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                    Conversion Rate
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {(result.conversionRate * 100).toFixed(2)}%
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                                    Confidence
                                </div>
                                <div className={cn(
                                    "text-lg font-bold",
                                    result.confidence >= 95 ? "text-success-600" : "text-slate-900 dark:text-white"
                                )}>
                                    {result.confidence.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
