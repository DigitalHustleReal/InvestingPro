
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanup() {
    console.log('🧹 Cleaning up test products...');
    const { error } = await supabase
        .from('products')
        .delete()
        .ilike('name', 'Test Auto Image%');

    if (error) {
        console.error('Error cleaning up:', error);
    } else {
        console.log('✅ Cleanup complete.');
    }
}

cleanup();
