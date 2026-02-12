import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface MediaItem {
    id: string; // The path/name in storage
    url: string;
    name: string;
    size: number;
    type: string;
    created_at: string;
}

export class MediaService {
    private supabase = createClient();
    private bucket = 'media';
    
    /**
     * Upload a file to the media bucket
     */
    async uploadFile(file: File, folder: string = 'uploads'): Promise<MediaItem | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExt}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('filePath', fileName);
        formData.append('mimeType', file.type);

        const apiResponse = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData,
        });

        if (!apiResponse.ok) {
            const apiError = await apiResponse.json();
            throw new Error(`Upload failed: ${apiError.error || apiResponse.statusText}`);
        }

        const { publicUrl } = await apiResponse.json();

        return {
            id: fileName,
            url: publicUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            created_at: new Date().toISOString()
        };
    }

    /**
     * List files in the media bucket
     */
    async listFiles(folder: string = 'uploads', limit = 100, offset = 0): Promise<MediaItem[]> {
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .list(folder, {
                limit,
                offset,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('List error:', error);
            throw error;
        }

        return data.map(file => {
            const path = `${folder}/${file.name}`;
            const { data: { publicUrl } } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
            
            return {
                id: path,
                url: publicUrl,
                name: file.name,
                size: file.metadata?.size || 0,
                type: file.metadata?.mimetype || 'application/octet-stream',
                created_at: file.created_at
            };
        });
    }

    /**
     * Delete a file
     */
    async deleteFile(path: string): Promise<boolean> {
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove([path]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }
        return true;
    }
}

export const mediaService = new MediaService();
