"use client";

import { useState, useEffect } from 'react';
import { mediaService, MediaFile } from '@/lib/media/media-service';
import { MediaUploader } from './MediaUploader';
import { StockPhotosBrowser } from './StockPhotosBrowser';
import { BulkUploader } from './BulkUploader';
import { AIImageGenerator } from './AIImageGenerator';

interface MediaLibraryProps {
    onSelect?: (media: MediaFile) => void;
    mode?: 'browse' | 'select';
    selectedId?: string;
    initialView?: 'grid' | 'upload' | 'stock' | 'bulk' | 'ai';
}

export function MediaLibrary({ 
    onSelect,
    mode = 'browse',
    selectedId,
    initialView = 'grid'
}: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'upload' | 'stock' | 'bulk' | 'ai'>(initialView);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [folders, setFolders] = useState<Array<{ name: string; slug: string; count: number }>>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 24;

    useEffect(() => {
        loadMedia();
        loadFolders();
    }, [selectedFolder, page]);

    const loadMedia = async () => {
        try {
            setLoading(true);
            
            // Create a timeout promise that rejects after 10 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 10000);
            });

            const fetchPromise = mediaService.listMedia({
                limit,
                offset: (page - 1) * limit,
                folder: selectedFolder === 'all' ? undefined : selectedFolder,
                sortBy: 'created_at',
                sortOrder: 'desc'
            });

            const result = await Promise.race([fetchPromise, timeoutPromise]) as { data: MediaFile[], total: number };
            
            setMedia(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Failed to load media:', error);
            // Don't leave the user hanging - show empty state or error could be better, but at least stop loading
        } finally {
            setLoading(false);
        }
    };

    const loadFolders = async () => {
        try {
            const folderList = await mediaService.getFolders();
            setFolders(folderList);
        } catch (error) {
            console.error('Failed to load folders:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadMedia();
            return;
        }

        try {
            setLoading(true);
            const results = await mediaService.searchMedia(searchQuery);
            setMedia(results);
            setTotal(results.length);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this image? This action cannot be undone.')) return;

        try {
            await mediaService.deleteMedia(id);
            setMedia(media.filter(m => m.id !== id));
            setTotal(prev => prev - 1);
        } catch (error: any) {
            alert(error.message || 'Delete failed');
        }
    };

    const handleUploadComplete = (url: string, mediaId: string) => {
        loadMedia();
        setView('grid');
        
        // If in select mode, automatically select the uploaded image
        if (mode === 'select' && onSelect) {
            mediaService.getMediaById(mediaId).then(media => {
                if (media) onSelect(media);
            });
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-950">
            {/* Header / Tabs */}
            <div className="flex-none bg-white dark:bg-slate-950 px-4 pt-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-6">
                   {/* h2 removed */}
                   
                   <button
                       onClick={() => setView('upload')}
                       className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                           view === 'upload'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                       }`}
                   >
                       Upload Files
                       {view === 'upload' && (
                           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                       )}
                   </button>

                   <button
                       onClick={() => setView('grid')}
                       className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                           view === 'grid'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                       }`}
                   >
                       Media Library
                       {view === 'grid' && (
                           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                       )}
                   </button>

                   <button
                       onClick={() => setView('stock')}
                       className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                           view === 'stock'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                       }`}
                   >
                       Stock Photos
                       {view === 'stock' && (
                           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                       )}
                   </button>

                   <button
                       onClick={() => setView('ai')}
                       className={`pb-4 px-2 text-sm font-medium transition-all relative ${
                           view === 'ai'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                       }`}
                   >
                       AI Generate
                       {view === 'ai' && (
                           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                       )}
                   </button>
                </div>
            </div>

            {/* Toolbar (Only visible in Media Library view) */}
            {view === 'grid' && (
                <div className="flex-none p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Filters */}
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                        <select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            className="h-9 px-3 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
                        >
                            <option value="all">All media items</option>
                            {folders.map(folder => (
                                <option key={folder.slug} value={folder.slug}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                        <button 
                            onClick={loadMedia} // Refresh
                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            title="Refresh"
                        >
                            🔄
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                         <input
                            type="text"
                            placeholder="Search media items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full h-9 pl-9 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white placeholder-slate-400"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            🔍
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
                {view === 'upload' ? (
                    <MediaUploader
                        onUploadComplete={handleUploadComplete}
                        folder={selectedFolder === 'all' ? 'uploads' : selectedFolder}
                    />
                ) : view === 'stock' ? (
                    <StockPhotosBrowser
                        onSelect={(url, mediaId) => {
                            if (mode === 'select' && onSelect) {
                                mediaService.getMediaById(mediaId).then(media => {
                                    if (media) onSelect(media);
                                });
                            }
                            loadMedia(); // Refresh library
                        }}
                    />
                ) : view === 'bulk' ? (
                    <BulkUploader />
                ) : view === 'ai' ? (
                    <AIImageGenerator />
                ) : loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                            <p className="text-slate-500 dark:text-slate-400">Loading media...</p>
                        </div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-slate-600 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <p className="text-slate-500 text-lg font-medium mb-2">
                                {searchQuery ? 'No images found' : 'No images yet'}
                            </p>
                            <p className="text-slate-600 text-sm mb-4">
                                {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setView('upload')}
                                    className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
                                >
                                    Upload Image
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {media.map((file) => (
                                <div
                                    key={file.id}
                                    className={`
                                        group relative border rounded-lg overflow-hidden
                                        hover:shadow-lg transition-all cursor-pointer
                                        ${selectedId === file.id ? 'ring-2 ring-primary' : ''}
                                        ${mode === 'select' ? 'hover:ring-2 hover:ring-primary' : ''}
                                    `}
                                    onClick={() => mode === 'select' && onSelect?.(file)}
                                >
                                    {/* Image */}
                                    <div className="aspect-square bg-slate-100 relative">
                                        <img
                                            src={file.publicUrl}
                                            alt={file.altText || file.filename}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        
                                        {/* Overlay on hover */}
                                        {mode === 'browse' && (
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(file.publicUrl, '_blank');
                                                    }}
                                                    className="px-3 py-1 bg-white text-slate-900 rounded text-sm font-medium hover:bg-slate-100"
                                                    title="View full size"
                                                >
                                                    👁️ View
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(file.id);
                                                    }}
                                                    className="px-3 py-1 bg-danger-600 text-white rounded text-sm font-medium hover:bg-danger-700"
                                                    title="Delete"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        )}

                                        {/* Selected indicator */}
                                        {selectedId === file.id && (
                                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-2 bg-white">
                                        <p className="text-xs truncate font-medium text-slate-900" title={file.originalFilename}>
                                            {file.originalFilename}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-slate-500">
                                                {(file.fileSize / 1024).toFixed(0)} KB
                                            </p>
                                            {file.width && file.height && (
                                                <p className="text-xs text-slate-500">
                                                    {file.width}×{file.height}
                                                </p>
                                            )}
                                        </div>
                                        {file.usageCount > 0 && (
                                            <p className="text-xs text-success-600 mt-1">
                                                ✓ Used in {file.usageCount} article{file.usageCount > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        page === 1
                                            ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                    ← Previous
                                </button>
                                <span className="text-sm text-slate-600 font-medium px-4">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        page === totalPages
                                            ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
