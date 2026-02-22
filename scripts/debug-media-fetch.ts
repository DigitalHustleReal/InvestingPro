
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMediaTableAccess() {
    console.log('Testing access to "media" table...');
    try {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error accessing media table:', error);
        } else {
            console.log('Success! Media table exists and is accessible.');
            console.log('Data sample:', data);
        }

        // Also check storage buckets
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        console.log('Storage Buckets:', buckets, bucketError);

    } catch (err) {
        console.error('Script error:', err);
    }
}

testMediaTableAccess();
