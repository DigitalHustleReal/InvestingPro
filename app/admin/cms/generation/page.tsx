"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BulkGenerationPanel from '@/components/admin/BulkGenerationPanel';
import { Zap, Play, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function CMSGenerationPage() {
    const queryClient = useQueryClient();
    const [generating, setGenerating] = useState(false);

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
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-3">
                            <Zap className="w-8 h-8 text-primary-400" />
                            Content Generation
                        </h1>
                        <p className="text-muted-foreground dark:text-muted-foreground">Generate articles using the CMS orchestrator</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => canaryTest.mutate()}
                            disabled={canaryTest.isPending}
                            variant="outline"
                            className="bg-white/5 border-border dark:border-border hover:bg-white/10"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {canaryTest.isPending ? 'Testing...' : 'Canary Test'}
                        </Button>
                        <Button
                            onClick={() => fullExecute.mutate({
                                goals: { volume: 10, quality: 80 }
                            })}
                            disabled={fullExecute.isPending}
                            className="bg-primary-600 hover:bg-primary-700"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            {fullExecute.isPending ? 'Generating...' : 'Generate Content'}
                        </Button>
                    </div>
                </div>

                {/* Bulk Generation Panel */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardHeader className="border-b border-border/50 dark:border-border/50">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                            <Zap className="w-5 h-5 text-primary-400" />
                            Bulk Content Generation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <BulkGenerationPanel />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
