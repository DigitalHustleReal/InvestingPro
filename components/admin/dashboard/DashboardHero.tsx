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
        <div className="relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {greeting}, Shiv.
                    </h1>
                    <p className="mt-2 text-slate-300">
                        Here is your platform&apos;s status for today.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button 
                        onClick={() => window.open('/', '_blank')}
                        variant="outline" 
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Site
                    </Button>
                    
                    <Button 
                        onClick={() => router.push('/admin/cms')}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold border-none"
                    >
                        <Play className="mr-2 h-4 w-4" />
                        Run Pipeline
                    </Button>

                    <Button 
                        onClick={() => router.push('/admin/articles/new')}
                        className="bg-white hover:bg-slate-100 text-slate-900 font-semibold border-none"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </div>
            </div>
        </div>
    );
}
