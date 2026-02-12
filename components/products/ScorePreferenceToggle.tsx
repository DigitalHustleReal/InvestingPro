"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plane, Wallet, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoringWeights } from '@/lib/products/scoring-rules';

interface ScorePreferenceToggleProps {
  currentWeights: ScoringWeights;
  onWeightChange: (weights: ScoringWeights) => void;
}

export default function ScorePreferenceToggle({ currentWeights, onWeightChange }: ScorePreferenceToggleProps) {
    const preferences = [
        {
            id: 'balanced',
            label: 'Balanced',
            icon: Sparkles,
            weights: { rewards: 0.35, fees: 0.30, travel: 0.35 }
        },
        {
            id: 'travel',
            label: 'Travel',
            icon: Plane,
            weights: { rewards: 0.20, fees: 0.10, travel: 0.70 } // Heavy travel focus
        },
        {
            id: 'fees',
            label: 'Low Fees',
            icon: Wallet,
            weights: { rewards: 0.20, fees: 0.70, travel: 0.10 } // Heavy fee focus
        },
        {
            id: 'shopping',
            label: 'Shopping',
            icon: ShoppingCart,
            weights: { rewards: 0.70, fees: 0.20, travel: 0.10 } // Heavy rewards focus
        }
    ];

    // Helper to determine active state
    // We check if values match roughly
    const activeId = preferences.find(p => 
        p.weights.rewards === currentWeights.rewards && 
        p.weights.fees === currentWeights.fees &&
        p.weights.travel === currentWeights.travel
    )?.id || 'balanced';

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Personalization</h3>
                    <p className="text-xs text-slate-500">Adjust how we score these cards for you.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferences.map((pref) => {
                    const isActive = activeId === pref.id;
                    const Icon = pref.icon;
                    
                    return (
                        <button
                            key={pref.id}
                            onClick={() => onWeightChange(pref.weights)}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 border",
                                isActive 
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-105" 
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-600")} />
                            {pref.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
