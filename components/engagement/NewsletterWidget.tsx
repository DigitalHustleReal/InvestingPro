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

    // Static Professional Placeholder
    const placeholderText = "Enter your work email";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;
        
        setStatus('loading');

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
            setMessage("You're on the list!");
            setEmail('');

        } catch (error) {
            setStatus('error');
            setMessage('Failed to subscribe. Please try again.');
        }
    };

    // Minimal inline form
    if (variant === 'minimal') {
        return (
            <form onSubmit={handleSubmit} className={cn("flex gap-2 relative", className)}>
                <div className="relative flex-1">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 transition-all h-12"
                    />
                    {!email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-400 animate-pulse" />
                    )}
                </div>
                <Button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="h-12 px-6 bg-gradient-to-r from-primary-500 to-success-600 hover:from-primary-400 hover:to-success-500 text-white font-semibold transition-all shadow-lg shadow-primary-500/20"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : status === 'success' ? (
                        <Check className="w-4 h-4 text-white" />
                    ) : (
                        <ArrowRight className="w-4 h-4 text-white" />
                    )}
                </Button>
            </form>
        );
    }
    
    // Card variant (Default)
    return (
        <Card className={cn("bg-gradient-to-br from-slate-900 to-slate-800 border-none text-white overflow-hidden relative", className)}>
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Mail className="w-6 h-6 text-primary-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                    {description}
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder={placeholderText}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading' || status === 'success'}
                            className="w-full h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:bg-white/10 transition-all text-center"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full h-12 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : status === 'success' ? (
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5" /> Subscribed
                            </div>
                        ) : (
                            "Subscribe for Free"
                        )}
                    </Button>
                </form>

                <p className="mt-6 text-xs text-slate-500 flex items-center gap-1.5 opacity-80">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Join 12,000+ smart investors
                </p>
            </CardContent>
        </Card>
    );
}
