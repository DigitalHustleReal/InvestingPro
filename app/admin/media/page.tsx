"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageEditor from '@/components/admin/ImageEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    Upload, 
    Search, 
    Image as ImageIcon, 
    X, 
    Loader2,
    Trash2,
    Eye,
    FileImage,
    AlertCircle,
    Copy,
    Edit,
    Maximize2,
    ImagePlus,
    FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockImageSearch from '@/components/admin/StockImageSearch';
import ContextualSidebar from '@/components/admin/ContextualSidebar';
import { toast } from 'sonner';

interface MediaItem {
    id: string;
    name: string;
    url: string;
    alt_text?: string;
    caption?: string;
    title?: string;
    description?: string;
    keywords?: string[];
    source?: string;
    size?: number;
    mime_type?: string;
    created_at?: string;
    width?: number;
    height?: number;
}

const STORAGE_BUCKET = 'media';

/**
 * Enhanced Media Library with Professional Features
 * 
 * Features:
 * - Drag and drop upload
 * - Image cropping and resizing
 * - Enhanced SEO metadata (title, description, keywords, alt text)
 * - Delete with confirmation
 * - Search and filter
 * - Grid/list view toggle
 */
export default function MediaLibraryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<File | null>(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        alt_text: '',
        caption: '',
        description: '',
        keywords: '',
        source: '',
    });
    const [isDragActive, setIsDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('my-media');
    const [contextualSidebarCollapsed, setContextualSidebarCollapsed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    // Fetch media items from Supabase Storage
    const { data: mediaItemsData, isLoading } = useQuery({
        queryKey: ['media-items'],
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

                const items: MediaItem[] = await Promise.all(
                    data.map(async (file) => {
                        const { data: urlData } = supabase.storage
                            .from(STORAGE_BUCKET)
                            .getPublicUrl(file.name);

                        return {
                            id: file.id || file.name,
                            name: file.name,
                            url: urlData.publicUrl,
                            size: file.metadata?.size,
                            mime_type: file.metadata?.mimetype,
                            created_at: file.created_at,
                        };
                    })
                );

                return items;
            } catch (error) {
                console.error('Error fetching media:', error);
                return [];
            }
        },
        initialData: [],
    });

    const mediaItems = Array.isArray(mediaItemsData) ? mediaItemsData : [];
    const filteredMedia = mediaItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Drag and drop handler
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type.startsWith('image/')) {
                setImageToEdit(file);
                setIsEditorOpen(true);
            } else {
                toast.error('Please upload an image file');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false,
        noClick: true, // Prevent click to open file dialog
    });

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async ({ file, metadata }: { file: File; metadata?: any }) => {
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

            // TODO: Save metadata to a separate table if needed
            // For now, metadata is stored in the file name and can be edited later

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media-items'] });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        onError: (error: any) => {
            console.error('Upload error:', error);
            toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (fileName: string) => {
            const supabase = createClient();
            const { error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([fileName]);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['media-items'] });
            setIsDeleteDialogOpen(false);
            setSelectedImage(null);
        },
        onError: (error: any) => {
            console.error('Delete error:', error);
            toast.error(`Delete failed: ${error.message || 'Unknown error'}`);
        },
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setImageToEdit(file);
        setIsEditorOpen(true);
    };

    const handleImageEditorSave = (file: File, metadata?: { width?: number; height?: number }) => {
        uploadMutation.mutate({ file, metadata });
        setIsEditorOpen(false);
        setImageToEdit(null);
    };

    const handleEdit = (item: MediaItem) => {
        setSelectedImage(item);
        setEditFormData({
            title: item.title || '',
            alt_text: item.alt_text || '',
            caption: item.caption || '',
            description: item.description || '',
            keywords: item.keywords?.join(', ') || '',
            source: item.source || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (item: MediaItem) => {
        setSelectedImage(item);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedImage) return;
        deleteMutation.mutate(selectedImage.name);
    };

    const handleSaveMetadata = () => {
        // TODO: Save metadata to database table
        // For now, just show a message
        toast.info('Metadata saving will be implemented when media metadata table is set up. Metadata includes: title, alt text, caption, description, keywords, and source.');
        setIsEditDialogOpen(false);
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('Image URL copied to clipboard!');
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Contextual sidebar items for Media Library
    const contextualSidebarItems = [
        { id: 'my-media', label: `My Media (${mediaItems.length})`, icon: ImageIcon },
        { id: 'stock-images', label: 'Stock Images', icon: ImagePlus },
    ];

    return (
        <AdminLayout
            contextualSidebar={
                <ContextualSidebar
                    items={contextualSidebarItems}
                    activeItem={activeTab}
                    onItemChange={setActiveTab}
                    title="Media"
                    collapsed={contextualSidebarCollapsed}
                    onToggle={() => setContextualSidebarCollapsed(!contextualSidebarCollapsed)}
                />
            }
        >
            <div 
                {...getRootProps()} 
                className={cn(
                    "flex flex-col bg-slate-50 min-h-screen",
                    dropzoneActive && "bg-teal-50"
                )}
            >
                <input {...getInputProps()} />
                
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                {dropzoneActive 
                                    ? "Drop your image here to upload" 
                                    : "Drag and drop images here, or click to upload"}
                            </p>
                        </div>
                        <div>
                            <input
                                ref={fileInputRef}
                                id="upload-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-teal-600 hover:bg-teal-700" 
                                disabled={uploadMutation.isPending}
                            >
                                {uploadMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search media by name, title, alt text, or caption..."
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Media Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">

                        {/* My Media Tab */}
                        <TabsContent value="my-media" className="mt-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <Card className="p-12 text-center max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        {searchQuery ? 'No media found' : 'No media yet'}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-6">
                                        {searchQuery
                                            ? 'Try adjusting your search terms'
                                            : 'Drag and drop images here or click Upload Image to get started.'}
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
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {filteredMedia.map((item) => (
                                            <Card
                                                key={item.id}
                                                className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                                            >
                                                <div 
                                                    className="aspect-square bg-slate-100 relative overflow-hidden"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt={item.alt_text || item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            if (target.parentElement) {
                                                                target.parentElement.innerHTML = `
                                                                    <div class="w-full h-full flex items-center justify-center">
                                                                        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <Eye className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-white/90 hover:bg-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(item);
                                                            }}
                                                            title="Edit metadata"
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-700" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 bg-white/90 hover:bg-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(item);
                                                            }}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-xs font-medium text-slate-900 truncate" title={item.title || item.name}>
                                                        {item.title || item.name}
                                                    </p>
                                                    {item.alt_text && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2" title={item.alt_text}>
                                                            {item.alt_text}
                                                        </p>
                                                    )}
                                                    {item.size && (
                                                        <p className="text-xs text-slate-400 mt-1">
                                                            {formatFileSize(item.size)}
                                                        </p>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    {/* Stats */}
                                    {mediaItems.length > 0 && (
                                        <div className="mt-6">
                                            <p className="text-sm text-slate-600">
                                                {mediaItems.length} image{mediaItems.length !== 1 ? 's' : ''} total
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabsContent>

                        {/* Stock Images Tab */}
                        <TabsContent value="stock-images" className="mt-4">
                            <StockImageSearch
                                onSelect={(url, metadata) => {
                                    // Refresh media library after adding stock image
                                    queryClient.invalidateQueries({ queryKey: ['media-items'] });
                                    // Optionally show success message
                                    console.log('Stock image added:', url, metadata);
                                }}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Image Editor Dialog */}
                <ImageEditor
                    open={isEditorOpen}
                    onOpenChange={setIsEditorOpen}
                    imageFile={imageToEdit}
                    onSave={handleImageEditorSave}
                />

                {/* Edit Metadata Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Image Metadata & SEO</DialogTitle>
                            <DialogDescription>
                                Update image information for better SEO and accessibility.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedImage && (
                            <div className="space-y-6 py-4">
                                {/* Image Preview */}
                                <div>
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.alt_text || selectedImage.name}
                                        className="w-full max-h-64 object-contain rounded-lg bg-slate-100"
                                    />
                                </div>

                                {/* Image Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-slate-700">File Name:</span>
                                        <p className="text-slate-600 truncate" title={selectedImage.name}>
                                            {selectedImage.name}
                                        </p>
                                    </div>
                                    {selectedImage.size && (
                                        <div>
                                            <span className="font-medium text-slate-700">Size:</span>
                                            <p className="text-slate-600">{formatFileSize(selectedImage.size)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* SEO Metadata Fields */}
                                <div>
                                    <Label htmlFor="edit-title">Title *</Label>
                                    <Input
                                        id="edit-title"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        placeholder="Image title for SEO"
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {editFormData.title.length} / 60 characters
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="edit-alt-text">Alt Text *</Label>
                                    <Input
                                        id="edit-alt-text"
                                        value={editFormData.alt_text}
                                        onChange={(e) => setEditFormData({ ...editFormData, alt_text: e.target.value })}
                                        placeholder="Describe this image for accessibility and SEO"
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {editFormData.alt_text.length} / 125 characters (recommended)
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        placeholder="Detailed description for SEO"
                                        rows={3}
                                        className="mt-1 resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {editFormData.description.length} / 160 characters
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="edit-caption">Caption</Label>
                                    <Input
                                        id="edit-caption"
                                        value={editFormData.caption}
                                        onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                                        placeholder="Display caption (shown below image)"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="edit-keywords">Keywords</Label>
                                    <Input
                                        id="edit-keywords"
                                        value={editFormData.keywords}
                                        onChange={(e) => setEditFormData({ ...editFormData, keywords: e.target.value })}
                                        placeholder="Comma-separated keywords (e.g., finance, investment, stocks)"
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Separate keywords with commas
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="edit-source">Source URL</Label>
                                    <Input
                                        id="edit-source"
                                        value={editFormData.source}
                                        onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                                        placeholder="Original source of the image"
                                        className="mt-1"
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <Label>Image URL</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            value={selectedImage.url}
                                            readOnly
                                            className="font-mono text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleCopyUrl(selectedImage.url)}
                                            title="Copy URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveMetadata}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                <FileCheck className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                Delete Image
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedImage?.name}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                                variant="destructive"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Image'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
