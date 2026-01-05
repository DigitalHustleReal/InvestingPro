import { createServiceClient } from '../lib/supabase/service';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkSchema() {
    const supabase = createServiceClient();
    
    console.log('--- Table Check: glossary_terms ---');
    const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'glossary_terms' });
    
    if (colError) {
        // RPC might not exist, try another way
        console.log('RPC get_table_columns failed, trying raw query via select...');
        const { data, error } = await supabase.from('glossary_terms').select('*').limit(1);
        if (error) {
            console.error('❌ Table glossary_terms error:', error.message);
        } else {
            console.log('✅ Table glossary_terms accessible.');
            if (data.length > 0) {
                console.log('Columns found:', Object.keys(data[0]));
            } else {
                console.log('Table is empty, checking schema via metadata if possible...');
            }
        }
    }
}

checkSchema().catch(console.error);
