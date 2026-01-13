"use client";

import { AlertCircle, CheckCircle } from 'lucide-react';

interface SEOPreviewProps {
    title: string;
    metaDescription: string;
    slug: string;
    featuredImage?: string;
}

export function SEOPreview({ title, metaDescription, slug, featuredImage }: SEOPreviewProps) {
    const baseUrl = 'https://investingpro.in'; // Update with your domain
    const fullUrl = `${baseUrl}/articles/${slug}`;

    // SEO limits
    const titleLimit = 60;
    const descLimit = 160;

    const titleLength = title.length;
    const descLength = metaDescription.length;

    const titleStatus = titleLength <= titleLimit ? 'good' : 'warning';
    const descStatus = descLength >= 120 && descLength <= descLimit ? 'good' : 'warning';

    return (
        <div className="space-y-6">
            {/* Google Search Preview */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Google Search Preview</h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    {/* URL */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center text-white text-xs font-bold">
                            I
                        </div>
                        <span className="text-sm text-slate-600">{fullUrl}</span>
                    </div>

                    {/* Title */}
                    <div className="text-secondary-600 text-xl font-medium hover:underline cursor-pointer mb-1">
                        {title || 'Your Article Title Here'}
                    </div>

                    {/* Description */}
                    <div className="text-slate-700 text-sm leading-relaxed">
                        {metaDescription || 'Your meta description will appear here. Make it compelling to increase click-through rates!'}
                    </div>
                </div>

                {/* Character Counts */}
                <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Title ({titleLength}/{titleLimit} chars)</span>
                        {titleStatus === 'good' ? (
                            <div className="flex items-center gap-1 text-success-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Optimal</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-orange-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs">Too long</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${
                                titleStatus === 'good' ? 'bg-success-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min((titleLength / titleLimit) * 100, 100)}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-slate-600">Description ({descLength}/{descLimit} chars)</span>
                        {descStatus === 'good' ? (
                            <div className="flex items-center gap-1 text-success-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Optimal</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-orange-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs">{descLength < 120 ? 'Too short' : 'Too long'}</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${
                                descStatus === 'good' ? 'bg-success-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${Math.min((descLength / descLimit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Social Share Preview */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Social Share Preview (Facebook/LinkedIn)</h3>
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    {featuredImage && (
                        <div className="aspect-[1.91/1] relative bg-slate-100">
                            <img
                                src={featuredImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-4 bg-slate-50">
                        <div className="text-xs text-slate-500 uppercase mb-1">investingpro.in</div>
                        <div className="font-semibold text-slate-900 mb-1">
                            {title || 'Your Article Title'}
                        </div>
                        <div className="text-sm text-slate-600 line-clamp-2">
                            {metaDescription || 'Your description here'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Twitter Card Preview */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Twitter Card Preview</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {featuredImage && (
                        <div className="aspect-[2/1] relative bg-slate-100">
                            <img
                                src={featuredImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-3">
                        <div className="font-semibold text-slate-900 mb-1 text-sm">
                            {title || 'Your Article Title'}
                        </div>
                        <div className="text-xs text-slate-600 line-clamp-2">
                            {metaDescription || 'Your description here'}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">🔗 investingpro.in</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
