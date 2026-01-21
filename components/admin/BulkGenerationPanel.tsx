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
        <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50 rounded-xl">
            <CardHeader className="border-b border-border/50 dark:border-border/50 px-8 py-6">
                <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary-400" />
                    Bulk Content Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    {/* Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-2">
                                Total Articles
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={totalArticles}
                                onChange={(e) => setTotalArticles(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-border dark:border-border rounded-lg text-foreground dark:text-foreground"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-2">
                                Batch Size
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={batchSize}
                                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-border dark:border-border rounded-lg text-foreground dark:text-foreground"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-2">
                                Parallel Batches
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={parallelBatches}
                                onChange={(e) => setParallelBatches(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-border dark:border-border rounded-lg text-foreground dark:text-foreground"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-2">
                                Quality Threshold
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={qualityThreshold}
                                onChange={(e) => setQualityThreshold(parseInt(e.target.value) || 80)}
                                className="w-full px-4 py-2 bg-muted dark:bg-muted border border-border dark:border-border rounded-lg text-foreground dark:text-foreground"
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
                        <label htmlFor="parallel" className="text-sm text-muted-foreground dark:text-muted-foreground">
                            Use parallel processing (faster but uses more resources)
                        </label>
                    </div>
                    
                    {/* Info */}
                    <div className="bg-muted/50 dark:bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground dark:text-muted-foreground">
                        <p className="mb-2">
                            <strong className="text-foreground dark:text-foreground">Estimated Time:</strong>{' '}
                            {useParallel 
                                ? `${Math.ceil(totalArticles / (batchSize * parallelBatches)) * 2} minutes`
                                : `${Math.ceil(totalArticles / batchSize) * 5} minutes`
                            }
                        </p>
                        <p>
                            <strong className="text-foreground dark:text-foreground">Batches:</strong>{' '}
                            {Math.ceil(totalArticles / batchSize)} batches
                            {useParallel && ` (${parallelBatches} in parallel)`}
                        </p>
                    </div>
                    
                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={bulkGenerate.isPending}
                        className="w-full bg-primary-600 hover:bg-primary-700"
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
                        <div className="mt-6 p-4 bg-muted/50 dark:bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-semibold text-foreground dark:text-foreground mb-3">Generation Results</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground dark:text-muted-foreground">Generated</p>
                                    <p className="text-foreground dark:text-foreground font-bold text-lg">
                                        {bulkGenerate.data.result?.totalGenerated || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground dark:text-muted-foreground">Published</p>
                                    <p className="text-success-400 font-bold text-lg">
                                        {bulkGenerate.data.result?.totalPublished || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground dark:text-muted-foreground">Avg Quality</p>
                                    <p className="text-foreground dark:text-foreground font-bold text-lg">
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
