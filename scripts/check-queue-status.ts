
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkQueue() {
    console.log('🔍 Checking Content Factory Queue...');

    const { count, error } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'planned');

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`✅ Found ${count} articles in 'planned' status.`);
    }

    // Check Categories
    const { data: cats } = await supabase.from('categories').select('slug');
    console.log('Categories:', cats?.map(c => c.slug).join(', '));
}

checkQueue();
