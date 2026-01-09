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
}

export function MediaLibrary({ 
    onSelect,
    mode = 'browse',
    selectedId
}: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'upload' | 'stock' | 'bulk' | 'ai'>('grid');
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
            const result = await mediaService.listMedia({
                limit,
                offset: (page - 1) * limit,
                folder: selectedFolder === 'all' ? undefined : selectedFolder,
                sortBy: 'created_at',
                sortOrder: 'desc'
            });
            setMedia(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Failed to load media:', error);
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
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="border-b p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setView('grid')}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                view === 'grid'
                                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            📁 Browse ({total})
                        </button>
                        <button
                            onClick={() => setView('upload')}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                view === 'upload'
                                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            ⬆️ Upload
                        </button>
                        <button
                            onClick={() => setView('stock')}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                view === 'stock'
                                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            📸 Stock Photos
                        </button>
                        <button
                            onClick={() => setView('bulk')}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                view === 'bulk'
                                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            📤 Bulk Upload
                        </button>
                        <button
                            onClick={() => setView('ai')}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                                view === 'ai'
                                    ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            🎨 AI Generate
                        </button>
                    </div>
                </div>

                {view === 'grid' && (
                    <div className="space-y-3">
                        {/* Search */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium"
                            >
                                🔍 Search
                            </button>
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        loadMedia();
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Folder Filter */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedFolder('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedFolder === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All ({total})
                            </button>
                            {folders.map(folder => (
                                <button
                                    key={folder.slug}
                                    onClick={() => setSelectedFolder(folder.slug)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        selectedFolder === folder.slug
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {folder.name} ({folder.count})
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
                            <p className="text-gray-500">Loading media...</p>
                        </div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchQuery ? 'No images found' : 'No images yet'}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
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
                                    <div className="aspect-square bg-gray-100 relative">
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
                                                    className="px-3 py-1 bg-white text-gray-900 rounded text-sm font-medium hover:bg-gray-100"
                                                    title="View full size"
                                                >
                                                    👁️ View
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(file.id);
                                                    }}
                                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
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
                                        <p className="text-xs truncate font-medium text-gray-900" title={file.originalFilename}>
                                            {file.originalFilename}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-gray-500">
                                                {(file.fileSize / 1024).toFixed(0)} KB
                                            </p>
                                            {file.width && file.height && (
                                                <p className="text-xs text-gray-500">
                                                    {file.width}×{file.height}
                                                </p>
                                            )}
                                        </div>
                                        {file.usageCount > 0 && (
                                            <p className="text-xs text-green-600 mt-1">
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
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    ← Previous
                                </button>
                                <span className="text-sm text-gray-600 font-medium px-4">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        page === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
