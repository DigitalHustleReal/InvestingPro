"use client";

import { useState } from 'react';
import { MediaFile } from '@/lib/media/media-service';
import { Button } from '@/components/ui/Button';
import { MediaLibrary } from './MediaLibrary';

interface FeaturedImageSelectorProps {
    value?: string; // Current image URL
    mediaId?: string; // Current media ID
    onChange: (url: string, mediaId: string) => void;
    label?: string;
}

export function FeaturedImageSelector({
    value,
    mediaId,
    onChange,
    label = 'Featured Image'
}: FeaturedImageSelectorProps) {
    const [showLibrary, setShowLibrary] = useState(false);

    const handleSelect = (media: MediaFile) => {
        onChange(media.publicUrl, media.id);
        setShowLibrary(false);
    };

    const handleRemove = () => {
        onChange('', '');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {value ? (
                <div className="space-y-3">
                    {/* Preview */}
                    <div className="relative inline-block max-w-full">
                        <img
                            src={value}
                            alt="Featured"
                            className="max-w-full max-h-64 rounded-lg border border-gray-300 shadow-sm"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
                            <p className="text-xs text-white">Featured Image</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowLibrary(true)}
                            size="sm"
                        >
                            🖼️ Change Image
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleRemove}
                            size="sm"
                        >
                            🗑️ Remove
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => window.open(value, '_blank')}
                            size="sm"
                        >
                            👁️ View Full Size
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowLibrary(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors"
                >
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-600"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-700">
                            Select Featured Image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Click to browse media library
                        </p>
                    </div>
                </button>
            )}

            {/* Media Library Modal */}
            {showLibrary && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                Select Featured Image
                            </h3>
                            <button
                                onClick={() => setShowLibrary(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Library */}
                        <div className="flex-1 overflow-hidden">
                            <MediaLibrary
                                mode="select"
                                onSelect={handleSelect}
                                selectedId={mediaId}
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                💡 Tip: Upload images in 16:9 ratio (1200×675px) for best results
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowLibrary(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
