'use client';

/**
 * Prompt Manager Component
 * 
 * UI for managing prompt versions, A/B testing, and performance tracking
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    TrendingUp,
    TrendingDown,
    TestTube,
    BarChart3,
    Plus,
    RefreshCw,
    Play,
    Pause,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface Prompt {
    id: string;
    name: string;
    slug: string;
    version: number;
    category: string;
    description?: string;
    user_prompt_template: string;
    system_prompt?: string;
    preferred_model: string;
    temperature: number;
    max_tokens: number;
    output_format: string;
    is_active: boolean;
    ab_test_group?: string;
    ab_test_id?: string;
    performance_score?: number;
    quality_score?: number;
    usage_count: number;
    success_count: number;
    error_count: number;
    created_at: string;
    updated_at: string;
}

interface ABTest {
    id: string;
    name: string;
    description?: string;
    prompt_slug: string;
    status: string;
    traffic_split: Record<string, number>;
    min_sample_size: number;
    winner_version?: string;
    test_started_at?: string;
    test_ended_at?: string;
}

export default function PromptManager() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [abTests, setABTests] = useState<ABTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
    const [showCreateVersion, setShowCreateVersion] = useState(false);
    const [showCreateTest, setShowCreateTest] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [promptsRes, testsRes] = await Promise.all([
                fetch('/api/v1/admin/prompts?include_inactive=true'),
                fetch('/api/v1/admin/ab-tests'),
            ]);

            const promptsData = await promptsRes.json();
            const testsData = await testsRes.json();

            if (promptsData.success) {
                setPrompts(promptsData.data || []);
            }

            if (testsData.success) {
                setABTests(testsData.data || []);
            }
        } catch (err) {
            logger.error('Failed to load prompt data', err as Error);
        } finally {
            setLoading(false);
        }
    };

    const groupedPrompts = prompts.reduce((acc, prompt) => {
        if (!acc[prompt.slug]) {
            acc[prompt.slug] = [];
        }
        acc[prompt.slug].push(prompt);
        return acc;
    }, {} as Record<string, Prompt[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner text="Loading prompts..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Prompt Manager</h2>
                <div className="flex gap-2">
                    <Button onClick={loadData} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Prompts List */}
            <Card>
                <CardHeader>
                    <CardTitle>Prompts by Slug</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(groupedPrompts).map(([slug, versions]) => {
                            const activeVersion = versions.find(v => v.is_active);
                            const bestVersion = versions.reduce((best, current) => {
                                const bestScore = best?.performance_score || 0;
                                const currentScore = current.performance_score || 0;
                                return currentScore > bestScore ? current : best;
                            }, versions[0]);

                            return (
                                <div
                                    key={slug}
                                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                                    onClick={() => setSelectedPrompt(activeVersion || versions[0])}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{versions[0].name}</div>
                                            <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">{slug}</div>
                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                                {versions.length} version{versions.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeVersion && (
                                                <Badge variant="outline">Active v{activeVersion.version}</Badge>
                                            )}
                                            {bestVersion && bestVersion.performance_score && (
                                                <Badge variant="outline">
                                                    Best: {bestVersion.performance_score.toFixed(1)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* A/B Tests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TestTube className="w-5 h-5" />
                        A/B Tests
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {abTests.length > 0 ? (
                        <div className="space-y-3">
                            {abTests.map((test) => (
                                <div
                                    key={test.id}
                                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                                    onClick={() => setSelectedTest(test)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{test.name}</div>
                                            <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">{test.prompt_slug}</div>
                                            <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 mt-1">
                                                Status: {test.status}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    test.status === 'running'
                                                        ? 'default'
                                                        : test.status === 'completed'
                                                        ? 'outline'
                                                        : 'secondary'
                                                }
                                            >
                                                {test.status}
                                            </Badge>
                                            {test.winner_version && (
                                                <Badge variant="outline">
                                                    Winner: {test.winner_version}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70 text-center py-4">No A/B tests yet</p>
                    )}
                </CardContent>
            </Card>

            {/* Selected Prompt Details */}
            {selectedPrompt && (
                <Card>
                    <CardHeader>
                        <CardTitle>Prompt Details: {selectedPrompt.name} v{selectedPrompt.version}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Category</div>
                                    <div className="font-semibold">{selectedPrompt.category}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Model</div>
                                    <div className="font-semibold">{selectedPrompt.preferred_model}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Usage Count</div>
                                    <div className="font-semibold">{selectedPrompt.usage_count}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Success Rate</div>
                                    <div className="font-semibold">
                                        {selectedPrompt.usage_count > 0
                                            ? ((selectedPrompt.success_count / selectedPrompt.usage_count) * 100).toFixed(1)
                                            : 0}%
                                    </div>
                                </div>
                                {selectedPrompt.performance_score !== null && (
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Performance Score</div>
                                        <div className="font-semibold">
                                            {selectedPrompt.performance_score.toFixed(1)}
                                        </div>
                                    </div>
                                )}
                                {selectedPrompt.quality_score !== null && (
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Quality Score</div>
                                        <div className="font-semibold">
                                            {selectedPrompt.quality_score.toFixed(1)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 mb-2">User Prompt Template</div>
                                <Textarea
                                    value={selectedPrompt.user_prompt_template}
                                    readOnly
                                    className="font-mono text-sm"
                                    rows={10}
                                />
                            </div>

                            {selectedPrompt.system_prompt && (
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 mb-2">System Prompt</div>
                                    <Textarea
                                        value={selectedPrompt.system_prompt}
                                        readOnly
                                        className="font-mono text-sm"
                                        rows={5}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Selected A/B Test Details */}
            {selectedTest && (
                <Card>
                    <CardHeader>
                        <CardTitle>A/B Test: {selectedTest.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Status</div>
                                    <div className="font-semibold">{selectedTest.status}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Min Sample Size</div>
                                    <div className="font-semibold">{selectedTest.min_sample_size}</div>
                                </div>
                                {selectedTest.winner_version && (
                                    <div>
                                        <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50">Winner</div>
                                        <div className="font-semibold">{selectedTest.winner_version}</div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 mb-2">Traffic Split</div>
                                <div className="space-y-2">
                                    {Object.entries(selectedTest.traffic_split).map(([group, percentage]) => (
                                        <div key={group} className="flex items-center justify-between">
                                            <span className="font-semibold">Group {group}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedTest.status === 'draft' && (
                                <Button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(`/api/v1/admin/ab-tests/${selectedTest.id}/start`, {
                                                method: 'POST',
                                            });
                                            if (res.ok) {
                                                await loadData();
                                            }
                                        } catch (err) {
                                            logger.error('Failed to start A/B test', err as Error);
                                        }
                                    }}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Test
                                </Button>
                            )}

                            {selectedTest.status === 'running' && (
                                <Button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(`/api/v1/admin/ab-tests/${selectedTest.id}/analyze`);
                                            const data = await res.json();
                                            if (data.success) {
                                                await loadData();
                                            }
                                        } catch (err) {
                                            logger.error('Failed to analyze A/B test', err as Error);
                                        }
                                    }}
                                    variant="outline"
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Analyze Results
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
