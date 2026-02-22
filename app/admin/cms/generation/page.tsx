"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import BulkGenerationPanel from '@/components/admin/BulkGenerationPanel';
import { Zap, Play, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function CMSGenerationPage() {
    const queryClient = useQueryClient();

    // Canary test mutation
    const canaryTest = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/cms/orchestrator/canary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goals: { quality: 80 }
                })
            });
            if (!response.ok) throw new Error('Canary test failed');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Canary test completed successfully');
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
        onError: (error: any) => {
            toast.error(`Canary test failed: ${error.message}`);
        }
    });

    // Full execution mutation
    const fullExecute = useMutation({
        mutationFn: async (config: any) => {
            const response = await fetch('/api/cms/orchestrator/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'fully-automated',
                    ...config
                })
            });
            if (!response.ok) throw new Error('Execution failed');
            return response.json();
        },
        onSuccess: () => {
            toast.success('Content generation started');
            queryClient.invalidateQueries({ queryKey: ['articles'] });
        },
        onError: (error: any) => {
            toast.error(`Execution failed: ${error.message}`);
        }
    });

    return (
        <AdminLayout>
            <AdminPageContainer>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3 tracking-tight">
                            <Zap className="w-8 h-8 text-amber-500" />
                            Content Generation
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Generate articles using the CMS orchestrator</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => canaryTest.mutate()}
                            disabled={canaryTest.isPending}
                            variant="outline"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {canaryTest.isPending ? 'Testing...' : 'Canary Test'}
                        </Button>
                        <Button
                            onClick={() => fullExecute.mutate({
                                goals: { volume: 10, quality: 80 }
                            })}
                            disabled={fullExecute.isPending}
                        >
                            <Play className="w-4 h-4 mr-2" />
                            {fullExecute.isPending ? 'Generating...' : 'Generate Content'}
                        </Button>
                    </div>
                </div>

                {/* Bulk Generation Panel */}
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Bulk Content Generation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <BulkGenerationPanel />
                    </CardContent>
                </Card>
            </AdminPageContainer>
        </AdminLayout>
    );
}
