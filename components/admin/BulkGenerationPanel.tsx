"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Zap, 
    RefreshCw, 
    CheckCircle, 
    XCircle,
    Clock,
    FileText,
    TrendingUp,
    Play
} from 'lucide-react';
import { ActionButton } from './AdminUIKit';

/**
 * Bulk Generation Panel
 * 
 * Generate multiple articles at once
 */
export default function BulkGenerationPanel() {
    const [totalArticles, setTotalArticles] = useState(20);
    const [batchSize, setBatchSize] = useState(5);
    const [parallelBatches, setParallelBatches] = useState(2);
    const [qualityThreshold, setQualityThreshold] = useState(80);
    const [useParallel, setUseParallel] = useState(true);
    const queryClient = useQueryClient();
    
    // Bulk generation mutation
    const bulkGenerate = useMutation({
        mutationFn: async (config: any) => {
            const response = await fetch('/api/cms/bulk-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...config,
                    parallel: useParallel
                })
            });
            if (!response.ok) throw new Error('Bulk generation failed');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['cms-cycles'] });
        }
    });
    
    const handleGenerate = () => {
        bulkGenerate.mutate({
            totalArticles,
            batchSize,
            parallelBatches,
            qualityThreshold
        });
    };
    
    return (
        <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden text-sm">
            <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Bulk Content Generation Strategy
                </h3>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    {/* Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Articles
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={totalArticles}
                                onChange={(e) => setTotalArticles(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Batch Size
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={batchSize}
                                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Parallel Batches
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={parallelBatches}
                                onChange={(e) => setParallelBatches(parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Quality Threshold
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={qualityThreshold}
                                onChange={(e) => setQualityThreshold(parseInt(e.target.value) || 80)}
                                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    
                    {/* Parallel Processing Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="parallel"
                            checked={useParallel}
                            onChange={(e) => setUseParallel(e.target.checked)}
                            className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <label htmlFor="parallel" className="text-sm font-medium text-foreground cursor-pointer select-none">
                            Use parallel processing <span className="text-muted-foreground font-normal">(faster execution)</span>
                        </label>
                    </div>
                    
                    {/* Info */}
                    <div className="bg-muted/30 border border-border/50 rounded-lg p-4 text-sm">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Duration</span>
                                <span className="font-mono text-base font-bold text-foreground">
                                    {useParallel 
                                        ? `${Math.ceil(totalArticles / (batchSize * parallelBatches)) * 2} min`
                                        : `${Math.ceil(totalArticles / batchSize) * 5} min`
                                    }
                                </span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Batches</span>
                                <span className="font-mono text-base font-bold text-foreground">
                                    {Math.ceil(totalArticles / batchSize)} {useParallel ? `(${parallelBatches} parallel)` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={bulkGenerate.isPending}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
                        size="lg"
                    >
                        {bulkGenerate.isPending ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Generating {totalArticles} articles...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 mr-2" />
                                Start Generation Sequence
                            </>
                        )}
                    </Button>
                    
                    {/* Results */}
                    {bulkGenerate.data && (
                        <div className="mt-6 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Generation Complete
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Generated</p>
                                    <p className="text-foreground font-bold text-xl">
                                        {bulkGenerate.data.result?.totalGenerated || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Published</p>
                                    <p className="text-emerald-400 font-bold text-xl">
                                        {bulkGenerate.data.result?.totalPublished || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Quality</p>
                                    <p className="text-foreground font-bold text-xl">
                                        {bulkGenerate.data.result?.averageQualityScore?.toFixed(0) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
