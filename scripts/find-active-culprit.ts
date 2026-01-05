import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import fs from 'fs';

async function findTheActiveCulprit() {
    console.log('Searching for RLS policies referencing "active"...');
    const { data: policies, error: pError } = await supabase
        .from('pg_policies')
        .select('schemaname, tablename, policyname, qual, with_check');
    
    if (policies) {
        const suspicious = policies.filter(p => 
            (p.qual && p.qual.includes('active')) || 
            (p.with_check && p.with_check.includes('active'))
        );
        fs.writeFileSync('culprit_found.json', JSON.stringify(suspicious, null, 2));
        console.log(`Found ${suspicious.length} suspicious policies.`);
    }

    console.log('\nSearching for Triggers...');
    // We can't see trigger definition easily via Supabase Client without custom RPC,
    // so let's try to look at table names that might have triggers.
    const { data: triggers } = await supabase.from('pg_trigger').select('tgname');
    console.log('Total Triggers:', triggers?.length);

    console.log('\nTesting glossary_terms insertion with direct columns...');
    const { error } = await supabase.from('glossary_terms').insert({
        term: 'Test ' + Date.now(),
        slug: 'test-' + Date.now(),
        category: 'investing',
        definition: 'test'
    });
    
    if (error) {
        console.log('Error Message:', error.message);
        console.log('Error Details:', JSON.stringify(error, null, 2));
    }
}

findTheActiveCulprit().catch(console.error);
