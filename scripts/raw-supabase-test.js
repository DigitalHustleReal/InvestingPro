const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function run() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('URL:', url);
    console.log('Key length:', key ? key.length : 0);

    const supabase = createClient(url, key);

    console.log('Running select count...');
    const { data, error, count } = await supabase
        .from('glossary_terms')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Select error:', error);
    } else {
        console.log('Count:', count);
    }

    console.log('Running test insert...');
    const { data: insData, error: insError } = await supabase
        .from('glossary_terms')
        .insert({
            term: 'Raw Test',
            slug: 'raw-test-' + Date.now(),
            category: 'test',
            definition: 'raw definition'
        })
        .select();

    if (insError) {
        console.error('Insert error:', insError);
        console.error('Full serializable error:', JSON.stringify(insError, null, 2));
    } else {
        console.log('Insert success!', insData);
    }
}

run().catch(console.error);
