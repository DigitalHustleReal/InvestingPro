'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Loader2, Terminal, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ContentGeneratorPage() {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        if (!topic) return;

        setIsGenerating(true);
        setLogs(['🚀 Starting Content Factory...', `📌 Topic: "${topic}"`]);
        setResult(null);

        try {
            const response = await fetch('/api/admin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });

            const data = await response.json();

            if (data.logs) {
                setLogs(prev => [...prev, ...data.logs]);
            }

            if (data.success) {
                setResult(data);
                setLogs(prev => [...prev, '✨ Process Completed Successfully!']);
            } else {
                setLogs(prev => [...prev, `❌ Error: ${data.error}`]);
            }

        } catch (error) {
            setLogs(prev => [...prev, '💥 Network Failed']);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-teal-600" />
                    AI Content Factory
                </h1>
                <p className="text-slate-600 mt-2">
                    Generate full-length, SEO-optimized articles with images in one click.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white border-slate-200 shadow-sm">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Article Topic
                        </label>
                        <Input
                            placeholder="e.g. Best SIP Plans for 2026"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="mb-4"
                            disabled={isGenerating}
                        />
                        <Button 
                            onClick={handleGenerate} 
                            disabled={!topic || isGenerating}
                            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/20"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Article
                                </>
                            )}
                        </Button>
                    </Card>

                    {/* Stats / Info */}
                    <Card className="p-6 bg-slate-50 border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">System Status</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">AI Model</span>
                                <span className="text-green-600 font-medium">Active (Auto-Failover)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Images</span>
                                <span className="text-green-600 font-medium">Pollinations (Free)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Database</span>
                                <span className="text-green-600 font-medium">Connected</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Console Output */}
                <div className="lg:col-span-2">
                    <Card className="h-[500px] flex flex-col bg-slate-950 border-slate-800 shadow-2xl overflow-hidden font-mono">
                        <div className="p-6 md:p-8 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">System Output</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-2">
                            {logs.length === 0 && (
                                <div className="text-slate-600 text-sm italic">
                                    Ready to generate...
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className="text-sm">
                                    <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={
                                        log.includes('❌') || log.includes('💥') ? 'text-red-400' :
                                        log.includes('✅') ? 'text-green-400' :
                                        'text-slate-300'
                                    }>
                                        {log}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Success Action */}
                        {result && result.success && (
                            <div className="p-4 bg-green-900/20 border-t border-green-900/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Generation Complete</span>
                                </div>
                                <Link href={result.url}>
                                    <Button variant="outline" className="border-green-700 text-green-400 hover:bg-green-900/50 hover:text-green-300">
                                        View Published Article →
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
