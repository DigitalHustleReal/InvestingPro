'use client';

import React, { useEffect } from 'react';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, LayoutDashboard, Bug, ArrowLeft } from 'lucide-react';

/**
 * Admin-specific Error Boundary.
 * Catches unhandled errors within /admin/* pages and shows a
 * professional, actionable error UI instead of the generic
 * "System Interruption" screen.
 */
export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error('[Admin Error Boundary]', error);
    }, [error]);

    // Extract module name from the error stack or message
    const getModuleName = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const segments = path.split('/').filter(Boolean);
            return segments[segments.length - 1] || 'dashboard';
        }
        return 'unknown';
    };

    const moduleName = getModuleName();
    const errorCode = `ADMIN_${moduleName.toUpperCase()}_ERR`;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#102A43] to-[#243B53] border border-amber-500/30 flex items-center justify-center shadow-xl">
                            <AlertTriangle className="w-8 h-8 text-amber-400" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-[#102A43] text-center mb-2">
                    Module Error
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
                    The <span className="font-semibold text-gray-700 capitalize">{moduleName.replace(/-/g, ' ')}</span> module encountered an issue. This is usually temporary.
                </p>

                {/* Error Details Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Bug className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Diagnostic Info</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Error Code</span>
                            <code className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-amber-700">{errorCode}</code>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Module</span>
                            <span className="text-xs font-medium capitalize text-gray-700">{moduleName.replace(/-/g, ' ')}</span>
                        </div>
                        {error.digest && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Digest</span>
                                <code className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 max-w-[200px] truncate">{error.digest}</code>
                            </div>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                            <p className="text-[11px] text-gray-300 italic line-clamp-2">{error.message || 'An unexpected error occurred.'}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => reset()}
                        className="w-full h-11 bg-[#102A43] hover:bg-[#243B53] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry This Page
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 h-10 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Go Back
                        </button>
                        <Link
                            href="/admin"
                            className="flex-1 h-10 bg-white border border-gray-200 hover:border-amber-300 text-gray-600 hover:text-amber-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-amber-50"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Tip */}
                <p className="text-[10px] text-gray-300 text-center mt-6">
                    If this keeps happening, try clearing your browser cache or contact support.
                </p>
            </div>
        </div>
    );
}
