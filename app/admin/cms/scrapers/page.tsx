"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ScraperDashboard from '@/components/admin/ScraperDashboard';
import { Rss } from 'lucide-react';

export default function CMSScrapersPage() {
    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Rss className="w-8 h-8 text-accent-400" />
                            Scraper Management
                        </h1>
                        <p className="text-slate-400">Monitor and manage all data scrapers</p>
                    </div>
                </div>

                {/* Scraper Dashboard */}
                <ScraperDashboard />
            </div>
        </AdminLayout>
    );
}
