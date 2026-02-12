import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkStorage() {
    console.log('--- CHECKING STORAGE CONFIGURATION ---');

    // 1. Check all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
        console.error('Error fetching buckets:', bucketsError.message);
        return;
    }

    console.log('Buckets found:');
    buckets.forEach(b => {
        console.log(`- ${b.name} (Public: ${b.public}, Max Size: ${b.file_size_limit})`);
    });

    const mediaBucket = buckets.find(b => b.name === 'media');
    if (!mediaBucket) {
        console.error('\n[CRITICAL ERROR] "media" bucket DOES NOT EXIST!');
        console.log('Action needed: Create a public bucket named "media" in Supabase Dashboard.');
    } else {
        console.log('\n"media" bucket exists.');
        
        // 2. Try a test upload with service role
        console.log('Attempting test upload with service_role...');
        const testFileContent = 'test content';
        const testFilePath = 'test-connection.txt';
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(testFilePath, testFileContent, {
                contentType: 'text/plain',
                upsert: true
            });

        if (uploadError) {
            console.error('Test upload FAILED:', uploadError.message);
        } else {
            console.log('Test upload SUCCESSFUL.');
            
            // Cleanup
            await supabase.storage.from('media').remove([testFilePath]);
            console.log('Test file removed.');
        }
    }

    console.log('\n--- SCAN COMPLETE ---');
}

checkStorage().catch(console.error);
