"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Image as ImageIcon, Upload, X, Wand2, Loader2 } from 'lucide-react';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import type { MediaFile } from '@/lib/media/media-service';
import { toast } from 'sonner';

interface FeaturedImageSelectorProps {
    imageUrl?: string;
    onImageSelect: (url: string) => void;
    // Article context for auto-selection
    articleTitle?: string;
    articleCategory?: string;
    keywords?: string[];
}

export default function FeaturedImageSelector({ 
    imageUrl, 
    onImageSelect,
    articleTitle = '',
    articleCategory = '',
    keywords = []
}: FeaturedImageSelectorProps) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [autoSelecting, setAutoSelecting] = useState(false);

    const handleMediaSelect = (media: MediaFile) => {
        onImageSelect(media.publicUrl);
        setShowMediaLibrary(false);
    };

    const handleRemove = () => {
        onImageSelect('');
    };

    const handleAutoSelect = async () => {
        if (!articleTitle.trim()) {
            toast.error('Please add an article title first');
            return;
        }

        setAutoSelecting(true);
        try {
            const response = await fetch('/api/auto-featured-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: articleTitle,
                    category: articleCategory,
                    keywords,
                    preferAI: false // Stock photos first (cheaper)
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to auto-select image');
            }

            const data = await response.json();
            onImageSelect(data.url);
            toast.success(data.message || 'Image selected automatically!');
        } catch (error: any) {
            console.error('Auto-select error:', error);
            toast.error(error.message || 'Failed to auto-select image');
        } finally {
            setAutoSelecting(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Preview */}
            <div className="relative aspect-video bg-wt-card rounded-lg overflow-hidden border-2 border-dashed border-wt-border group">
                {imageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                        {/* Overlay with remove button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <button
                                onClick={handleRemove}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-danger-600 text-wt-text dark:text-wt-text p-2 rounded-full hover:bg-danger-700"
                                title="Remove image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-wt-text-muted dark:text-wt-text-muted">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">No image selected</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={handleAutoSelect}
                    disabled={autoSelecting || !articleTitle}
                    variant="default"
                    size="sm"
                    className="flex-1 bg-wt-nav hover:bg-wt-nav-light text-wt-text dark:text-wt-text"
                    title="Automatically select image based on article title"
                >
                    {autoSelecting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Auto-Selecting...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Auto-Select
                        </>
                    )}
                </Button>
                <Button
                    onClick={() => setShowMediaLibrary(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white hover:bg-wt-surface-hover border-wt-border"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {imageUrl ? 'Change' : 'Choose'}
                </Button>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMediaLibrary(false)}
                    />

                    {/* Modal */}
                    <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="border-b border-wt-border px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-wt-text">Select Featured Image</h2>
                            <button
                                onClick={() => setShowMediaLibrary(false)}
                                className="p-2 hover:bg-wt-card rounded-md transition-colors"
                            >
                                <X className="w-5 h-5 text-wt-text-muted/50 dark:text-wt-text-muted/50" />
                            </button>
                        </div>

                        {/* Media Library */}
                        <div className="flex-1 overflow-hidden">
                            <MediaLibrary
                                onSelect={handleMediaSelect}
                                mode="select"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
