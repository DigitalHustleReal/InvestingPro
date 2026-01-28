import React from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface DifficultyBadgeProps {
  level: Difficulty;
  className?: string;
}

const config = {
  beginner: {
    label: 'Beginner Friendly',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    width: 'w-1/3'
  },
  intermediate: {
    label: 'Knowledge Required',
    color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    width: 'w-2/3'
  },
  expert: {
    label: 'Expert Guide',
    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800',
    width: 'w-full'
  }
};

export default function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  const meta = config[level];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all hover:scale-105",
      meta.color,
      className
    )}>
      <div className="w-10 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={cn("h-full bg-current opacity-60", meta.width)} />
      </div>
      <span>{meta.label}</span>
    </div>
  );
}
