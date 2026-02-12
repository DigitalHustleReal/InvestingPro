"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // In a real app, this would call your API/Supabase to store the email
            setSubscribed(true);
        }
    };

    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 mb-8 shadow-lg shadow-primary-500/25">
                    <Mail className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Stay Ahead with Weekly Insights
                </h2>
                <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
                    Get expert investment tips, investment strategies, and exclusive offers delivered to your inbox every week.
                </p>

                <div className="max-w-md mx-auto">
                    {!subscribed ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 h-14 bg-white/5 border-white/20 text-white placeholder:text-slate-600 rounded-xl focus:border-primary-400 focus:ring-primary-400 focus:bg-white/10 transition-all outline-none"
                                required
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 px-8 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 rounded-xl shadow-lg shadow-primary-500/25 border-0 text-white font-semibold"
                            >
                                Subscribe
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-center gap-3 text-primary-400 bg-primary-500/10 dark:bg-primary-500/20 p-4 rounded-xl border border-primary-500/20 dark:border-primary-500/30 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-lg font-medium">Thanks for subscribing!</span>
                        </div>
                    )}
                </div>

                <p className="text-slate-500 text-sm mt-8">
                    Join 50,000+ investors. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
