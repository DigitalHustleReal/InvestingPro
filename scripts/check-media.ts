
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMedia() {
    console.log('Checking media table...');
    try {
        const { data, error, count } = await supabase
            .from('media')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error querying media table:', error);
        } else {
            console.log('Media table exists. Count:', count);
        }
        
        // Try to fetch one
        const { data: rows, error: fetchError } = await supabase
            .from('media')
            .select('*')
            .limit(1);
            
        if (fetchError) {
             console.error('Error fetching rows:', fetchError);
        } else {
            console.log('Fetched rows:', rows?.length);
            if (rows && rows.length > 0) {
                console.log('First row:', rows[0]);
            }
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkMedia();
