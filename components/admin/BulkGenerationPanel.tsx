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
    TrendingUp
} from 'lucide-react';

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
        <Card className="bg-wt-surface dark:bg-wt-surface border-wt-border/50 dark:border-wt-border/50 rounded-xl">
            <CardHeader className="border-b border-wt-border/50 dark:border-wt-border/50 px-8 py-6">
                <CardTitle className="text-lg font-bold text-wt-text dark:text-wt-text flex items-center gap-3">
                    <Zap className="w-5 h-5 text-wt-gold" />
                    Bulk Content Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    {/* Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-wt-text-muted dark:text-wt-text-muted mb-2">
                                Total Articles
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={totalArticles}
                                onChange={(e) => setTotalArticles(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-wt-text-muted dark:text-wt-text-muted mb-2">
                                Batch Size
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={batchSize}
                                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-wt-text-muted dark:text-wt-text-muted mb-2">
                                Parallel Batches
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={parallelBatches}
                                onChange={(e) => setParallelBatches(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-wt-text-muted dark:text-wt-text-muted mb-2">
                                Quality Threshold
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={qualityThreshold}
                                onChange={(e) => setQualityThreshold(parseInt(e.target.value) || 80)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-wt-border dark:border-wt-border rounded-lg text-wt-text dark:text-wt-text"
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
                            className="w-4 h-4"
                        />
                        <label htmlFor="parallel" className="text-sm text-wt-text-muted dark:text-wt-text-muted">
                            Use parallel processing (faster but uses more resources)
                        </label>
                    </div>
                    
                    {/* Info */}
                    <div className="bg-wt-card dark:bg-wt-card rounded-lg p-4 text-sm text-wt-text-muted dark:text-wt-text-muted">
                        <p className="mb-2">
                            <strong className="text-wt-text dark:text-wt-text">Estimated Time:</strong>{' '}
                            {useParallel 
                                ? `${Math.ceil(totalArticles / (batchSize * parallelBatches)) * 2} minutes`
                                : `${Math.ceil(totalArticles / batchSize) * 5} minutes`
                            }
                        </p>
                        <p>
                            <strong className="text-wt-text dark:text-wt-text">Batches:</strong>{' '}
                            {Math.ceil(totalArticles / batchSize)} batches
                            {useParallel && ` (${parallelBatches} in parallel)`}
                        </p>
                    </div>
                    
                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={bulkGenerate.isPending}
                        className="w-full bg-wt-gold hover:bg-wt-gold-hover"
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
                                Generate {totalArticles} Articles
                            </>
                        )}
                    </Button>
                    
                    {/* Results */}
                    {bulkGenerate.data && (
                        <div className="mt-6 p-4 bg-wt-card dark:bg-wt-card rounded-lg">
                            <h4 className="text-sm font-semibold text-wt-text dark:text-wt-text mb-3">Generation Results</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-wt-text-muted dark:text-wt-text-muted">Generated</p>
                                    <p className="text-wt-text dark:text-wt-text font-bold text-lg">
                                        {bulkGenerate.data.result?.totalGenerated || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-wt-text-muted dark:text-wt-text-muted">Published</p>
                                    <p className="text-wt-green font-bold text-lg">
                                        {bulkGenerate.data.result?.totalPublished || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-wt-text-muted dark:text-wt-text-muted">Avg Quality</p>
                                    <p className="text-wt-text dark:text-wt-text font-bold text-lg">
                                        {bulkGenerate.data.result?.averageQualityScore?.toFixed(0) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
