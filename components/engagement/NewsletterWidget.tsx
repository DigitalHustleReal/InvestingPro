"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, Check, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterWidgetProps {
    variant?: 'inline' | 'card' | 'banner' | 'minimal';
    title?: string;
    description?: string;
    className?: string;
}

export default function NewsletterWidget({
    variant = 'card',
    title = "Stay Updated",
    description = "Get the latest investing insights delivered to your inbox.",
    className
}: NewsletterWidgetProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;
        
        setStatus('loading');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong');
            }

        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    // Minimal inline form
    if (variant === 'minimal') {
        return (
            <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === 'success' ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <ArrowRight className="w-4 h-4" />
                    )}
                </Button>
            </form>
        );
    }

    // Banner style
    if (variant === 'banner') {
        return (
            <div className={cn(
                "bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6",
                className
            )}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">{title}</span>
                        <span className="text-white/80">•</span>
                        <span className="text-white/80 text-sm">{description}</span>
                    </div>
                    {status === 'success' ? (
                        <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4" />
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading'}
                                className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                            <Button 
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-white text-indigo-600 hover:bg-white/90"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Subscribe'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // Inline style (for article pages)
    if (variant === 'inline') {
        return (
            <div className={cn(
                "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20",
                className
            )}>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
                        
                        {status === 'success' ? (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                <Check className="w-4 h-4" />
                                {message}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                    className="flex-1"
                                />
                                <Button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Subscribe'
                                    )}
                                </Button>
                            </form>
                        )}
                        {status === 'error' && (
                            <p className="text-sm text-rose-500 mt-2">{message}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Card style (default)
    return (
        <Card className={cn(
            "overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-white/10",
            className
        )}>
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                    <Mail className="w-8 h-8 text-white" />
                </div>
                
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 mb-4">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Free Newsletter
                </Badge>
                
                <h3 className="text-2xl font-extrabold text-white mb-2">{title}</h3>
                <p className="text-slate-400 mb-6 max-w-sm mx-auto">{description}</p>
                
                {status === 'success' ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 py-4">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">{message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-12 text-center"
                        />
                        <Button 
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Subscribe Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                )}
                
                {status === 'error' && (
                    <p className="text-sm text-rose-400 mt-3">{message}</p>
                )}
                
                <p className="text-xs text-slate-500 mt-4">
                    Join 10,000+ smart investors. Unsubscribe anytime.
                </p>
            </CardContent>
        </Card>
    );
}
