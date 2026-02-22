"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Play, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardHero() {
    const router = useRouter();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-background via-card to-background shadow-lg border border-border animate-fade-in">
            {/* Background decoration - subtler */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        {greeting}, Shiv.
                    </h1>
                    <p className="text-muted-foreground max-w-lg">
                        System is operational. Daily budget is active.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button 
                        onClick={() => router.push('/admin/cms')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold border-none shadow-lg shadow-primary/20 transition-all"
                    >
                        <Play className="mr-2 h-4 w-4" />
                        Run Pipeline
                    </Button>

                    <Button 
                        onClick={() => router.push('/admin/articles/new')}
                        className="bg-muted text-foreground hover:bg-muted/80 font-semibold border-none shadow-lg transition-all"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </div>
            </div>
        </div>
    );
}
