"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, Twitter, Linkedin, Instagram, Mail, FileText, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface RepurposePanelProps {
    articleId?: string;
    title: string;
    content: string;
}

export function RepurposePanel({ articleId, title, content }: RepurposePanelProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<{ format: string; data: any } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleRepurpose = async (format: string) => {
        setLoading(format);
        setResult(null);
        try {
            const res = await fetch('/api/admin/repurpose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId, title, content, format })
            });
            
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            setResult({ format, data: json.data });
            toast.success(`Successfully repurposed for ${format}!`);
        } catch (e: any) {
            toast.error("Repurposing failed: " + e.message);
        } finally {
            setLoading(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRepurpose('twitter')}
                    disabled={!!loading}
                    className="flex flex-col h-auto py-3 gap-2"
                >
                    {loading === 'twitter' ? <Loader2 className="w-5 h-5 animate-spin"/> : <Twitter className="w-5 h-5 text-sky-500"/>}
                    <span className="text-[10px] uppercase font-bold">Twitter Thread</span>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRepurpose('linkedin')}
                    disabled={!!loading}
                    className="flex flex-col h-auto py-3 gap-2"
                >
                    {loading === 'linkedin' ? <Loader2 className="w-5 h-5 animate-spin"/> : <Linkedin className="w-5 h-5 text-blue-700"/>}
                    <span className="text-[10px] uppercase font-bold">LinkedIn Post</span>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRepurpose('instagram')}
                    disabled={!!loading}
                    className="flex flex-col h-auto py-3 gap-2"
                >
                    {loading === 'instagram' ? <Loader2 className="w-5 h-5 animate-spin"/> : <Instagram className="w-5 h-5 text-pink-600"/>}
                    <span className="text-[10px] uppercase font-bold">Instagram Carousel</span>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRepurpose('newsletter')}
                    disabled={!!loading}
                    className="flex flex-col h-auto py-3 gap-2"
                >
                    {loading === 'newsletter' ? <Loader2 className="w-5 h-5 animate-spin"/> : <Mail className="w-5 h-5 text-amber-500"/>}
                    <span className="text-[10px] uppercase font-bold">Newsletter</span>
                </Button>
            </div>

            {result && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-surface-darker rounded-xl border border-wt-border animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-wt-gold"/>
                            <span className="text-xs font-bold uppercase text-slate-500">{result.format} Preview</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}>
                            {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                        </Button>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {renderRepurposeResult(result)}
                    </div>
                </div>
            )}
        </div>
    );
}

function renderRepurposeResult({ format, data }: { format: string; data: any }) {
    if (format === 'twitter' && data.tweets) {
        return data.tweets.map((t: string, i: number) => (
            <div key={i} className="mb-4 pb-2 border-b border-wt-border last:border-0">
                <span className="text-blue-500 font-bold mr-2">{i + 1}/</span>
                {t}
            </div>
        ));
    }
    
    if (format === 'linkedin') {
        return (
            <div>
                <div className="mb-4">{data.post}</div>
                {data.hooks && data.hooks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-wt-border">
                        <p className="font-bold text-slate-400 mb-2">Alternative Hooks:</p>
                        {data.hooks.map((h: string, i: number) => (
                            <div key={i} className="mb-2 italic">"{h}"</div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (format === 'newsletter') {
        return (
            <div>
                <div className="mb-2 font-bold text-wt-text">{data.subject}</div>
                <div className="mb-4">{data.teaser}</div>
                <ul className="list-disc pl-4">
                    {data.bullets?.map((b: string, i: number) => (
                        <li key={i} className="mb-1">{b}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return JSON.stringify(data, null, 2);
}
