"use client";

import { useState, useRef } from 'react';
import { mediaService, UploadProgress } from '@/lib/media/media-service';

interface UploadItem {
    id: string;
    file: File;
    progress: UploadProgress | null;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    url?: string;
    error?: string;
}

export function BulkUploader() {
    const [items, setItems] = useState<UploadItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesSelected = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newItems: UploadItem[] = Array.from(files).map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            progress: null,
            status: 'pending' as const
        }));

        setItems(prev => [...prev, ...newItems]);
    };

    const handleUploadAll = async () => {
        setUploading(true);

        const pendingItems = items.filter(item => item.status === 'pending');

        for (const item of pendingItems) {
            // Update status to uploading
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, status: 'uploading' as const } : i
            ));

            try {
                const media = await mediaService.uploadImage(item.file, {
                    folder: 'bulk-uploads',
                    onProgress: (progress) => {
                        setItems(prev => prev.map(i =>
                            i.id === item.id ? { ...i, progress } : i
                        ));
                    }
                });

                // Mark as complete
                setItems(prev => prev.map(i =>
                    i.id === item.id
                        ? { ...i, status: 'complete' as const, url: media.publicUrl }
                        : i
                ));
            } catch (error: any) {
                // Mark as error
                setItems(prev => prev.map(i =>
                    i.id === item.id
                        ? { ...i, status: 'error' as const, error: error.message }
                        : i
                ));
            }
        }

        setUploading(false);
    };

    const handleRemove = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleClearCompleted = () => {
        setItems(prev => prev.filter(i => i.status !== 'complete'));
    };

    const stats = {
        total: items.length,
        pending: items.filter(i => i.status === 'pending').length,
        uploading: items.filter(i => i.status === 'uploading').length,
        complete: items.filter(i => i.status === 'complete').length,
        error: items.filter(i => i.status === 'error').length
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ðŸ“¤ Bulk Upload
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Upload multiple images at once. All images will be automatically optimized.
                </p>

                {/* Stats */}
                {stats.total > 0 && (
                    <div className="flex gap-4 mb-4 text-sm">
                        <span className="text-gray-600">Total: <strong>{stats.total}</strong></span>
                        {stats.pending > 0 && <span className="text-secondary-600">Pending: <strong>{stats.pending}</strong></span>}
                        {stats.uploading > 0 && <span className="text-accent-600">Uploading: <strong>{stats.uploading}</strong></span>}
                        {stats.complete > 0 && <span className="text-success-600">Complete: <strong>{stats.complete}</strong></span>}
                        {stats.error > 0 && <span className="text-danger-600">Error: <strong>{stats.error}</strong></span>}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFilesSelected(e.target.files)}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium disabled:opacity-50"
                    >
                        âž• Select Files
                    </button>
                    {stats.pending > 0 && (
                        <button
                            onClick={handleUploadAll}
                            disabled={uploading}
                            className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 font-medium disabled:opacity-50"
                        >
                            {uploading ? 'â³ Uploading...' : `â¬†ï¸ Upload ${stats.pending} File${stats.pending > 1 ? 's' : ''}`}
                        </button>
                    )}
                    {stats.complete > 0 && !uploading && (
                        <button
                            onClick={handleClearCompleted}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            ðŸ—‘ï¸ Clear Completed
                        </button>
                    )}
                </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-auto p-4">
                {items.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-600 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-600 text-lg font-medium mb-2">
                                No files selected
                            </p>
                            <p className="text-gray-600 dark:text-gray-500 text-sm mb-4">
                                Click "Select Files" to choose multiple images
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`border rounded-lg p-3 ${
                                    item.status === 'complete'
                                        ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                                        : item.status === 'error'
                                        ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
                                        : item.status === 'uploading'
                                        ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800'
                                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Status Icon */}
                                    <div className="text-2xl">
                                        {item.status === 'complete' ? 'âœ…' :
                                         item.status === 'error' ? 'âŒ' :
                                         item.status === 'uploading' ? 'â³' : 'ðŸ“„'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {item.file.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>

                                        {/* Progress */}
                                        {item.progress && item.status === 'uploading' && (
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${item.progress.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {item.progress.message} ({item.progress.progress}%)
                                                </p>
                                            </div>
                                        )}

                                        {/* Error */}
                                        {item.error && (
                                            <p className="text-sm text-danger-600 mt-1">
                                                {item.error}
                                            </p>
                                        )}

                                        {/* Complete */}
                                        {item.status === 'complete' && (
                                            <p className="text-sm text-success-600 mt-1">
                                                âœ“ Upload complete!
                                            </p>
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    {(item.status === 'pending' || item.status === 'error') && (
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            disabled={uploading}
                                            className="px-3 py-1 text-sm bg-danger-100 text-danger-700 rounded hover:bg-danger-200 disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Tips */}
            {items.length === 0 && (
                <div className="border-t p-4 bg-secondary-50">
                    <h4 className="text-sm font-medium text-secondary-900 mb-2">
                        ðŸ’¡ Bulk Upload Tips:
                    </h4>
                    <ul className="text-sm text-secondary-700 space-y-1">
                        <li>• Select multiple files at once (Ctrl/Cmd + Click)</li>
                        <li>• All images will be automatically optimized to WebP</li>
                        <li>• Typical savings: 50-80% per image</li>
                        <li>• Upload up to 50 images at a time</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
