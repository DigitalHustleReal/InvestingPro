/**
 * Image Upload API with Auto-Optimization
 * 
 * POST /api/admin/images/upload
 * Uploads and auto-optimizes images (compression, WebP conversion)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/auth/require-admin-api';
import { optimizeImageSharp } from '@/lib/images/optimizer';
import { uploadFromUrl } from '@/lib/images/cloudinary-service';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30; // Allow up to 30 seconds for optimization

/**
 * POST /api/admin/images/upload
 * Upload image with auto-optimization
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Admin role verification
        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (adminRole?.role !== 'admin') {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role !== 'admin') {
                return NextResponse.json(
                    { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                    { status: 403 }
                );
            }
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const originalSize = buffer.length;

        // Optimize image using Sharp
        const optimized = await optimizeImageSharp(buffer, {
            format: 'webp',
            quality: 85,
            maxWidth: 2000,
            maxHeight: 2000
        });

        const optimizedSize = optimized.size;
        const savingsPercent = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

        // Upload to Cloudinary (if configured) or Supabase Storage
        let publicUrl: string;
        let uploadPath: string;

        try {
            // Try Cloudinary first (better optimization and CDN)
            // Use data URL format for base64 upload with transformations
            const base64Data = buffer.toString('base64');
            const mimeType = file.type.split('/')[1] || 'jpeg';
            const dataUrl = `data:image/${mimeType};base64,${base64Data}`;
            
            const cloudinaryResult = await uploadFromUrl(dataUrl, {
                folder: 'investingpro/uploads',
                transformation: {
                    width: 2000,
                    height: 2000,
                    crop: 'fit',
                    quality: 'auto:good',
                    format: 'webp'
                }
            });

            if (cloudinaryResult.success && cloudinaryResult.url) {
                publicUrl = cloudinaryResult.url;
                uploadPath = cloudinaryResult.publicId || '';
            } else {
                throw new Error('Cloudinary upload failed');
            }
        } catch (cloudinaryError) {
            // Fallback to Supabase Storage
            logger.warn('Cloudinary upload failed, using Supabase Storage', cloudinaryError as Error);

            const fileExt = 'webp';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // Convert optimized buffer to Blob for upload
            const optimizedBlob = new Blob([new Uint8Array(optimized.buffer)], { type: 'image/webp' });
            const optimizedFile = new File([optimizedBlob], fileName, { type: 'image/webp' });

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, optimizedFile, {
                    cacheControl: '31536000', // 1 year
                    upsert: false,
                    contentType: 'image/webp'
                });

            if (uploadError) {
                throw new Error(`Supabase upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl: supabaseUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            publicUrl = supabaseUrl;
            uploadPath = filePath;
        }

        // Save metadata to database
        try {
            await supabase.from('media').insert({
                filename: uploadPath.split('/').pop() || file.name,
                original_filename: file.name,
                file_path: uploadPath,
                public_url: publicUrl,
                mime_type: 'image/webp',
                file_size: optimizedSize,
                width: optimized.width,
                height: optimized.height,
                folder: 'uploads',
                uploaded_by: user.id
            });
        } catch (dbError) {
            logger.warn('Failed to save media metadata to database', dbError as Error);
            // Don't fail the upload if DB save fails
        }

        logger.info('Image uploaded and optimized', {
            originalSize,
            optimizedSize,
            savingsPercent,
            publicUrl
        });

        return NextResponse.json({
            success: true,
            file_url: publicUrl,
            file_path: uploadPath,
            file_name: uploadPath.split('/').pop() || file.name,
            optimized: true,
            original_size: originalSize,
            optimized_size: optimizedSize,
            savings_percent: savingsPercent,
            format: optimized.format,
            width: optimized.width,
            height: optimized.height
        });
    } catch (error) {
        logger.error('Error uploading image', error as Error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
