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
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 group">
                {imageUrl ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                        {/* Overlay with remove button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <button
                                onClick={handleRemove}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-danger-600 text-white p-2 rounded-full hover:bg-danger-700"
                                title="Remove image"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
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
                    className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white"
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
                    className="flex-1 bg-white hover:bg-slate-50 border-slate-300"
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
                        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Select Featured Image</h2>
                            <button
                                onClick={() => setShowMediaLibrary(false)}
                                className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
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
