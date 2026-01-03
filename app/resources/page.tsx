
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import LeadMagnet from '@/components/monetization/LeadMagnet';
import SEOHead from '@/components/common/SEOHead';

const RESOURCES = [
    {
        id: 'expense-tracker',
        title: 'Master Expense Tracker (v2.0)',
        description: 'Comprehensive Excel dashboard to track your daily expenses, monthly savings rate, and automated budget alerts.',
        type: 'excel',
        downloadUrl: '#', // User can replace with actual link
        category: 'Personal Finance',
        popular: true
    },
    {
        id: 'fire-calculator',
        title: 'Financial Independence (FIRE) Planner',
        description: 'A powerful Google Sheet to project your retirement timeline based on current savings and expected inflation.',
        type: 'google-sheet',
        downloadUrl: '#',
        category: 'Retirement',
        popular: true
    },
    {
        id: 'investment-checklist',
        title: 'Stock Analysis Checklist',
        description: 'A 20-point PDF checklist used by professional investors to vet companies before buying.',
        type: 'pdf',
        downloadUrl: '#',
        category: 'Investing',
        popular: false
    },
    {
        id: 'tax-planner-2026',
        title: 'Tax Savings Optimizer (FY 2025-26)',
        description: 'Minimize your tax burden with this automated calculator for Old vs New tax regimes.',
        type: 'excel',
        downloadUrl: '#',
        category: 'Taxation',
        popular: false
    }
];

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <SEOHead 
                title="Free Investing & Personal Finance Resources | InvestingPro"
                description="Download expert-crafted Excel templates, Google Sheets calculators, and PDF checklists to manage your personal finance better."
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Hero section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Free <span className="text-teal-600">Financial Toolkits</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Stop guessing your numbers. Download our professional-grade templates used by thousands of savvy investors.
                    </p>
                </div>

                {/* Featured Magnet */}
                <div className="mb-16">
                    <LeadMagnet 
                        title="Comprehensive Expense & Budget Tracker"
                        description="Our most popular tool. A pro-level Excel dashboard that helps you find 'hidden' savings in your monthly spending. Includes automated charts and tax categorization."
                        type="excel"
                        downloadUrl="#"
                    />
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {RESOURCES.filter(r => r.id !== 'expense-tracker').map(resource => (
                        <Card key={resource.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${
                                        resource.type === 'excel' ? 'bg-green-50 text-green-600' : 
                                        resource.type === 'google-sheet' ? 'bg-blue-50 text-primary-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] uppercase">{resource.category}</Badge>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {resource.description}
                                </p>
                            </div>
                            <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {resource.type.replace('-', ' ')}
                                </span>
                                <Button variant="ghost" size="sm" className="font-bold text-teal-600 hover:text-teal-700 p-0 flex items-center gap-1">
                                    Download <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Trust Banner */}
                <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 py-10 border-y border-slate-200 opacity-60 grayscale">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-medium">Secure Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        <span className="font-medium">No Macros Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-medium">Cloud Sync Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
