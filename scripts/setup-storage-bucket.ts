/**
 * Setup Supabase Storage Bucket for Article Images
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupStorageBucket() {
    console.log('🗄️  Setting up Supabase storage bucket\n');
    
    try {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'article-images');
        
        if (bucketExists) {
            console.log('✅ Bucket "article-images" already exists');
        } else {
            // Create bucket
            const { data, error } = await supabase.storage.createBucket('article-images', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
            });
            
            if (error) {
                throw error;
            }
            
            console.log('✅ Created bucket "article-images"');
        }
        
        // Set up folder structure
        console.log('\n📁 Folder structure:');
        console.log('   article-images/');
        console.log('   ├── featured/     (featured images)');
        console.log('   ├── inline/       (inline images)');
        console.log('   └── social/       (social media versions)');
        
        console.log('\n✅ Storage setup complete!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

setupStorageBucket();
