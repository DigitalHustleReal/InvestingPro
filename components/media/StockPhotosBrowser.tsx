"use client";

import { useState, useEffect } from 'react';
import { StockPhotoService, StockPhoto } from '@/lib/media/stock-photo-service';
import { mediaService } from '@/lib/media/media-service';

interface StockPhotosBrowserProps {
    onSelect?: (url: string, mediaId: string) => void;
}

export function StockPhotosBrowser({ onSelect }: StockPhotosBrowserProps) {
    const [photos, setPhotos] = useState<StockPhoto[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        loadCuratedPhotos();
    }, []);

    const loadCuratedPhotos = async () => {
        setLoading(true);
        try {
            const results = await StockPhotoService.getCuratedPhotos();
            setPhotos(results);
        } catch (error) {
            console.error('Failed to load curated photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadCuratedPhotos();
            return;
        }

        setLoading(true);
        try {
            const results = await StockPhotoService.searchPhotos(searchQuery);
            setPhotos(results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadAndUpload = async (photo: StockPhoto) => {
        try {
            setDownloading(photo.id);

            // Download from stock service
            const file = await StockPhotoService.downloadPhoto(photo);

            // Upload to our media library with optimization
            const media = await mediaService.uploadImage(file, {
                folder: 'stock-photos',
                title: `Photo by ${photo.photographer}`,
                altText: searchQuery || 'Stock photo'
            });

            // Notify parent if in select mode
            if (onSelect) {
                onSelect(media.publicUrl, media.id);
            }

            alert(`Image added to your media library!`);
        } catch (error: any) {
            alert(`Failed to download: ${error.message}`);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                    📸 Free Stock Photos
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                    Search millions of free images from Pexels and Pixabay
                </p>

                {/* Search */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search: credit card, money, finance..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : '🔍 Search'}
                    </button>
                </div>

                {/* Quick searches */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {['credit card', 'banking', 'money', 'investment', 'finance', 'business'].map(term => (
                        <button
                            key={term}
                            onClick={() => {
                                setSearchQuery(term);
                                StockPhotoService.searchPhotos(term).then(setPhotos);
                            }}
                            className="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary-600 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading stock photos...</p>
                        </div>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-slate-500 text-lg mb-2">No photos found</p>
                            <p className="text-slate-400 text-sm">Try a different search term</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                            >
                                {/* Image */}
                                <div className="aspect-square bg-slate-100 relative">
                                    <img
                                        src={photo.thumbnailUrl}
                                        alt={`Photo by ${photo.photographer}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleDownloadAndUpload(photo)}
                                            disabled={downloading === photo.id}
                                            className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium disabled:opacity-50"
                                        >
                                            {downloading === photo.id ? (
                                                <>⏳ Downloading...</>
                                            ) : (
                                                <>⬇️ Use This</>
                                            )}
                                        </button>
                                    </div>

                                    {/* Source badge */}
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {photo.source === 'pexels' ? '📷 Pexels' : '🖼️ Pixabay'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-2 bg-white">
                                    <a
                                        href={photo.photographerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-slate-600 hover:text-secondary-600 truncate block"
                                        title={`Photo by ${photo.photographer}`}
                                    >
                                        📸 {photo.photographer}
                                    </a>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {photo.width} × {photo.height}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t p-3 bg-slate-50">
                <p className="text-xs text-slate-600 text-center">
                    Images from <strong>Pexels</strong> and <strong>Pixabay</strong>. Free to use with attribution.
                </p>
            </div>
        </div>
    );
}
