import React from 'react';

/**
 * Admin Skeleton Loader.
 * Shown automatically by Next.js during page transitions within /admin/*.
 * Uses the admin's navy+gold theme for visual consistency.
 */
export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-[#F0F4F8]">
            {/* Top bar skeleton */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-100 rounded-lg animate-pulse" />
            </div>

            <div className="flex">
                {/* Sidebar skeleton */}
                <div className="hidden md:block w-64 min-h-[calc(100vh-4rem)] bg-[#102A43] p-4 space-y-4">
                    {/* Logo area */}
                    <div className="h-8 w-36 bg-white/10 rounded-lg animate-pulse mb-6" />
                    {/* Nav links */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2">
                            <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 bg-white/10 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                        </div>
                    ))}
                    {/* Section divider */}
                    <div className="border-t border-white/5 my-4" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i + 10} className="flex items-center gap-3 px-3 py-2">
                            <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
                            <div className="h-3 bg-white/5 rounded animate-pulse" style={{ width: `${50 + Math.random() * 30}%` }} />
                        </div>
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 p-6 md:p-8 space-y-6">
                    {/* Page header */}
                    <div className="space-y-2">
                        <div className="h-7 w-56 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-4 w-80 bg-gray-100 rounded-lg animate-pulse" />
                    </div>

                    {/* KPI cards row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
                                </div>
                                <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse" />
                                <div className="h-3 w-24 bg-gray-50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Main content card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                        {/* Table header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
                            </div>
                        </div>
                        {/* Table rows */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-3 border-t border-gray-50">
                                <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${40 + Math.random() * 30}%` }} />
                                    <div className="h-3 bg-gray-50 rounded animate-pulse" style={{ width: `${30 + Math.random() * 20}%` }} />
                                </div>
                                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                                <div className="h-6 w-12 bg-gray-50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Loading indicator */}
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
