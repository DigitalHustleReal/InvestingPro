"use client";

import { useState } from 'react';
import { X, Maximize2, Minimize2, RefreshCw, Copy } from 'lucide-react';
import { ArticlePreview } from './ArticlePreview';
import { DeviceSwitcher } from './DeviceSwitcher';
import { SEOPreview } from './SEOPreview';
import { toast } from 'sonner';

interface PreviewModalProps {
    article: {
        title: string;
        content: string;
        excerpt?: string;
        featured_image?: string;
        author?: {
            name: string;
            avatar_url?: string;
        };
        category?: string;
        tags?: string[];
        created_at?: string;
        read_time?: number;
        slug?: string;
        seo_title?: string;
        seo_description?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function PreviewModal({ article, isOpen, onClose }: PreviewModalProps) {
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState<'article' | 'seo'>('article');

    if (!isOpen) return null;

    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const previewUrl = `${window.location.origin}/articles/${slug}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(previewUrl);
        toast.success('Preview link copied to clipboard!');
    };

    const handleRefresh = () => {
        toast.info('Preview refreshed');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`absolute bg-white shadow-2xl transition-all duration-300 ${
                isFullscreen
                    ? 'inset-0'
                    : 'inset-4 md:inset-8 rounded-lg'
            }`}>
                {/* Header */}
                <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
                        
                        {/* Tabs */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('article')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    activeTab === 'article'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Article
                            </button>
                            <button
                                onClick={() => setActiveTab('seo')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    activeTab === 'seo'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                SEO
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Device Switcher - Only show for article tab */}
                        {activeTab === 'article' && (
                            <DeviceSwitcher currentDevice={device} onDeviceChange={setDevice} />
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 ml-4 border-l border-slate-200 pl-4">
                            <button
                                onClick={handleRefresh}
                                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                                title="Refresh preview"
                            >
                                <RefreshCw className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                                title="Copy preview link"
                            >
                                <Copy className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="w-4 h-4 text-slate-600" />
                                ) : (
                                    <Maximize2 className="w-4 h-4 text-slate-600" />
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                                title="Close preview"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="overflow-auto h-[calc(100%-73px)] bg-slate-50">
                    <div className="p-6">
                        {activeTab === 'article' ? (
                            <ArticlePreview article={article} mode={device} />
                        ) : (
                            <div className="max-w-2xl mx-auto">
                                <SEOPreview
                                    title={article.seo_title || article.title}
                                    metaDescription={article.seo_description || article.excerpt || ''}
                                    slug={slug}
                                    featuredImage={article.featured_image}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
