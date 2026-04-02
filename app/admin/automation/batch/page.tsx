"use client";

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    Factory, 
    Play, 
    Pause, 
    RotateCcw, // Refresh replacement
    CheckCircle2, 
    AlertCircle, 
    Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
// import { CategorySelect } from '@/components/admin/ArticleInspector'; // Unused
import { createClient } from '@/lib/supabase/client';

export default function BatchGeneratorPage() {
    const [name, setName] = useState('');
    const [keywords, setKeywords] = useState('');
    const [category, setCategory] = useState('investing-basics');
    const [status, setStatus] = useState('draft');
    const [tone, setTone] = useState('Professional');
    const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');
    const [authors, setAuthors] = useState<any[]>([]);

    useEffect(() => {
        const fetchAuthors = async () => {
             const supabase = createClient();
             const { data } = await supabase.from('authors').select('id, name, role').eq('is_active', true);
             if (data) setAuthors(data);
        };
        fetchAuthors();
    }, []);
    
    const [isCreating, setIsCreating] = useState(false);
    const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
    const [batchProgress, setBatchProgress] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Monitor active batch
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeBatchId && isProcessing) {
            interval = setInterval(processNextItem, 2000); // Process every 2s client-side loop
        }
        return () => clearInterval(interval);
    }, [activeBatchId, isProcessing]);

    const handleCreateBatch = async () => {
        if (!name || !keywords) {
            toast.error('Name and keywords required');
            return;
        }

        const keywordList = keywords.split('\n').filter(k => k.trim().length > 0);
        if (keywordList.length === 0) {
            toast.error('No valid keywords found');
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch('/api/batch/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    keywords: keywordList,
                    config: {
                        category,
                        status,
                        tone,
                        auto_image: true,
                        author_id: selectedAuthorId || null
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setActiveBatchId(data.batchId);
            setBatchProgress({
                total: keywordList.length,
                completed: 0,
                failed: 0,
                items: []
            });
            setIsProcessing(true); // Start processing immediately
            toast.success(`Batch "${name}" created! Starting generation...`);

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const processNextItem = async () => {
        try {
            const res = await fetch('/api/batch/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batchId: activeBatchId })
            });

            const data = await res.json();
            
            if (data.message === 'No pending items') {
                setIsProcessing(false);
                toast.success('Batch generation complete!');
                return;
            }

            if (!res.ok) {
                logger.error('Item failure:', data.error);
                // Update local stats for visual feedback
                setBatchProgress((prev: any) => ({
                    ...prev,
                    failed: (prev?.failed || 0) + 1
                }));
            } else {
                // Success
                setBatchProgress((prev: any) => ({
                    ...prev,
                    completed: (prev?.completed || 0) + 1,
                    items: [...(prev?.items || []), data.item]
                }));
            }

        } catch (error) {
            logger.error('Process loop error:', error);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-secondary-100 rounded-lg text-secondary-600">
                        <Factory className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground dark:text-foreground">Content Factory</h1>
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground">Generate hundreds of articles in bulk using AI.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* INPUT FORM */}
                    <div className="space-y-6 bg-white dark:bg-surface-darker dark:bg-surface-darker p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h2 className="font-semibold text-lg mb-4">1. Configure Batch</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <Label>Batch Name</Label>
                                <Input 
                                    placeholder="e.g. Credit Card Basics Phase 1" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Keywords / Topics (One per line)</Label>
                                <Textarea 
                                    placeholder="What is a credit card?&#10;How does interest work?&#10;Best rewards cards 2026"
                                    className="h-40 font-mono text-sm"
                                    value={keywords}
                                    onChange={e => setKeywords(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
                                    {keywords.split('\n').filter(k => k.trim()).length} articles will be generated.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Category</Label>
                                    <div className="mt-1">
                                        {/* Simple select fallback if component tricky, but we have it */}
                                        <select 
                                            className="w-full h-10 rounded-md border border-gray-300 dark:border-border dark:border-border px-3 text-sm bg-white dark:bg-muted dark:bg-muted text-gray-900 dark:text-foreground dark:text-foreground"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                        >
                                            <option value="investing-basics">Investing Basics</option>
                                            <option value="credit-cards">Credit Cards</option>
                                            <option value="banking">Banking</option>
                                            <option value="loans">Loans</option>
                                            <option value="insurance">Insurance</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <select 
                                        className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm mt-1"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Publish Immediately</option>
                                        <option value="scheduled">Schedule</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label>Author Persona (Optional)</Label>
                                <select 
                                    className="w-full h-10 rounded-md border border-gray-300 dark:border-border dark:border-border px-3 text-sm mt-1 bg-white dark:bg-muted dark:bg-muted text-gray-900 dark:text-foreground dark:text-foreground"
                                    value={selectedAuthorId}
                                    onChange={e => setSelectedAuthorId(e.target.value)}
                                >
                                    <option value="">-- No Specific Author --</option>
                                    {authors.map((author: any) => (
                                        <option key={author.id} value={author.id}>
                                            {author.name} ({author.role})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button 
                                onClick={handleCreateBatch} 
                                disabled={isCreating || isProcessing}
                                className="w-full h-12 text-lg bg-secondary-600 hover:bg-secondary-700"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Generation Engine
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* PROGRESS MONITOR */}
                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">2. Live Progress</h2>
                            {isProcessing && (
                                <span className="flex items-center text-xs font-mono text-success-600 bg-success-100 px-2 py-1 rounded-full animate-pulse">
                                    <RotateCcw className="w-3 h-3 mr-1 animate-spin" />
                                    ENGINE RUNNING
                                </span>
                            )}
                        </div>

                        {!activeBatchId ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground/70 dark:text-muted-foreground/70 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                                <Factory className="w-12 h-12 mb-2 opacity-20" />
                                <p>Ready to build content</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-muted dark:bg-muted p-3 rounded-lg border border-gray-200 dark:border-border dark:border-border shadow-sm text-center">
                                        <div className="text-2xl font-bold text-gray-700 dark:text-foreground dark:text-foreground">{batchProgress?.total || 0}</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Total</div>
                                    </div>
                                    <div className="bg-white dark:bg-muted dark:bg-muted p-3 rounded-lg border border-gray-200 dark:border-border dark:border-border shadow-sm text-center">
                                        <div className="text-2xl font-bold text-success-600 dark:text-success-400">{batchProgress?.completed || 0}</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Done</div>
                                    </div>
                                    <div className="bg-white dark:bg-muted dark:bg-muted p-3 rounded-lg border border-gray-200 dark:border-border dark:border-border shadow-sm text-center">
                                        <div className="text-2xl font-bold text-danger-500 dark:text-danger-400">{batchProgress?.failed || 0}</div>
                                        <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/70 dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">Failed</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{Math.round(((batchProgress?.completed || 0) / (batchProgress?.total || 1)) * 100)}%</span>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-secondary-600 transition-all duration-500 ease-out"
                                            style={{ width: `${((batchProgress?.completed || 0) / (batchProgress?.total || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Log Feed */}
                                <div className="bg-surface-darker dark:bg-surface-darker rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs space-y-2">
                                    {batchProgress?.items?.length === 0 && (
                                        <div className="text-muted-foreground/70 dark:text-muted-foreground/70 italic">Waiting for logs...</div>
                                    )}
                                    {batchProgress?.items?.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center text-success-400 animate-in fade-in slide-in-from-left-2">
                                            <CheckCircle2 className="w-3 h-3 mr-2 shrink-0" />
                                            Generated: {item}
                                        </div>
                                    ))}
                                    {isProcessing && (
                                        <div className="flex items-center text-secondary-400">
                                            <Loader2 className="w-3 h-3 mr-2 animate-spin shrink-0" />
                                            Processing next item...
                                        </div>
                                    )}
                                </div>

                                {!isProcessing && batchProgress?.completed > 0 && (
                                    <Button 
                                        className="w-full" variant="outline"
                                        onClick={() => {
                                            setActiveBatchId(null);
                                            setBatchProgress(null);
                                            setName('');
                                            setKeywords('');
                                        }}
                                    >
                                        Start New Batch
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
