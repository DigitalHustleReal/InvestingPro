"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X, Mail, Gift, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ExitIntentPopupProps {
    variant?: 'newsletter' | 'offer' | 'product';
    onSubscribe?: (email: string) => Promise<void>;
    onClose?: () => void;
}

export default function ExitIntentPopup({ 
    variant = 'newsletter',
    onSubscribe,
    onClose 
}: ExitIntentPopupProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Check if user has already seen the popup
        const hasSeen = localStorage.getItem('exitIntentShown');
        if (hasSeen) {
            setHasShown(true);
            return;
        }

        // Detect exit intent (mouse leaving viewport at top)
        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger if mouse is moving upward (leaving from top)
            if (e.clientY <= 0 && !hasShown) {
                setOpen(true);
                setHasShown(true);
                localStorage.setItem('exitIntentShown', 'true');
            }
        };

        // Also detect on mobile (scroll up gesture)
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // If scrolling up quickly (exit intent behavior)
            if (currentScrollY < lastScrollY && currentScrollY < 100 && !hasShown) {
                setOpen(true);
                setHasShown(true);
                localStorage.setItem('exitIntentShown', 'true');
            }
            lastScrollY = currentScrollY;
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasShown]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSubmitting(true);
        try {
            if (onSubscribe) {
                await onSubscribe(email);
            } else {
                // Default: call newsletter subscribe API
                const response = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    throw new Error('Failed to subscribe');
                }
            }

            toast.success('Thank you for subscribing!');
            setOpen(false);
            if (onClose) onClose();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content based on variant */}
                    {variant === 'newsletter' && (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <DialogTitle className="text-2xl font-bold mb-2">
                                Don't Miss Out!
                            </DialogTitle>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Get weekly investment insights, exclusive deals, and expert tips delivered to your inbox.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full"
                                >
                                    {submitting ? 'Subscribing...' : 'Subscribe Now'}
                                </Button>
                            </form>
                            <p className="text-xs text-slate-500 mt-4">
                                Unsubscribe anytime. We respect your privacy.
                            </p>
                        </div>
                    )}

                    {variant === 'offer' && (
                        <div className="p-8 text-center bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                <Gift className="w-8 h-8" />
                            </div>
                            <DialogTitle className="text-2xl font-bold mb-2 text-white">
                                Special Offer Just For You!
                            </DialogTitle>
                            <p className="text-white/90 mb-6">
                                Subscribe and get instant access to our premium credit card comparison tool.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/90"
                                />
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-white text-primary-600 hover:bg-white/90"
                                >
                                    {submitting ? 'Claiming...' : 'Claim Offer'}
                                </Button>
                            </form>
                        </div>
                    )}

                    {variant === 'product' && (
                        <div className="p-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-success-600 dark:text-success-400" />
                            </div>
                            <DialogTitle className="text-2xl font-bold mb-2 text-center">
                                Find Your Perfect Match
                            </DialogTitle>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
                                Get personalized product recommendations based on your needs.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full"
                                >
                                    {submitting ? 'Getting Recommendations...' : 'Get Recommendations'}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
