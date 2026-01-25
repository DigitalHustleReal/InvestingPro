"use client";

import React from 'react';
import ContentCalendarWidget from '@/components/admin/ContentCalendarWidget';

export default function ContentCalendarPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Content Calendar</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Event-aware content planning based on Indian financial calendar
                    </p>
                </div>

                <ContentCalendarWidget variant="full" />
            </div>
        </div>
    );
}
