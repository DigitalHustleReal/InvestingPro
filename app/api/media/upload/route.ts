import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

// Use service role for server-side operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const filePath = formData.get('filePath') as string;
        const mimeType = formData.get('mimeType') as string || 'image/webp';
        
        // Metadata fields
        const originalFilename = formData.get('originalFilename') as string;
        const width = parseInt(formData.get('width') as string) || null;
        const height = parseInt(formData.get('height') as string) || null;
        const altText = formData.get('altText') as string;
        const title = formData.get('title') as string;
        const folder = formData.get('folder') as string || 'uploads';
        const fileSize = parseInt(formData.get('fileSize') as string) || file.size;

        if (!file || !filePath) {
            return NextResponse.json(
                { error: 'File and filePath are required' },
                { status: 400 }
            );
        }

        logger.info(`Server-side upload: ${filePath} (${file.size} bytes)`);

        // 1. Upload to Supabase Storage using Admin Client
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('media')
            .upload(filePath, file, {
                contentType: mimeType,
                cacheControl: '31536000',
                upsert: true
            });

        if (uploadError) {
            logger.error('Storage upload error:', uploadError);
            return NextResponse.json(
                { error: `Storage error: ${uploadError.message}` },
                { status: 500 }
            );
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('media')
            .getPublicUrl(filePath);

        // 3. Save to database using Admin Client (Bypasses RLS issues)
        const { data: dbData, error: dbError } = await supabaseAdmin
            .from('media')
            .insert({
                filename: filePath.split('/').pop(),
                original_filename: originalFilename || file.name,
                file_path: filePath,
                public_url: publicUrl,
                mime_type: mimeType,
                file_size: fileSize,
                width: width,
                height: height,
                alt_text: altText || originalFilename?.replace(/\.[^/.]+$/, '') || '',
                title: title || '',
                folder: folder,
                usage_count: 0
            })
            .select()
            .single();

        if (dbError) {
            logger.error('Database insertion error:', dbError);
            // We don't necessarily need to rollback storage if DB fails, 
            // but we should report the error.
            return NextResponse.json(
                { error: `Database error: ${dbError.message}`, partialSuccess: true, publicUrl },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            publicUrl,
            filePath,
            mediaItem: dbData
        });
    } catch (error: any) {
        logger.error('API Upload error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
