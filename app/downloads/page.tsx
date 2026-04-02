"use client";

import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/common/SEOHead';
import DownloadResourceCard from '@/components/downloads/DownloadResourceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Download, FileSpreadsheet, BookOpen, FileText } from 'lucide-react';

interface DownloadResource {
    id: string;
    title: string;
    description: string;
    type: 'dashboard' | 'guide' | 'ebook' | 'pdf' | 'template';
    format: 'excel' | 'google-sheets' | 'notion' | 'pdf' | 'csv';
    category: string;
    downloadCount: number;
    requiresEmail: boolean;
    tags: string[];
}

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState<DownloadResource[]>([]);
    const [filteredDownloads, setFilteredDownloads] = useState<DownloadResource[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDownloads();
    }, []);

    useEffect(() => {
        filterDownloads();
    }, [downloads, searchQuery, selectedCategory]);

    const loadDownloads = async () => {
        try {
            const response = await fetch('/api/downloads');
            const data = await response.json();
            
            if (data.success) {
                setDownloads(data.downloads);
            }
        } catch (error) {
            console.error('Error loading downloads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDownloads = () => {
        let filtered = downloads;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(d => d.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(d =>
                d.title.toLowerCase().includes(query) ||
                d.description.toLowerCase().includes(query) ||
                d.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredDownloads(filtered);
    };

    const categories = [
        { value: 'all', label: 'All Resources' },
        { value: 'portfolio', label: 'Portfolio' },
        { value: 'expenses', label: 'Expenses' },
        { value: 'tax', label: 'Tax Planning' },
        { value: 'budget', label: 'Budget' },
        { value: 'credit-cards', label: 'Credit Cards' },
        { value: 'mutual-funds', label: 'Mutual Funds' }
    ];

    const typeStats = {
        dashboard: downloads.filter(d => d.type === 'dashboard').length,
        guide: downloads.filter(d => d.type === 'guide').length,
        ebook: downloads.filter(d => d.type === 'ebook').length,
        pdf: downloads.filter(d => d.type === 'pdf').length
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <SEOHead
                title="Free Finance Resources - Dashboards, Guides & eBooks | InvestingPro"
                description="Download free finance dashboards, guides, and eBooks. Portfolio trackers, expense trackers, tax planning tools, and more."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-6">
                        <Download className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Free Finance Resources
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Download free Excel dashboards, PDF guides, eBooks, and templates to manage your finances better.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
                        <FileSpreadsheet className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{typeStats.dashboard}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Dashboards</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
                        <BookOpen className="w-6 h-6 text-success-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{typeStats.guide}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Guides</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
                        <BookOpen className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{typeStats.ebook}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">eBooks</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
                        <FileText className="w-6 h-6 text-danger-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{typeStats.pdf}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">PDFs</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                        <Input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                            {categories.map(cat => (
                                <TabsTrigger key={cat.value} value={cat.value}>
                                    {cat.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Downloads Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
                    </div>
                ) : filteredDownloads.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No resources found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDownloads.map(resource => (
                            <DownloadResourceCard
                                key={resource.id}
                                resource={resource}
                                onDownload={async (resourceId, email) => {
                                    const response = await fetch('/api/downloads', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            resourceId,
                                            email,
                                            source: 'downloads_page'
                                        })
                                    });

                                    if (response.ok) {
                                        const data = await response.json();
                                        if (data.downloadUrl) {
                                            window.open(data.downloadUrl, '_blank');
                                        }
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
