import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testImageUpload() {
    console.log('--- TESTING IMAGE UPLOAD (Service Role) ---');

    // Create a tiny 1x1 transparent PNG buffer
    const buf = Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    
    const fileName = `test-image-${Date.now()}.png`;
    const filePath = `uploads/${fileName}`;

    console.log(`Uploading ${fileName}...`);

    const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, buf, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Upload FAILED:', error.message);
        if (error.message.includes('Quota exceeded')) {
             console.log('SUGGESTION: Supabase storage quota exceeded.');
        }
    } else {
        console.log('Upload SUCCESSFUL:', data.path);
        
        // Try to insert into the media table too (since MediaService does this)
        console.log('Inserting into media table...');
        const { error: dbError } = await supabase
            .from('media')
            .insert({
                filename: fileName,
                original_filename: 'test.png',
                file_path: filePath,
                public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${filePath}`,
                mime_type: 'image/png',
                file_size: buf.length,
                width: 1,
                height: 1,
                folder: 'uploads'
            });

        if (dbError) {
            console.error('DB Insert FAILED:', dbError.message);
        } else {
            console.log('DB Insert SUCCESSful.');
        }

        // Cleanup
        await supabase.storage.from('media').remove([filePath]);
        console.log('Cleanup: Test image removed from storage.');
    }

    console.log('\n--- TEST COMPLETE ---');
}

testImageUpload().catch(console.error);
