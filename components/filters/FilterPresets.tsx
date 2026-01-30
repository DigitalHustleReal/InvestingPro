"use client";

import React from 'react';
import { ShoppingBag, Plane, Fuel, Sparkles, Gift, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterPreset {
  id: string;
  label: string;
  icon: React.ReactNode;
  filters: {
    type?: string;
    annualFee?: number;
    minCreditScore?: number;
  };
}

const CREDIT_CARD_PRESETS: FilterPreset[] = [
  {
    id: 'shopping',
    label: 'Best for Shopping',
    icon: <ShoppingBag className="w-4 h-4" />,
    filters: { type: 'Shopping' }
  },
  {
    id: 'travel',
    label: 'Best for Travel',
    icon: <Plane className="w-4 h-4" />,
    filters: { type: 'Travel' }
  },
  {
    id: 'fuel',
    label: 'Best for Fuel',
    icon: <Fuel className="w-4 h-4" />,
    filters: { type: 'Fuel' }
  },
  {
    id: 'premium',
    label: 'Premium Cards',
    icon: <Sparkles className="w-4 h-4" />,
    filters: { type: 'Premium' }
  },
  {
    id: 'rewards',
    label: 'Best Rewards',
    icon: <Gift className="w-4 h-4" />,
    filters: { type: 'Rewards' }
  },
  {
    id: 'no-fee',
    label: 'No Annual Fee',
    icon: <Zap className="w-4 h-4" />,
    filters: { annualFee: 0 }
  }
];

interface FilterPresetsProps {
  onPresetClick: (filters: FilterPreset['filters']) => void;
  className?: string;
}

export default function FilterPresets({ onPresetClick, className }: FilterPresetsProps) {
  return (
    <div className={cn("w-full", className)}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        Quick Filters
      </h3>
      <div className="flex flex-wrap gap-2">
        {CREDIT_CARD_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetClick(preset.filters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all"
          >
            {preset.icon}
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
