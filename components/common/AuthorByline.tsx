import React from 'react';
import { BadgeCheck, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorBylineProps {
  authorName?: string;
  authorRole?: string;
  lastUpdated?: string;
  verified?: boolean;
  className?: string;
  isTeam?: boolean;
}

export default function AuthorByline({
  authorName = "InvestingPro Research Team",
  authorRole = "Data-Driven Financial Analysis",
  lastUpdated,
  verified = true,
  className,
  isTeam = true
}: AuthorBylineProps) {
  const displayDate = lastUpdated || new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className={cn("flex items-center gap-3 py-4 border-b border-slate-100 dark:border-slate-800 mb-6 font-sans", className)}>
      <div className="relative">
        {isTeam ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white">
            <Users className="w-5 h-5" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-sm">
            {authorName.charAt(0)}
          </div>
        )}
        {verified && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                <BadgeCheck className="w-4 h-4 text-green-600 fill-green-50/20" />
            </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isTeam ? authorName : `Reviewed by ${authorName}`}
            </span>
            <Shield className="w-3 h-3 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-600">
            <span>{authorRole}</span>
            <span>•</span>
            <span>Updated {displayDate}</span>
        </div>
      </div>
    </div>
  );
}
