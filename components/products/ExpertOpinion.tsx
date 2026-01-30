"use client";

import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpertOpinionProps {
  productName: string;
  opinion: string;
  expertName?: string;
  expertTitle?: string;
  className?: string;
}

export default function ExpertOpinion({ 
  productName, 
  opinion, 
  expertName = "Priya Sharma",
  expertTitle = "Senior Financial Analyst",
  className 
}: ExpertOpinionProps) {
  return (
    <div className={cn(
      "relative group overflow-hidden rounded-2xl border border-primary-200/50 dark:border-primary-800/30 bg-gradient-to-br from-primary-50/80 to-white dark:from-primary-950/20 dark:to-slate-900/50 backdrop-blur-sm p-6 shadow-lg shadow-primary-500/5",
      className
    )}>
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
            Expert Opinion
          </span>
        </div>

        {/* Opinion Text */}
        <blockquote className="text-slate-800 dark:text-slate-200 font-semibold text-lg leading-relaxed mb-4 italic">
          "{opinion}"
        </blockquote>

        {/* Expert Info */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{expertName}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{expertTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
