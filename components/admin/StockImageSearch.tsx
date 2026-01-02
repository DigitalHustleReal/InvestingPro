"use client";

import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import { searchPexelsImages, pexelsPhotoToMediaItem } from '@/lib/integrations/stockImages/pexels';
import { searchUnsplashImages, unsplashPhotoToMediaItem } from '@/lib/integrations/stockImages/unsplash';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface StockImageSearchProps {
    onSelect: (url: string, metadata?: any) => void;
    onClose?: () => void;
}

/**
 * StockImageSearch - Search and select images from Pexels, Unsplash, etc.
 * 
 * Features:
 * - Search multiple stock image APIs
 * - Preview images
 * - Download and add to media library
 * - Proper attribution
 */
export default function StockImageSearch({ onSelect, onClose }: StockImageSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSource, setActiveSource] = useState<'pexels' | 'unsplash'>('pexels');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Search Pexels
    const { data: pexelsData, isLoading: pexelsLoading } = useQuery({
        queryKey: ['pexels-search', searchQuery],
        queryFn: () => searchPexelsImages(searchQuery || 'finance', { perPage: 20 }),
        enabled: activeSource === 'pexels' && !!searchQuery,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Search Unsplash
    const { data: unsplashData, isLoading: unsplashLoading } = useQuery({
        queryKey: ['unsplash-search', searchQuery],
        queryFn: () => searchUnsplashImages(searchQuery || 'finance', { perPage: 20 }),
        enabled: activeSource === 'unsplash' && !!searchQuery,
        staleTime: 5 * 60 * 1000,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger query refetch by changing query key
    };

    const handleSelectImage = async (image: any) => {
        setSelectedImage(image);
        
        // Download image and upload to Supabase Storage
        try {
            // Show loading state
            const loadingToast = document.createElement('div');
            loadingToast.className = 'fixed top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            loadingToast.textContent = 'Downloading image...';
            document.body.appendChild(loadingToast);

            const response = await fetch(image.url);
            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();
            const file = new File([blob], `${image.id}.jpg`, { type: 'image/jpeg' });

            // Upload to Supabase
            const supabase = createClient();
            const fileName = `stock-${Date.now()}-${image.id}.jpg`;
            
            const { data, error } = await supabase.storage
                .from('media')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                document.body.removeChild(loadingToast);
                throw error;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('media')
                .getPublicUrl(fileName);

            // Update loading message
            loadingToast.textContent = 'Image added successfully!';
            loadingToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            
            setTimeout(() => {
                if (document.body.contains(loadingToast)) {
                    document.body.removeChild(loadingToast);
                }
            }, 2000);

            // Call onSelect with the Supabase URL and metadata
            onSelect(urlData.publicUrl, {
                source: image.source,
                photographer: image.photographer,
                photographer_url: image.photographer_url,
                alt_text: image.alt_text,
            });
        } catch (error: any) {
            console.error('Error downloading image:', error);
            alert(`Failed to download image: ${error.message || 'Unknown error'}. Please check your Supabase Storage configuration.`);
        }
    };

    const pexelsImages = pexelsData?.photos?.map(pexelsPhotoToMediaItem) || [];
    const unsplashImages = unsplashData?.results?.map(unsplashPhotoToMediaItem) || [];

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for images (e.g., finance, investment, retirement)..."
                        className="pl-10"
                    />
                </div>
                <Button type="submit" disabled={!searchQuery}>
                    Search
                </Button>
            </form>

            {/* Source Tabs */}
            <Tabs value={activeSource} onValueChange={(v) => setActiveSource(v as 'pexels' | 'unsplash')}>
                <TabsList>
                    <TabsTrigger value="pexels">Pexels (Free)</TabsTrigger>
                    <TabsTrigger value="unsplash">Unsplash (Free)</TabsTrigger>
                </TabsList>

                {/* Pexels Results */}
                <TabsContent value="pexels" className="mt-4">
                    {pexelsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : pexelsImages.length === 0 ? (
                        <Card className="p-6 md:p-8 text-center">
                            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No images found. Try a different search term.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {pexelsImages.map((image) => (
                                <Card
                                    key={image.id}
                                    className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                                    onClick={() => handleSelectImage(image)}
                                >
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={image.thumbnail}
                                            alt={image.alt_text}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-medium text-slate-900 truncate" title={image.name}>
                                            {image.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            by {image.photographer}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Unsplash Results */}
                <TabsContent value="unsplash" className="mt-4">
                    {unsplashLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : unsplashImages.length === 0 ? (
                        <Card className="p-6 md:p-8 text-center">
                            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-600">No images found. Try a different search term.</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {unsplashImages.map((image) => (
                                <Card
                                    key={image.id}
                                    className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                                    onClick={() => handleSelectImage(image)}
                                >
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={image.thumbnail}
                                            alt={image.alt_text}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-medium text-slate-900 truncate" title={image.name}>
                                            {image.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            by {image.photographer}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Attribution Info */}
            <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-lg">
                <p className="font-semibold mb-1">Image Licensing:</p>
                <p>Pexels and Unsplash images are free to use. Attribution is automatically added to image metadata.</p>
            </div>
        </div>
    );
}

