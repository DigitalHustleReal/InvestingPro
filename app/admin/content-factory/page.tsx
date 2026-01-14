'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';

/**
 * ðŸ¤– CONTENT FACTORY - ADMIN AUTOMATION PAGE
 * 
 * Features:
 * - One-click bulk generation
 * - Real-time progress tracking
 * - Visual console output
 * - Pause/Resume support
 */

interface GenerationProgress {
    status: string;
    current?: number;
    total?: number;
    topic?: string;
    message?: string;
    error?: string;
    success?: number;
    failed?: number;
    authority?: number;
}

export default function ContentFactoryPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<GenerationProgress[]>([]);
    const [count, setCount] = useState(10);
    const [phase, setPhase] = useState('mvl');

    const startGeneration = async () => {
        setIsGenerating(true);
        setProgress([]);

        try {
            const response = await fetch('/api/generate-articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count, phase })
            });

            if (!response.ok) throw new Error('Generation failed');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response body');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));
                        setProgress(prev => [...prev, data]);

                        if (data.status === 'complete' || data.status === 'fatal_error') {
                            setIsGenerating(false);
                        }
                    }
                }
            }
        } catch (error: any) {
            setProgress(prev => [...prev, {
                status: 'fatal_error',
                error: error.message
            }]);
            setIsGenerating(false);
        }
    };

    const latestStatus = progress[progress.length - 1];
    const currentArticle = latestStatus?.current || 0;
    const totalArticles = latestStatus?.total || count;
    const percentage = totalArticles > 0 ? (currentArticle / totalArticles) * 100 : 0;

    return (
        <AdminLayout>
            <div className="min-h-screen text-white p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Breadcrumb */}
                    <AdminBreadcrumb />
                    
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-400 to-pink-400 bg-clip-text text-transparent">
                            ðŸ¤– AI Content Factory
                        </h1>
                        <p className="text-slate-400">
                            Automated bulk article generation with real-time progress tracking
                        </p>
                    </div>

                    {/* Controls */}
                    <Card className="bg-admin-surface/50 border-admin-border p-6 backdrop-blur-xl">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Article Count */}
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Articles to Generate</label>
                                    <select 
                                        value={count}
                                        onChange={(e) => setCount(parseInt(e.target.value))}
                                        disabled={isGenerating}
                                        className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value={5}>5 Articles</option>
                                        <option value={10}>10 Articles</option>
                                        <option value={25}>25 Articles</option>
                                        <option value={50}>50 Articles</option>
                                        <option value={60}>60 Articles (MVL)</option>
                                    </select>
                                </div>

                                {/* Phase Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Content Phase</label>
                                    <select 
                                        value={phase}
                                        onChange={(e) => setPhase(e.target.value)}
                                        disabled={isGenerating}
                                        className="w-full bg-admin-bg border border-admin-border rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="mvl">MVL Core</option>
                                        <option value="month1">Month 1</option>
                                        <option value="month2">Month 2</option>
                                    </select>
                                </div>

                                {/* Action Button */}
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Action</label>
                                    <Button
                                        onClick={startGeneration}
                                        disabled={isGenerating}
                                        className="w-full bg-gradient-to-r from-secondary-500 to-pink-500 hover:from-secondary-600 hover:to-pink-600 text-white font-semibold py-2"
                                    >
                                        {isGenerating ? 'â³ Generating...' : 'ðŸš€ Start Generation'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Progress Bar */}
                    {progress.length > 0 && (
                        <Card className="bg-admin-surface/50 border-admin-border p-6 backdrop-blur-xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Generation Progress</h2>
                                    <span className="text-slate-400">
                                        {currentArticle} / {totalArticles} articles
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-admin-bg rounded-full h-4 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-secondary-500 to-pink-500 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="text-sm text-slate-400">
                                    {percentage.toFixed(0)}% Complete
                                </div>

                                {/* Stats */}
                                {latestStatus?.status === 'complete' && (
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-secondary-500/20">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-success-400">
                                                {latestStatus.success || 0}
                                            </div>
                                            <div className="text-sm text-slate-400">Successful</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-danger-400">
                                                {latestStatus.failed || 0}
                                            </div>
                                            <div className="text-sm text-slate-400">Failed</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-secondary-400">
                                                {latestStatus.total || 0}
                                            </div>
                                            <div className="text-sm text-slate-400">Total</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Console Output */}
                    {progress.length > 0 && (
                        <Card className="bg-admin-bg border-admin-border p-6 backdrop-blur-xl">
                            <h2 className="text-xl font-semibold mb-4">Console Output</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
                                {progress.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        {item.status === 'started' && (
                                            <div className="text-secondary-400">
                                                â–¶ Started generation: {item.total} articles (Authority: {item.authority})
                                            </div>
                                        )}
                                        {item.status === 'generating' && (
                                            <div className="text-accent-400">
                                                â³ [{item.current}/{item.total}] {item.topic}
                                            </div>
                                        )}
                                        {item.status === 'log' && (
                                            <div className="text-slate-400 pl-4">{item.message}</div>
                                        )}
                                        {item.status === 'success' && (
                                            <div className="text-success-400">
                                                âœ… [{item.current}/{item.total}] {item.topic}
                                            </div>
                                        )}
                                        {item.status === 'error' && (
                                            <div className="text-danger-400">
                                                âŒ [{item.current}/{item.total}] {item.topic}: {item.error}
                                            </div>
                                        )}
                                        {item.status === 'complete' && (
                                            <div className="text-success-400 font-bold">
                                                ðŸŽ‰ Generation complete! {item.success}/{item.total} successful
                                            </div>
                                        )}
                                        {item.status === 'fatal_error' && (
                                            <div className="text-danger-400 font-bold">
                                                ðŸ’¥ Fatal error: {item.error}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-secondary-500/10 to-pink-500/10 border-secondary-500/20 p-6">
                            <div className="text-sm text-slate-400 mb-2">Current Authority</div>
                            <div className="text-3xl font-bold text-secondary-400">
                                {latestStatus?.authority || '...'}/100
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-secondary-500/10 to-cyan-500/10 border-secondary-500/20 p-6">
                            <div className="text-sm text-slate-400 mb-2">Articles Generated</div>
                            <div className="text-3xl font-bold text-secondary-400">
                                {currentArticle}
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-success-500/10 to-success-500/10 border-success-500/20 p-6">
                            <div className="text-sm text-slate-400 mb-2">Success Rate</div>
                            <div className="text-3xl font-bold text-success-400">
                                {latestStatus?.success && latestStatus?.total
                                    ? `${((latestStatus.success / latestStatus.total) * 100).toFixed(0)}%`
                                    : '...'}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
