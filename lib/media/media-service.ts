/**
 * Media Service - Complete Image Management
 * Handles upload, storage, retrieval, and organization of media files
 */

import { createClient } from '@/lib/supabase/client';
import { ImageOptimizer } from './image-optimizer';

export interface MediaFile {
    id: string;
    filename: string;
    originalFilename: string;
    filePath: string;
    publicUrl: string;
    mimeType: string;
    fileSize: number;
    width?: number;
    height?: number;
    altText?: string;
    caption?: string;
    title?: string;
    description?: string;
    folder?: string;
    tags?: string[];
    usedInArticles?: string[];
    usageCount: number;
    uploadedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadProgress {
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
    message?: string;
}

export class MediaService {
    private supabase = createClient();
    private bucketName = 'media';

    /**
     * Upload image file to Supabase Storage
     */
    async uploadImage(
        file: File,
        options?: {
            folder?: string;
            altText?: string;
            title?: string;
            onProgress?: (progress: UploadProgress) => void;
        }
    ): Promise<MediaFile> {
        try {
            // Validate file
            const validation = ImageOptimizer.validateImage(file);
            if (!validation.valid) {
                throw new Error(validation.error || 'Invalid image file');
            }

            // Report progress: Starting
            options?.onProgress?.({
                progress: 0,
                status: 'uploading',
                message: 'Preparing upload...'
            });

            // OPTIMIZE IMAGE (NEW!)
            options?.onProgress?.({
                progress: 10,
                status: 'processing',
                message: 'Optimizing image...'
            });

            const optimized = await ImageOptimizer.optimizeImage(file);
            const optimizedBlob = optimized.original.blob;

            // Convert blob to File with WebP extension
            const optimizedFile = new File(
                [optimizedBlob],
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp' }
            );

            options?.onProgress?.({
                progress: 25,
                status: 'uploading',
                message: `Optimized ${optimized.metadata.savingsPercent}% • Uploading...`
            });

            // Generate unique filename
            const timestamp = Date.now();
            const sanitizedName = optimizedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${timestamp}-${sanitizedName}`;
            const folder = options?.folder || 'uploads';
            const filePath = `${folder}/${filename}`;

            // Upload to Supabase Storage
            options?.onProgress?.({
                progress: 50,
                status: 'uploading',
                message: 'Uploading to storage...'
            });

            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from(this.bucketName)
                .upload(filePath, optimizedFile, {
                    cacheControl: '31536000', // 1 year
                    upsert: false
                });

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // Get public URL
            const { data: { publicUrl } } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(filePath);

            // Save metadata to database
            options?.onProgress?.({
                progress: 75,
                status: 'processing',
                message: 'Saving metadata...'
            });

            const { data: mediaData, error: dbError } = await this.supabase
                .from('media')
                .insert({
                    filename,
                    original_filename: file.name,
                    file_path: filePath,
                    public_url: publicUrl,
                    mime_type: 'image/webp', // Always WebP now
                    file_size: optimizedBlob.size, // Optimized size
                    width: optimized.original.width,
                    height: optimized.original.height,
                    alt_text: options?.altText || file.name.replace(/\.[^/.]+$/, ''),
                    title: options?.title,
                    folder: folder,
                    usage_count: 0
                })
                .select()
                .single();

            if (dbError) {
                // Rollback: delete from storage
                await this.supabase.storage.from(this.bucketName).remove([filePath]);
                throw new Error(`Database save failed: ${dbError.message}`);
            }

            // Complete
            options?.onProgress?.({
                progress: 100,
                status: 'complete',
                message: `Upload complete! Saved ${ImageOptimizer.formatFileSize(optimized.metadata.savings)}`
            });

            return this.mapToMediaFile(mediaData);
        } catch (error: any) {
            options?.onProgress?.({
                progress: 0,
                status: 'error',
                message: error.message
            });
            throw error;
        }
    }

    /**
     * Validate image file
     */
    private validateImageFile(file: File): void {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image (JPEG, PNG, GIF, WebP)');
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('File size must be less than 10MB');
        }

        // Check specific image types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Unsupported image format. Use JPEG, PNG, GIF, WebP, or SVG.');
        }
    }

    /**
     * Get image dimensions from file
     */
    private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve) => {
            const img = new Image();
            
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve({ width: img.width, height: img.height });
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve({ width: 0, height: 0 });
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * List all media files with pagination
     */
    async listMedia(params?: {
        limit?: number;
        offset?: number;
        folder?: string;
        sortBy?: 'created_at' | 'filename' | 'file_size';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ data: MediaFile[]; total: number }> {
        const limit = params?.limit || 50;
        const offset = params?.offset || 0;
        const sortBy = params?.sortBy || 'created_at';
        const sortOrder = params?.sortOrder || 'desc';

        let query = this.supabase
            .from('media')
            .select('*', { count: 'exact' });

        // Filter by folder
        if (params?.folder) {
            query = query.eq('folder', params.folder);
        }

        // Sort
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            data: data ? data.map(this.mapToMediaFile) : [],
            total: count || 0
        };
    }

    /**
     * Search media by filename, alt text, or tags
     */
    async searchMedia(query: string, limit = 50): Promise<MediaFile[]> {
        const { data, error } = await this.supabase
            .from('media')
            .select('*')
            .or(`filename.ilike.%${query}%,original_filename.ilike.%${query}%,alt_text.ilike.%${query}%,title.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data ? data.map(this.mapToMediaFile) : [];
    }

    /**
     * Get media file by ID
     */
    async getMediaById(id: string): Promise<MediaFile | null> {
        const { data, error } = await this.supabase
            .from('media')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data ? this.mapToMediaFile(data) : null;
    }

    /**
     * Update media metadata
     */
    async updateMedia(
        id: string,
        updates: {
            altText?: string;
            caption?: string;
            title?: string;
            description?: string;
            folder?: string;
            tags?: string[];
        }
    ): Promise<void> {
        const updateData: any = {};
        
        if (updates.altText !== undefined) updateData.alt_text = updates.altText;
        if (updates.caption !== undefined) updateData.caption = updates.caption;
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.folder !== undefined) updateData.folder = updates.folder;
        if (updates.tags !== undefined) updateData.tags = updates.tags;

        updateData.updated_at = new Date().toISOString();

        const { error } = await this.supabase
            .from('media')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;
    }

    /**
     * Delete media file
     */
    async deleteMedia(id: string): Promise<void> {
        // Get file path first
        const { data: media } = await this.supabase
            .from('media')
            .select('file_path, usage_count')
            .eq('id', id)
            .single();

        if (!media) {
            throw new Error('Media file not found');
        }

        // Check if media is in use
        if (media.usage_count > 0) {
            throw new Error('Cannot delete media that is currently in use in articles');
        }

        // Delete from storage
        const { error: storageError } = await this.supabase.storage
            .from(this.bucketName)
            .remove([media.file_path]);

        if (storageError) {
            console.error('Storage deletion failed:', storageError);
            // Continue anyway - database cleanup is more important
        }

        // Delete from database
        const { error: dbError } = await this.supabase
            .from('media')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;
    }

    /**
     * Track media usage in article
     */
    async trackUsage(mediaId: string, articleId: string, action: 'add' | 'remove'): Promise<void> {
        const { error } = await this.supabase.rpc('update_media_usage', {
            p_media_id: mediaId,
            p_article_id: articleId,
            p_action: action
        });

        if (error) {
            console.error('Failed to track media usage:', error);
        }
    }

    /**
     * Get media folders
     */
    async getFolders(): Promise<Array<{ name: string; slug: string; count: number }>> {
        const { data, error } = await this.supabase
            .from('media')
            .select('folder')
            .order('folder');

        if (error) throw error;

        // Count media per folder
        const folderCounts = new Map<string, number>();
        data?.forEach((item: { folder?: string }) => {
            const folder = item.folder || 'uncategorized';
            folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        });

        return Array.from(folderCounts.entries()).map(([folder, count]) => ({
            name: folder.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: folder,
            count
        }));
    }

    /**
     * Map database row to MediaFile interface
     */
    private mapToMediaFile(data: any): MediaFile {
        return {
            id: data.id,
            filename: data.filename,
            originalFilename: data.original_filename,
            filePath: data.file_path,
            publicUrl: data.public_url,
            mimeType: data.mime_type,
            fileSize: data.file_size,
            width: data.width,
            height: data.height,
            altText: data.alt_text,
            caption: data.caption,
            title: data.title,
            description: data.description,
            folder: data.folder,
            tags: data.tags,
            usedInArticles: data.used_in_articles,
            usageCount: data.usage_count || 0,
            uploadedBy: data.uploaded_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }
}

// Singleton export
export const mediaService = new MediaService();
