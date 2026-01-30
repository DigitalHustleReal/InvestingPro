/**
 * Simple DB Query - Fetch one draft article and show its content fields
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, status, quality_score, content, body_html, excerpt')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.log('ERROR:', error.message);
        return;
    }

    console.log('=== DRAFT ARTICLE ANALYSIS ===');
    console.log('ID:', data.id);
    console.log('Title:', data.title);
    console.log('Slug:', data.slug);
    console.log('Status:', data.status);
    console.log('Quality Score:', data.quality_score);
    console.log('');
    console.log('--- Content Field ---');
    console.log('Length:', data.content?.length || 0, 'chars');
    console.log('First 300 chars:', data.content?.substring(0, 300) || 'EMPTY/NULL');
    console.log('');
    console.log('--- body_html Field ---');
    console.log('Length:', data.body_html?.length || 0, 'chars');
    console.log('First 300 chars:', data.body_html?.substring(0, 300) || 'EMPTY/NULL');
    console.log('');
    console.log('--- Excerpt Field ---');
    console.log('Excerpt:', data.excerpt || 'EMPTY/NULL');
}

main();
