import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createServiceClient } from '../lib/supabase/service';

async function count() {
    const supabase = createServiceClient();
    const { count, error } = await supabase.from('glossary_terms').select('*', { count: 'exact', head: true });
    console.log('Glossary Count:', count);
    if (error) console.error('Error:', error);
}

count().catch(console.error);
