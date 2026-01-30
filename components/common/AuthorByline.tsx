import React from 'react';
import { BadgeCheck, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorBylineProps {
  authorName?: string;
  authorRole?: string;
  lastUpdated?: string;
  verified?: boolean;
  className?: string; // Correctly typed optional prop
}

export default function AuthorByline({
  authorName = "Aditi Sharma",
  authorRole = "Senior Financial Analyst (CFP)",
  lastUpdated = "Today",
  verified = true,
  className
}: AuthorBylineProps) {
  return (
    <div className={cn("flex items-center gap-3 py-4 border-b border-slate-100 dark:border-slate-800 mb-6 font-sans", className)}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
           {authorName.charAt(0)}
        </div>
        {verified && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                <BadgeCheck className="w-4 h-4 text-primary-500 fill-blue-50/20" />
            </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Reviewed by {authorName}
            </span>
            <Shield className="w-3 h-3 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{authorRole}</span>
            <span>•</span>
            <span>Updated {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
