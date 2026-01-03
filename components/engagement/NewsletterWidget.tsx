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
                        className="w-full bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-400/20 transition-all h-12"
                    />
                    {!email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-400 animate-pulse" />
                    )}
                </div>
                <Button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="h-12 px-6 bg-blue-600 hover:bg-teal-500 text-white transition-colors"
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
    
    // ... rest of variants (truncated for simplicity as 'minimal' is the one used in Footer)
    return null; 
}
