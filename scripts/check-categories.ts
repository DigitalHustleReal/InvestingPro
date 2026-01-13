
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkCategories() {
    const { data, error } = await supabase
        .from('products')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    const categories = Array.from(new Set(data.map(p => p.category)));
    console.log('Distinct Categories:');
    categories.forEach(c => console.log(`- "${c}"`));
}

checkCategories();
