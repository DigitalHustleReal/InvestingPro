"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Play, Search, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ActionCenter() {
    const router = useRouter();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 py-2">
            {/* Left: Greeting */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-white premium-gradient-text drop-shadow-sm">
                    {greeting}, Shiv.
                </h1>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    System Operational • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            {/* Middle: Brief Stats Insight (utilises the gap) */}
            <div className="hidden md:flex items-center gap-8 px-8 border-x border-white/5 mx-4">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Session</p>
                    <p className="text-sm font-bold text-white">4 New Drafts</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Integrity</p>
                    <p className="text-sm font-bold text-emerald-400">99.8%</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Queue</p>
                    <p className="text-sm font-bold text-amber-400">12 Pending</p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl bg-white/5 border border-white/10 relative hover:bg-white/10 transition-all"
                >
                    <Bell className="w-4 h-4 text-gray-300" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </Button>

                <div className="h-10 w-px bg-white/10 mx-1" />

                <Button 
                    onClick={() => router.push('/admin/cms')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 h-11 font-bold text-[11px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10 border-none"
                >
                    <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                    Sync Pipeline
                </Button>

                <Button 
                    onClick={() => router.push('/admin/articles/new')}
                    className="bg-white hover:bg-gray-100 text-black rounded-xl px-6 h-11 font-bold text-[11px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl border-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Article
                </Button>
            </div>
        </div>
    );
}
