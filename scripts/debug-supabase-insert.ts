import { createServiceClient } from '../lib/supabase/service';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugInsert() {
    console.log('Testing direct insertion into glossary_terms...');
    const supabase = createServiceClient();
    
    const testTerm = {
        term: 'Debug Term ' + Date.now(),
        slug: 'debug-term-' + Date.now(),
        category: 'test',
        definition: 'Test definition',
        detailed_explanation: 'Test explanation',
        example: 'Test example',
        related_terms: ['test'],
        search_keywords: ['test'],
        ai_generated: true
    };

    console.log('Attempting insert with:', testTerm.term);
    const { data, error, status, statusText } = await supabase
        .from('glossary_terms')
        .insert(testTerm)
        .select();

    if (error) {
        console.error('❌ INSERT FAILED!');
        console.error('Status:', status, statusText);
        console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ INSERT SUCCESS!');
        console.log('Response data:', JSON.stringify(data, null, 2));
    }
}

debugInsert().catch(console.error);
