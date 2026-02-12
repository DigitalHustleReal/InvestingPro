"use client";

import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScoreBreakdownItem {
    label: string;
    score: number; // 0-10
    weight: number; // 0-1
}

interface ScoreExplanationProps {
    overall: number; // 0-10
    breakdown: ScoreBreakdownItem[];
    children: React.ReactNode;
}

export default function ScoreExplanation({ overall, breakdown, children }: ScoreExplanationProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-help">
          {children}
        </TooltipTrigger>
        <TooltipContent side="left" className="w-64 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl z-50">
           <div className="space-y-3">
               <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                   <h4 className="font-bold text-slate-900 dark:text-white text-sm">AI Match Score</h4>
                   <span className={cn(
                       "text-lg font-black",
                       overall >= 8 ? "text-success-600" : overall >= 6 ? "text-amber-500" : "text-slate-500"
                   )}>
                       {Math.round(overall * 10)}%
                   </span>
               </div>
               
               <div className="space-y-2">
                   {breakdown.map((item, idx) => (
                       <div key={idx} className="flex flex-col gap-1">
                           <div className="flex justify-between text-xs text-slate-500">
                               <span>{item.label}</span>
                               <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                   {item.score.toFixed(1)}/10
                               </span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div 
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{ width: `${(item.score / 10) * 100}%` }}
                               />
                           </div>
                           <div className="text-[10px] text-slate-600 text-right">
                               Weight: {Math.round(item.weight * 100)}%
                           </div>
                       </div>
                   ))}
               </div>
               
               <p className="text-[10px] text-slate-600 pt-2 border-t border-slate-100 dark:border-slate-800 italic">
                   Scores are personalized based on your selected preferences (Rewards, Travel, Fees).
               </p>
           </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
