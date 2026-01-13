"use client";

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, FlaskConical, TrendingUp, Search, Play, Pause, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';

// Mock data to demonstrate UI before DB population
const MOCK_EXPERIMENTS = [
    {
        id: '1',
        article: 'Best Credit Cards for Travel 2026',
        status: 'running',
        daysRunning: 5,
        variants: [
            { id: 'v1', text: 'Best Credit Cards for Travel 2026', ctr: 2.4, isControl: true, impressions: 1200 },
            { id: 'v2', text: 'Top 10 Travel Cards to Maximize Rewards', ctr: 3.8, isControl: false, impressions: 1150 }
        ]
    },
    {
        id: '2',
        article: 'Understanding Compound Interest',
        status: 'paused',
        daysRunning: 12,
        variants: [
            { id: 'v3', text: 'Understanding Compound Interest', ctr: 1.2, isControl: true, impressions: 500 },
            { id: 'v4', text: 'How to Retire Rich with Compound Interest', ctr: 4.5, isControl: false, impressions: 520 }
        ]
    }
];

export default function SEOExperimentsPage() {
    const [experiments, setExperiments] = useState(MOCK_EXPERIMENTS);
    const [newTestOpen, setNewTestOpen] = useState(false);

    return (
        <AdminLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <FlaskConical className="w-8 h-8 text-secondary-600" />
                            Title A/B Experiments
                        </h1>
                        <p className="text-slate-500">Optimize headlines to maximize Click-Through Rate (CTR).</p>
                    </div>
                    <Button onClick={() => setNewTestOpen(true)} className="bg-secondary-600 hover:bg-secondary-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Experiment
                    </Button>
                </div>

                {/* Active Experiments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experiments.map(exp => (
                        <Card key={exp.id} className="border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                                <div>
                                    <Badge variant={exp.status === 'running' ? 'default' : 'secondary'} className={exp.status === 'running' ? 'bg-success-600' : ''}>
                                        {exp.status === 'running' ? 'Active' : 'Paused'}
                                    </Badge>
                                    <span className="text-xs text-slate-500 ml-3">Running for {exp.daysRunning} days</span>
                                </div>
                                <div className="flex gap-2">
                                    {exp.status === 'running' ? (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-success-600">
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <h3 className="font-bold text-slate-800 line-clamp-1" title={exp.article}>
                                    {exp.article}
                                </h3>

                                <div className="space-y-4">
                                    {exp.variants.map((variant, idx) => {
                                        const isWinner = variant.ctr >= Math.max(...exp.variants.map(v => v.ctr));
                                        return (
                                            <div key={variant.id} className={`relative p-3 rounded-lg border ${isWinner ? 'border-green-200 bg-success-50' : 'border-slate-100 bg-white'}`}>
                                                {isWinner && (
                                                    <div className="absolute -right-2 -top-2 bg-success-500 text-white p-1 rounded-full shadow-sm">
                                                        <TrendingUp className="w-3 h-3" />
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                        {variant.isControl ? 'Control (A)' : `Variant (${String.fromCharCode(66 + idx - 1)})`}
                                                    </span>
                                                    <span className={`text-sm font-bold ${isWinner ? 'text-success-700' : 'text-slate-600'}`}>
                                                        {variant.ctr}% CTR
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 mb-2">{variant.text}</p>
                                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${isWinner ? 'bg-success-500' : 'bg-slate-400'}`} 
                                                        style={{ width: `${(variant.ctr / 5) * 100}%` }} // normalized to 5% max
                                                    />
                                                </div>
                                                <div className="mt-2 text-[10px] text-slate-400">
                                                    {variant.impressions.toLocaleString()} impressions
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <Button variant="outline" size="sm" className="text-xs">
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* New Experiment Dialog (Stub) */}
                <Dialog open={newTestOpen} onOpenChange={setNewTestOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Start New A/B Test</DialogTitle>
                        </DialogHeader>
                        <div className="py-8 text-center text-slate-500">
                            <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Select an article and add alternate titles to test.</p>
                            <p className="text-xs mt-2">(Functionality connected to DB in next step)</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
