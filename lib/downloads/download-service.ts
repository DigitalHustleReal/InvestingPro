/**
 * Download Service
 * Manages downloadable resources (dashboards, guides, eBooks, PDFs)
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export interface DownloadableResource {
    id: string;
    title: string;
    description: string;
    type: 'dashboard' | 'guide' | 'ebook' | 'pdf' | 'template';
    format: 'excel' | 'google-sheets' | 'notion' | 'pdf' | 'csv';
    category: string;
    fileUrl?: string;
    templateData?: any; // For dynamic generation
    downloadCount: number;
    requiresEmail: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface DownloadRequest {
    resourceId: string;
    email: string;
    name?: string;
    source?: string;
}

/**
 * Get all available downloads
 */
export async function getAvailableDownloads(category?: string): Promise<DownloadableResource[]> {
    try {
        let query = supabase
            .from('downloadable_resources')
            .select('*')
            .eq('status', 'active')
            .order('download_count', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data || []).map(resource => ({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            type: resource.type as DownloadableResource['type'],
            format: resource.format as DownloadableResource['format'],
            category: resource.category,
            fileUrl: resource.file_url,
            templateData: resource.template_data,
            downloadCount: resource.download_count || 0,
            requiresEmail: resource.requires_email || true,
            tags: resource.tags || [],
            createdAt: resource.created_at,
            updatedAt: resource.updated_at
        }));

    } catch (error) {
        logger.error('Error getting available downloads', error);
        throw error;
    }
}

/**
 * Get download by ID
 */
export async function getDownloadById(resourceId: string): Promise<DownloadableResource | null> {
    try {
        const { data, error } = await supabase
            .from('downloadable_resources')
            .select('*')
            .eq('id', resourceId)
            .eq('status', 'active')
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            type: data.type as DownloadableResource['type'],
            format: data.format as DownloadableResource['format'],
            category: data.category,
            fileUrl: data.file_url,
            templateData: data.template_data,
            downloadCount: data.download_count || 0,
            requiresEmail: data.requires_email || true,
            tags: data.tags || [],
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };

    } catch (error) {
        logger.error('Error getting download by ID', error);
        return null;
    }
}

/**
 * Track download
 */
export async function trackDownload(request: DownloadRequest): Promise<{
    success: boolean;
    downloadUrl: string;
    resource: DownloadableResource;
}> {
    try {
        // Get resource
        const resource = await getDownloadById(request.resourceId);
        if (!resource) {
            throw new Error('Resource not found');
        }

        // Save email if required
        if (resource.requiresEmail && request.email) {
            try {
                await supabase.from('newsletter_subscribers').insert({
                    email: request.email,
                    name: request.name,
                    source: `download_${request.resourceId}`,
                    tags: [resource.category, resource.type],
                    metadata: {
                        downloadedResource: resource.title,
                        resourceId: request.resourceId
                    }
                });
            } catch {
                // Ignore duplicate errors
            }
        }

        // Track download
        await supabase.from('download_logs').insert({
            resource_id: request.resourceId,
            email: request.email,
            source: request.source || 'website',
            downloaded_at: new Date().toISOString()
        });

        // Increment download count
        try {
            await supabase.rpc('increment_download_count', {
                resource_id: request.resourceId
            } as any);
        } catch {
            // Fallback: direct update
            await supabase
                .from('downloadable_resources')
                .update({ download_count: (resource.downloadCount || 0) + 1 })
                .eq('id', request.resourceId);
        }

        // Generate download URL (if template-based, generate on-the-fly)
        let downloadUrl = resource.fileUrl;
        
        if (!downloadUrl && resource.templateData) {
            // Generate file based on template
            downloadUrl = await generateDownloadFile(resource);
        }

        logger.info('Download tracked', {
            resourceId: request.resourceId,
            email: request.email,
            resourceTitle: resource.title
        });

        return {
            success: true,
            downloadUrl: downloadUrl || '#',
            resource
        };

    } catch (error) {
        logger.error('Error tracking download', error);
        throw error;
    }
}

/**
 * Generate download file from template
 */
async function generateDownloadFile(resource: DownloadableResource): Promise<string> {
    // This would generate files based on template
    // For now, return placeholder
    // In production, use libraries like:
    // - ExcelJS for Excel files
    // - jsPDF for PDFs
    // - csv-writer for CSV files
    
    return `/api/downloads/generate/${resource.id}`;
}
