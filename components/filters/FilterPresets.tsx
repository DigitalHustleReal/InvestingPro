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
      <div className="font-mono text-[11px] uppercase tracking-wider text-indian-gold mb-3">
        Quick filters · One click
      </div>
      <div className="flex flex-wrap gap-2">
        {CREDIT_CARD_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetClick(preset.filters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink/10 rounded-sm font-medium text-[13px] text-ink hover:border-ink hover:bg-ink hover:text-canvas transition-all"
          >
            <span className="text-indian-gold [&_svg]:w-4 [&_svg]:h-4">
              {preset.icon}
            </span>
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
