"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, Wifi } from 'lucide-react';

// Bank brand colors for professional card visuals
const BANK_THEMES: Record<string, { bg: string; accent: string; text: string }> = {
  'HDFC Bank': { bg: 'from-blue-900 to-blue-700', accent: 'text-red-400', text: 'text-white' },
  'ICICI Bank': { bg: 'from-orange-700 to-orange-500', accent: 'text-white', text: 'text-white' },
  'SBI Card': { bg: 'from-blue-800 to-cyan-600', accent: 'text-yellow-300', text: 'text-white' },
  'Axis Bank': { bg: 'from-purple-900 to-pink-700', accent: 'text-pink-300', text: 'text-white' },
  'Kotak Mahindra Bank': { bg: 'from-red-700 to-red-500', accent: 'text-yellow-300', text: 'text-white' },
  'American Express': { bg: 'from-slate-800 to-slate-600', accent: 'text-blue-300', text: 'text-white' },
  'IDFC First Bank': { bg: 'from-emerald-800 to-emerald-600', accent: 'text-yellow-300', text: 'text-white' },
  'Standard Chartered': { bg: 'from-green-800 to-green-600', accent: 'text-teal-300', text: 'text-white' },
  'YES Bank': { bg: 'from-blue-700 to-blue-500', accent: 'text-red-400', text: 'text-white' },
  'RBL Bank': { bg: 'from-violet-800 to-violet-600', accent: 'text-orange-300', text: 'text-white' },
  'IndusInd Bank': { bg: 'from-indigo-800 to-indigo-600', accent: 'text-amber-300', text: 'text-white' },
  'HSBC': { bg: 'from-red-800 to-red-600', accent: 'text-white', text: 'text-white' },
  'AU Small Finance Bank': { bg: 'from-orange-600 to-amber-500', accent: 'text-white', text: 'text-white' },
  'Federal Bank': { bg: 'from-yellow-700 to-yellow-500', accent: 'text-blue-800', text: 'text-blue-900' },
};

// Card type badges
const TYPE_LABELS: Record<string, string> = {
  'Cashback': 'CASHBACK',
  'Rewards': 'REWARDS',
  'Travel': 'TRAVEL',
  'Premium': 'PREMIUM',
  'Shopping': 'SHOPPING',
  'Fuel': 'FUEL',
};

interface CreditCardVisualProps {
  cardName: string;
  bankName: string;
  cardType?: string;
  imageUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CreditCardVisual({
  cardName,
  bankName,
  cardType,
  imageUrl,
  className,
  size = 'md'
}: CreditCardVisualProps) {
  // If real image exists, use it
  if (imageUrl) {
    return (
      <div className={cn(
        "relative rounded-xl overflow-hidden shadow-lg",
        size === 'sm' && 'w-48 h-30',
        size === 'md' && 'w-64 h-40',
        size === 'lg' && 'w-80 h-50',
        className
      )}>
        <img
          src={imageUrl}
          alt={cardName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // Generate styled card visual
  const theme = BANK_THEMES[bankName] || { bg: 'from-slate-700 to-slate-500', accent: 'text-emerald-300', text: 'text-white' };
  const typeLabel = cardType ? TYPE_LABELS[cardType] || cardType.toUpperCase() : '';

  const sizeClasses = {
    sm: 'w-48 h-[120px] p-3 text-[10px]',
    md: 'w-64 h-40 p-4 text-xs',
    lg: 'w-80 h-[200px] p-5 text-sm',
  };

  return (
    <div className={cn(
      `relative bg-gradient-to-br ${theme.bg} rounded-xl shadow-lg overflow-hidden`,
      sizeClasses[size],
      className
    )}>
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />

      {/* Chip + Contactless */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-6 rounded bg-yellow-400/80 border border-yellow-500/40" />
        <Wifi className={cn("w-4 h-4 rotate-90", theme.text, "opacity-60")} />
      </div>

      {/* Card Number Placeholder */}
      <div className={cn("font-mono tracking-widest mb-2 opacity-70", theme.text)}>
        •••• •••• •••• ••••
      </div>

      {/* Card Name */}
      <div className={cn("font-semibold leading-tight line-clamp-2 mb-1", theme.text)}>
        {cardName.replace(bankName, '').replace('Credit Card', '').trim() || cardName}
      </div>

      {/* Bottom row: Bank + Type */}
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
        <span className={cn("font-bold uppercase tracking-wider opacity-80", theme.text, size === 'sm' ? 'text-[9px]' : 'text-[10px]')}>
          {bankName}
        </span>
        {typeLabel && (
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-white/15 backdrop-blur-sm",
            theme.accent
          )}>
            {typeLabel}
          </span>
        )}
      </div>

      {/* Network logo placeholder */}
      <div className="absolute top-3 right-3">
        <CreditCard className={cn("w-5 h-5 opacity-40", theme.text)} />
      </div>
    </div>
  );
}
