"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPageContainer from '@/components/admin/AdminPageContainer';
import ContentCalendarWidget from '@/components/admin/ContentCalendarWidget';
import { Calendar } from 'lucide-react';

export default function ContentCalendarPage() {
    return (
        <AdminLayout>
            <AdminPageContainer>
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-wt-gold-subtle flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-wt-gold" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-wt-text tracking-tight">Content Calendar</h1>
                            <p className="text-sm text-wt-text-muted mt-0.5">
                                Event-aware content planning based on Indian financial calendar
                            </p>
                        </div>
                    </div>
                </div>
                <ContentCalendarWidget variant="full" />
            </AdminPageContainer>
        </AdminLayout>
    );
}
