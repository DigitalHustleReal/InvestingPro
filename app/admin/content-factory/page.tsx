'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2, Rocket, Play, Check, X, Star, AlertTriangle, ChevronDown } from 'lucide-react';
import { ADMIN_THEME } from '@/lib/admin/theme';

/**
 * CONTENT FACTORY - ADMIN AUTOMATION PAGE
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
            <div style={{ padding: '32px', minHeight: '100vh', backgroundColor: ADMIN_THEME.colors.bg.page }}>
                <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ 
                            fontSize: '36px', 
                            fontWeight: 700, 
                            color: ADMIN_THEME.colors.text.main,
                            letterSpacing: '-0.025em',
                            marginBottom: '8px'
                        }}>
                            Content Factory
                        </h1>
                        <p style={{ color: ADMIN_THEME.colors.text.muted, fontSize: '16px' }}>
                            Automated bulk article generation with real-time progress tracking
                        </p>
                    </div>

                    {/* Controls */}
                    <div style={{ 
                        backgroundColor: ADMIN_THEME.colors.bg.surface, 
                        borderRadius: ADMIN_THEME.radius.xl,
                        border: `1px solid ${ADMIN_THEME.colors.border.subtle}`,
                        padding: '24px',
                        marginBottom: '32px',
                        boxShadow: ADMIN_THEME.shadows.sm
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Article Count */}
                            <div className="space-y-2">
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: ADMIN_THEME.colors.text.light, marginBottom: '8px' }}>
                                    Articles to Generate
                                </label>
                                <div className="relative">
                                    <select 
                                        value={count}
                                        onChange={(e) => setCount(parseInt(e.target.value))}
                                        disabled={isGenerating}
                                        style={{
                                            width: '100%',
                                            backgroundColor: ADMIN_THEME.colors.bg.subtle,
                                            border: `1px solid ${ADMIN_THEME.colors.border.default}`,
                                            borderRadius: ADMIN_THEME.radius.md,
                                            padding: '10px 16px',
                                            color: ADMIN_THEME.colors.text.main,
                                            fontSize: '14px',
                                            outline: 'none',
                                            appearance: 'none',
                                            cursor: isGenerating ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <option value={5}>5 Articles</option>
                                        <option value={10}>10 Articles</option>
                                        <option value={25}>25 Articles</option>
                                        <option value={50}>50 Articles</option>
                                        <option value={60}>60 Articles (Draft)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-wt-text-muted">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Phase Selection */}
                            <div className="space-y-2">
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: ADMIN_THEME.colors.text.light, marginBottom: '8px' }}>
                                    Content Phase
                                </label>
                                <div className="relative">
                                    <select 
                                        value={phase}
                                        onChange={(e) => setPhase(e.target.value)}
                                        disabled={isGenerating}
                                        style={{
                                            width: '100%',
                                            backgroundColor: ADMIN_THEME.colors.bg.subtle,
                                            border: `1px solid ${ADMIN_THEME.colors.border.default}`,
                                            borderRadius: ADMIN_THEME.radius.md,
                                            padding: '10px 16px',
                                            color: ADMIN_THEME.colors.text.main,
                                            fontSize: '14px',
                                            outline: 'none',
                                            appearance: 'none',
                                            cursor: isGenerating ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <option value="mvl">Initial Draft</option>
                                        <option value="month1">Month 1</option>
                                        <option value="month2">Month 2</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-wt-text-muted">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="space-y-2">
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: ADMIN_THEME.colors.text.light, marginBottom: '8px' }}>
                                    Action
                                </label>
                                <Button
                                    onClick={startGeneration}
                                    disabled={isGenerating}
                                    style={{
                                        width: '100%',
                                        backgroundColor: isGenerating ? ADMIN_THEME.colors.bg.subtle : ADMIN_THEME.colors.accent.default,
                                        color: isGenerating ? ADMIN_THEME.colors.text.muted : ADMIN_THEME.colors.primary[900],
                                        fontWeight: 600,
                                        padding: '10px 24px',
                                        borderRadius: ADMIN_THEME.radius.md,
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        height: '42px',
                                        cursor: isGenerating ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Rocket size={18} />
                                            <span>Start Generation</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {progress.length > 0 && (
                        <div style={{ 
                            backgroundColor: ADMIN_THEME.colors.bg.surface, 
                            borderRadius: ADMIN_THEME.radius.xl,
                            border: `1px solid ${ADMIN_THEME.colors.border.subtle}`,
                            padding: '24px',
                            marginBottom: '32px',
                            boxShadow: ADMIN_THEME.shadows.sm
                        }}>
                             <div className="flex items-center justify-between mb-4">
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: ADMIN_THEME.colors.text.main }}>Generation Progress</h2>
                                <span style={{ color: ADMIN_THEME.colors.text.muted, fontSize: '14px' }}>
                                    {currentArticle} / {totalArticles} articles
                                </span>
                            </div>

                            {/* Progress Bar Track */}
                            <div style={{ 
                                width: '100%', 
                                height: '8px', 
                                backgroundColor: ADMIN_THEME.colors.bg.subtle, 
                                borderRadius: ADMIN_THEME.radius.full,
                                overflow: 'hidden',
                                marginBottom: '12px'
                            }}>
                                {/* Progress Bar Fill */}
                                <div style={{
                                    height: '100%',
                                    width: `${percentage}%`,
                                    backgroundColor: ADMIN_THEME.colors.accent.default,
                                    transition: 'width 0.5s ease-in-out'
                                }} />
                            </div>

                            <div style={{ textAlign: 'center', color: ADMIN_THEME.colors.text.muted, fontSize: '14px', marginBottom: '24px' }}>
                                {percentage.toFixed(0)}% Complete
                            </div>

                            {/* Stats */}
                            {latestStatus?.status === 'complete' && (
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: ADMIN_THEME.colors.border.subtle }}>
                                    <div className="text-center">
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: ADMIN_THEME.colors.status.success.text }}>
                                            {latestStatus.success || 0}
                                        </div>
                                        <div style={{ fontSize: '12px', color: ADMIN_THEME.colors.text.light, textTransform: 'uppercase' }}>Successful</div>
                                    </div>
                                    <div className="text-center">
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: ADMIN_THEME.colors.status.error.text }}>
                                            {latestStatus.failed || 0}
                                        </div>
                                        <div style={{ fontSize: '12px', color: ADMIN_THEME.colors.text.light, textTransform: 'uppercase' }}>Failed</div>
                                    </div>
                                    <div className="text-center">
                                        <div style={{ fontSize: '24px', fontWeight: 700, color: ADMIN_THEME.colors.text.main }}>
                                            {latestStatus.total || 0}
                                        </div>
                                        <div style={{ fontSize: '12px', color: ADMIN_THEME.colors.text.light, textTransform: 'uppercase' }}>Total</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Console Output */}
                    {progress.length > 0 && (
                        <div style={{ 
                            backgroundColor: '#1a1b1e', // Terminal-like background
                            borderRadius: ADMIN_THEME.radius.lg,
                            border: `1px solid ${ADMIN_THEME.colors.border.default}`,
                            padding: '24px',
                            marginBottom: '32px',
                            fontFamily: 'monospace'
                        }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Console Output</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto text-sm custom-scrollbar">
                                {progress.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        {item.status === 'started' && (
                                            <>
                                                <Play size={14} className="mt-1 text-blue-400" />
                                                <span className="text-blue-400">Started generation: {item.total} articles (Authority: {item.authority})</span>
                                            </>
                                        )}
                                        {item.status === 'generating' && (
                                            <>
                                                <Loader2 size={14} className="mt-1 text-yellow-400 animate-spin" />
                                                <span className="text-yellow-400">[{item.current}/{item.total}] {item.topic}</span>
                                            </>
                                        )}
                                        {item.status === 'log' && (
                                            <span className="text-gray-600 pl-7">{item.message}</span>
                                        )}
                                        {item.status === 'success' && (
                                            <>
                                                <Check size={14} className="mt-1 text-green-400" />
                                                <span className="text-green-400">[{item.current}/{item.total}] {item.topic}</span>
                                            </>
                                        )}
                                        {item.status === 'error' && (
                                            <>
                                                <X size={14} className="mt-1 text-red-400" />
                                                <span className="text-red-400">[{item.current}/{item.total}] {item.topic}: {item.error}</span>
                                            </>
                                        )}
                                        {item.status === 'complete' && (
                                            <>
                                                <Star size={14} className="mt-1 text-purple-400" />
                                                <span className="text-purple-400 font-bold">Generation complete! {item.success}/{item.total} successful</span>
                                            </>
                                        )}
                                        {item.status === 'fatal_error' && (
                                            <>
                                                <AlertTriangle size={14} className="mt-1 text-red-500" />
                                                <span className="text-red-500 font-bold">Fatal error: {item.error}</span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    {/* ... (Keep existing stats logic but style update) ... */}
                </div>
            </div>
        </AdminLayout>
    );
}

