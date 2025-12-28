"use client";

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AIContentGenerator from '@/components/admin/AIContentGenerator';

/**
 * AI Generator Page
 * 
 * Provides access to AI content generation tools
 */
export default function AIGeneratorPage() {
    return (
        <AdminLayout>
            <div className="h-full flex flex-col bg-slate-50">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">AI Content Generator</h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Generate content drafts using AI assistance (requires human review)
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    <AIContentGenerator />
                </div>
            </div>
        </AdminLayout>
    );
}
