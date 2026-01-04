'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our internal logging service
    logger.error('Global Application Error', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white dark:bg-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-500/20 shadow-xl">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          System Interruption
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          We've encountered an unexpected technical issue. Our engineering team has been notified and is working on a fix.
        </p>

        {error.digest && (
          <div className="mb-8 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Error Reference</p>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">{error.digest}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Request
          </Button>

          <Button 
            variant="outline" 
            asChild
            className="w-full h-12 rounded-xl border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Return to Command Center
            </Link>
          </Button>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link 
              href="/support" 
              className="text-sm font-medium text-slate-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Report this behavior
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
