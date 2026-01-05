import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspectTable() {
    console.log('--- Inspecting glossary_terms ---');
    
    // 1. Check Policies
    console.log('\n[POLICIES]');
    const { data: policies, error: pError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'glossary_terms');
    
    if (pError) console.error('Error fetching policies:', pError);
    else console.log(JSON.stringify(policies, null, 2));

    // 2. Check column names
    console.log('\n[COLUMNS]');
    const { data: cols, error: cError } = await supabase
        .from('glossary_terms')
        .select('*')
        .limit(0); // Get headers
    
    if (cError) {
        console.error('Error fetching columns:', cError.message);
    } else {
        // Unfortunately Supabase client doesn't give columns directly if empty
        console.log('Select successful, columns might exist.');
    }

    // 3. Try to find the trigger/constraint mentioned in the error
    // Error was: column "active" does not exist. Perhaps you meant "glossary_terms.is_active"
}

inspectTable().catch(console.error);
