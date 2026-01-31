"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Settings, 
    Save,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Sliders,
    Shield,
    Zap,
    ToggleLeft,
    ToggleRight,
    ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

interface ThresholdSettings {
    autoPublishMinScore: number;
    autoPublishMinConfidence: number;
    reviewRequiredScore: number;
    highConfidenceThreshold: number;
}

interface CategoryRule {
    category: string;
    enabled: boolean;
    minScore: number;
    minConfidence: number;
    requiresExpertReview: boolean;
}

export default function AutonomySettingsPage() {
    const queryClient = useQueryClient();
    const [thresholds, setThresholds] = useState<ThresholdSettings>({
        autoPublishMinScore: 85,
        autoPublishMinConfidence: 0.9,
        reviewRequiredScore: 70,
        highConfidenceThreshold: 0.85,
    });
    const [categoryRules, setCategoryRules] = useState<CategoryRule[]>([]);
    const [autoPublishConfig, setAutoPublishConfig] = useState({
        enabled: true,
        dryRun: false,
        maxAutoPublishPerHour: 10,
        maxAutoPublishPerDay: 50,
    });
    const [anomalySensitivity, setAnomalySensitivity] = useState<'low' | 'medium' | 'high'>('medium');
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch current config
    const { data: configData, isLoading, refetch } = useQuery({
        queryKey: ['autonomy-config-settings'],
        queryFn: async () => {
            const response = await fetch('/api/admin/autonomy/config');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
    });

    // Update local state when config loads
    useEffect(() => {
        if (configData?.config) {
            const c = configData.config;
            if (c.confidenceThresholds) {
                setThresholds(c.confidenceThresholds);
            }
            if (c.categoryRules) {
                setCategoryRules(c.categoryRules);
            }
            if (c.autoPublish) {
                setAutoPublishConfig(c.autoPublish);
            }
            if (c.anomalyDetection?.sensitivity) {
                setAnomalySensitivity(c.anomalyDetection.sensitivity);
            }
        }
    }, [configData]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/admin/autonomy/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confidenceThresholds: thresholds,
                    categoryRules,
                    autoPublish: autoPublishConfig,
                    anomalyDetection: { sensitivity: anomalySensitivity },
                }),
            });
            if (!response.ok) throw new Error('Failed to save');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['autonomy-config'] });
            setHasChanges(false);
        },
    });

    const handleThresholdChange = (key: keyof ThresholdSettings, value: number) => {
        setThresholds(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleCategoryRuleChange = (index: number, updates: Partial<CategoryRule>) => {
        setCategoryRules(prev => {
            const newRules = [...prev];
            newRules[index] = { ...newRules[index], ...updates };
            return newRules;
        });
        setHasChanges(true);
    };

    const handleAutoPublishChange = (key: string, value: any) => {
        setAutoPublishConfig(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen p-8 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/autonomy">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 shadow-lg shadow-secondary-500/25 flex items-center justify-center">
                            <Settings className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Autonomy Settings
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Configure thresholds and rules for auto-publishing
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={() => refetch()} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Reset
                        </Button>
                        <Button 
                            onClick={() => saveMutation.mutate()}
                            disabled={!hasChanges || saveMutation.isPending}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {hasChanges && (
                    <Card className="bg-warning-500/10 border-warning-500/30 mb-6">
                        <CardContent className="p-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning-400" />
                            <span className="text-warning-400">You have unsaved changes</span>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Auto-Publish Settings */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary-400" />
                                Auto-Publish Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Enable/Disable */}
                            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-foreground">Auto-Publish Enabled</h4>
                                    <p className="text-sm text-muted-foreground">Enable automatic publishing of articles</p>
                                </div>
                                <button
                                    onClick={() => handleAutoPublishChange('enabled', !autoPublishConfig.enabled)}
                                    className="text-2xl"
                                >
                                    {autoPublishConfig.enabled ? (
                                        <ToggleRight className="w-10 h-10 text-success-400" />
                                    ) : (
                                        <ToggleLeft className="w-10 h-10 text-muted-foreground" />
                                    )}
                                </button>
                            </div>

                            {/* Dry Run Mode */}
                            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-foreground">Dry Run Mode</h4>
                                    <p className="text-sm text-muted-foreground">Simulate without actually publishing</p>
                                </div>
                                <button
                                    onClick={() => handleAutoPublishChange('dryRun', !autoPublishConfig.dryRun)}
                                    className="text-2xl"
                                >
                                    {autoPublishConfig.dryRun ? (
                                        <ToggleRight className="w-10 h-10 text-warning-400" />
                                    ) : (
                                        <ToggleLeft className="w-10 h-10 text-muted-foreground" />
                                    )}
                                </button>
                            </div>

                            {/* Rate Limits */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Max Per Hour: {autoPublishConfig.maxAutoPublishPerHour}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={autoPublishConfig.maxAutoPublishPerHour}
                                        onChange={(e) => handleAutoPublishChange('maxAutoPublishPerHour', parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Max Per Day: {autoPublishConfig.maxAutoPublishPerDay}
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        value={autoPublishConfig.maxAutoPublishPerDay}
                                        onChange={(e) => handleAutoPublishChange('maxAutoPublishPerDay', parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confidence Thresholds */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Sliders className="w-5 h-5 text-secondary-400" />
                                Confidence Thresholds
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Minimum Score for Auto-Publish: {thresholds.autoPublishMinScore}
                                </label>
                                <input
                                    type="range"
                                    min="60"
                                    max="100"
                                    value={thresholds.autoPublishMinScore}
                                    onChange={(e) => handleThresholdChange('autoPublishMinScore', parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>More Auto</span>
                                    <span>More Manual</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Minimum Confidence: {Math.round(thresholds.autoPublishMinConfidence * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="70"
                                    max="99"
                                    value={thresholds.autoPublishMinConfidence * 100}
                                    onChange={(e) => handleThresholdChange('autoPublishMinConfidence', parseInt(e.target.value) / 100)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Review Required Below: {thresholds.reviewRequiredScore}
                                </label>
                                <input
                                    type="range"
                                    min="40"
                                    max="80"
                                    value={thresholds.reviewRequiredScore}
                                    onChange={(e) => handleThresholdChange('reviewRequiredScore', parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="p-4 bg-muted/10 rounded-lg">
                                <h4 className="font-medium text-foreground mb-2">Current Logic</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-success-400" />
                                        Score ≥{thresholds.autoPublishMinScore} & Confidence ≥{Math.round(thresholds.autoPublishMinConfidence * 100)}% → Auto Publish
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-warning-400" />
                                        Score ≥{thresholds.reviewRequiredScore} → Queue for Review
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-danger-400" />
                                        Score &lt;{thresholds.reviewRequiredScore} → Rejected
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Anomaly Detection */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Shield className="w-5 h-5 text-warning-400" />
                                Anomaly Detection
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Detection sensitivity for content issues like spam, hallucinations, and compliance risks.
                                </p>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    {(['low', 'medium', 'high'] as const).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                setAnomalySensitivity(level);
                                                setHasChanges(true);
                                            }}
                                            className={`p-4 rounded-lg border text-center transition-all ${
                                                anomalySensitivity === level
                                                    ? 'bg-primary-500/20 border-primary-500/50'
                                                    : 'bg-muted/10 border-border/50 hover:bg-muted/20'
                                            }`}
                                        >
                                            <div className="font-semibold text-foreground capitalize mb-1">{level}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {level === 'low' && 'Fewer flags'}
                                                {level === 'medium' && 'Balanced'}
                                                {level === 'high' && 'More strict'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Rules */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Settings className="w-5 h-5 text-accent-400" />
                                Category Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {categoryRules.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No category rules configured
                                    </p>
                                ) : (
                                    categoryRules.map((rule, index) => (
                                        <div 
                                            key={rule.category}
                                            className="p-4 bg-muted/10 rounded-lg border border-border/50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground capitalize">
                                                        {rule.category.replace('-', ' ')}
                                                    </span>
                                                    {rule.requiresExpertReview && (
                                                        <Badge className="bg-warning-500/20 text-warning-400">
                                                            Expert Review
                                                        </Badge>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCategoryRuleChange(index, { enabled: !rule.enabled })}
                                                >
                                                    {rule.enabled ? (
                                                        <ToggleRight className="w-8 h-8 text-success-400" />
                                                    ) : (
                                                        <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <label className="text-muted-foreground">Min Score</label>
                                                    <input
                                                        type="number"
                                                        min="50"
                                                        max="100"
                                                        value={rule.minScore}
                                                        onChange={(e) => handleCategoryRuleChange(index, { minScore: parseInt(e.target.value) })}
                                                        className="w-full mt-1 px-2 py-1 bg-background border border-border rounded"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-muted-foreground">Min Confidence</label>
                                                    <input
                                                        type="number"
                                                        min="0.5"
                                                        max="1"
                                                        step="0.05"
                                                        value={rule.minConfidence}
                                                        onChange={(e) => handleCategoryRuleChange(index, { minConfidence: parseFloat(e.target.value) })}
                                                        className="w-full mt-1 px-2 py-1 bg-background border border-border rounded"
                                                    />
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-2 mt-3 text-sm text-muted-foreground cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.requiresExpertReview}
                                                    onChange={(e) => handleCategoryRuleChange(index, { requiresExpertReview: e.target.checked })}
                                                    className="rounded"
                                                />
                                                Requires expert review
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Save Success Message */}
                {saveMutation.isSuccess && (
                    <Card className="bg-success-500/10 border-success-500/30 mt-6">
                        <CardContent className="p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success-400" />
                            <span className="text-success-400">Settings saved successfully!</span>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}
