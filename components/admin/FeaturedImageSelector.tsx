"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [initialView, setInitialView] = useState<'grid' | 'upload'>('grid');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={() => {
                        setInitialView('grid');
                        setShowMediaLibrary(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white hover:bg-gray-100 border-wt-border text-gray-700 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Browse
                </Button>
                <Button
                    onClick={() => {
                        // We need a way to pass 'upload' view. 
                        // Since we can't pass props dynamically to the state without prop drilling or context, 
                        // we can use a separate state or just rely on the user clicking the tab.
                        // BUT, I added initialView prop! I need to store the desired view in state.
                        setInitialView('upload');
                        setShowMediaLibrary(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-white hover:bg-gray-100 border-wt-border text-gray-700 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                </Button>
                <Button
                    onClick={handleAutoSelect}
                    disabled={autoSelecting || !articleTitle}
                    variant="default"
                    size="sm"
                    className="col-span-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900"
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
                            Auto-Select (AI)
                        </>
                    )}
                </Button>
            </div>

            {/* Media Library Modal - Rendered via Portal */}
            {showMediaLibrary && mounted && createPortal(
                <div className="fixed inset-0 z-[100000] isolate overflow-hidden flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowMediaLibrary(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-wt-border dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-950 flex-none z-20">
                            <h2 className="text-lg font-semibold text-wt-text dark:text-white">Select Featured Image</h2>
                            <button
                                onClick={() => setShowMediaLibrary(false)}
                                className="p-2 hover:bg-wt-card dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5 text-wt-text-muted dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Media Library */}
                        <div className="flex-1 overflow-hidden relative z-0">
                            <MediaLibrary
                                onSelect={handleMediaSelect}
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
