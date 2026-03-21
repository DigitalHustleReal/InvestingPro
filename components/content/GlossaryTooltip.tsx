"use client";

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { slugifyTerm } from '@/lib/utils';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  category?: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, definition, category, children }: GlossaryTooltipProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b-2 border-dashed border-primary-300 dark:border-primary-700 hover:border-solid hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all font-medium text-slate-800 dark:text-slate-200">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{category || 'Definition'}</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white mb-1">{term}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            {definition}
          </p>

          <Link href={`/glossary/${slugifyTerm(term)}`} className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">
            Read Full Guide <ArrowRight className="w-3 h-3" />
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
