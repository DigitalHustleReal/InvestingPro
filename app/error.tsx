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
    logger.error('Global Application Error', error);
  }, [error]);

  // Determine error type for actionable guidance
  const getErrorGuidance = () => {
    const msg = error.message?.toLowerCase() || '';
    if (msg.includes('timeout') || msg.includes('timed out'))
      return { title: 'Request Timed Out', detail: 'The server took too long to respond. This usually resolves on retry.' };
    if (msg.includes('network') || msg.includes('fetch'))
      return { title: 'Connection Issue', detail: 'Could not reach the server. Check your internet connection and try again.' };
    if (msg.includes('auth') || msg.includes('unauthorized') || msg.includes('401'))
      return { title: 'Session Expired', detail: 'Your login session may have expired. Try refreshing or logging in again.' };
    if (msg.includes('not found') || msg.includes('404'))
      return { title: 'Page Not Found', detail: 'The requested resource could not be located.' };
    return { title: 'Something Went Wrong', detail: 'An unexpected error occurred. Our team has been notified.' };
  };

  const guidance = getErrorGuidance();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-danger-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white dark:bg-gray-900 w-20 h-20 rounded-2xl flex items-center justify-center border border-danger-100 dark:border-danger-500/20 shadow-xl">
            <AlertCircle className="w-10 h-10 text-danger-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          {guidance.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {guidance.detail}
        </p>

        {error.digest && (
          <div className="mb-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Error Reference</p>
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{error.digest}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 h-12 rounded-xl font-bold flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Request
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              asChild
              className="flex-1 h-12 rounded-xl border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>

            <Button 
              variant="outline" 
              asChild
              className="flex-1 h-12 rounded-xl border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Link href="/admin">
                <Home className="w-4 h-4" />
                Admin
              </Link>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Link 
              href="/support" 
              className="text-sm font-medium text-gray-500 hover:text-secondary-500 flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 rounded-lg p-2"
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
