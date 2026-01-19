"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Check, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STORAGE_BUCKET = 'media';

interface MediaLibraryPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string) => void;
    currentUrl?: string;
}

/**
 * MediaLibraryPicker - Modal for selecting images from media library
 * 
 * Enhanced Features:
 * - Drag and drop upload
 * - Browse uploaded images
 * - Search images
 * - Upload new images
 * - Select image for use
 */
export default function MediaLibraryPicker({
    open,
    onOpenChange,
    onSelect,
    currentUrl,
}: MediaLibraryPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // Fetch media items
    const { data: mediaItemsData, isLoading, refetch } = useQuery({
        queryKey: ['media-items-picker'],
        queryFn: async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .list('', {
                        limit: 100,
                        offset: 0,
                        sortBy: { column: 'created_at', order: 'desc' }
                    });

                if (error) {
                    console.log('Storage bucket might not exist:', error.message);
                    return [];
                }

                if (!data || !Array.isArray(data)) {
                    return [];
                }

                const items = await Promise.all(
                    data.map(async (file) => {
                        const { data: urlData } = supabase.storage
                            .from(STORAGE_BUCKET)
                            .getPublicUrl(file.name);

                        return {
                            id: file.id || file.name,
                            name: file.name,
                            url: urlData.publicUrl,
                        };
                    })
                );

                return items;
            } catch (error) {
                console.error('Error fetching media:', error);
                return [];
            }
        },
        enabled: open,
        initialData: [],
    });

    const mediaItems = Array.isArray(mediaItemsData) ? mediaItemsData : [];
    const filteredMedia = mediaItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Drag and drop handler
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }

            setUploading(true);
            try {
                const supabase = createClient();
                
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                    throw new Error('Supabase Storage is not configured.');
                }

                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

                const { data, error } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) {
                    if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
                        throw new Error(`Storage bucket "${STORAGE_BUCKET}" does not exist. Please create it in your Supabase dashboard.`);
                    } else if (error.message?.includes('new row violates row-level security')) {
                        throw new Error('Permission denied. Please check your Supabase Storage bucket policies.');
                    } else {
                        throw error;
                    }
                }

                if (!data) {
                    throw new Error('Upload failed: No data returned');
                }

                // Refresh media list
                await refetch();
                
                // Auto-select the newly uploaded image
                const { data: urlData } = supabase.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(fileName);
                
                if (urlData?.publicUrl) {
                    onSelect(urlData.publicUrl);
                    onOpenChange(false);
                }
            } catch (error: any) {
                console.error('Upload error:', error);
                const errorMessage = error.message || 'Unknown error occurred';
                toast.error(`Upload failed: ${errorMessage}. Please check: 1. Supabase Storage bucket "${STORAGE_BUCKET}" exists 2. Storage policies allow uploads 3. Environment variables are set correctly`);
            } finally {
                setUploading(false);
            }
        }
    }, [refetch, onSelect, onOpenChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false,
        noClick: true,
    });

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const supabase = createClient();
            
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                throw new Error('Supabase Storage is not configured.');
            }

            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            const { data, error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
                    throw new Error(`Storage bucket "${STORAGE_BUCKET}" does not exist. Please create it in your Supabase dashboard.`);
                } else if (error.message?.includes('new row violates row-level security')) {
                    throw new Error('Permission denied. Please check your Supabase Storage bucket policies.');
                } else {
                    throw error;
                }
            }

            if (!data) {
                throw new Error('Upload failed: No data returned');
            }

            // Refresh media list
            await refetch();
            
            // Auto-select the newly uploaded image
            const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(fileName);
            
            if (urlData?.publicUrl) {
                onSelect(urlData.publicUrl);
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            const errorMessage = error.message || 'Unknown error occurred';
            alert(`Upload failed: ${errorMessage}\n\nPlease check:\n1. Supabase Storage bucket "${STORAGE_BUCKET}" exists\n2. Storage policies allow uploads\n3. Environment variables are set correctly`);
        } finally {
            setUploading(false);
        }
    };

    const handleSelect = (url: string) => {
        onSelect(url);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                {...getRootProps()}
                className={cn(
                    "max-w-4xl max-h-[80vh] flex flex-col",
                    isDragActive && "bg-primary-50 border-primary-500"
                )}
            >
                <input {...getInputProps()} />
                <DialogHeader>
                    <DialogTitle>Select Featured Image</DialogTitle>
                    <DialogDescription>
                        {isDragActive 
                            ? "Drop your image here to upload" 
                            : "Choose an image from your media library, drag and drop to upload, or click Upload."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col flex-1 min-h-0">
                    {/* Search and Upload */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search images..."
                                className="pl-10"
                            />
                        </div>
                        <input
                            ref={fileInputRef}
                            id="upload-in-picker"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                        />
                        <Button 
                            variant="outline" 
                            disabled={uploading} 
                            className="cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Media Grid */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading || uploading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground dark:text-muted-foreground" />
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <Card className="p-6 md:p-8 text-center">
                                <ImageIcon className="w-12 h-12 text-muted-foreground dark:text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {searchQuery ? 'No images found' : 'No images yet'}
                                </h3>
                                <p className="text-sm text-muted-foreground/50 dark:text-muted-foreground/50 mb-4">
                                    {searchQuery
                                        ? 'Try adjusting your search'
                                        : 'Drag and drop an image here or click Upload to get started'}
                                </p>
                                {!searchQuery && (
                                    <Button 
                                        variant="outline" 
                                        className="cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                    </Button>
                                )}
                            </Card>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {filteredMedia.map((item) => {
                                    const isSelected = currentUrl === item.url;
                                    return (
                                        <Card
                                            key={item.id}
                                            className={cn(
                                                "relative cursor-pointer group hover:shadow-lg transition-all",
                                                isSelected && "ring-2 ring-primary-600"
                                            )}
                                            onClick={() => handleSelect(item.url)}
                                        >
                                            <div className="aspect-square bg-slate-100 relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={item.url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-foreground dark:text-foreground" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                            <div className="p-2">
                                                <p className="text-xs font-medium text-slate-900 truncate" title={item.name}>
                                                    {item.name}
                                                </p>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
