import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
    console.log('--- DB SCHEMA AUDIT ---');
    
    // Check tables
    const { data: tables, error: tableError } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
    });

    if (tableError) {
        console.error('Error listing tables:', tableError);
        return;
    }

    const tableNames = (tables as any[]).map(t => t.tablename);
    const criticalTables = ['articles', 'authors', 'media', 'user_roles', 'article_versions', 'seo_metadata'];
    
    console.log('\nTable Status:');
    criticalTables.forEach(t => {
        console.log(`${t.padEnd(20)}: ${tableNames.includes(t) ? 'EXISTS' : 'MISSING'}`);
    });

    // Check columns for articles
    const { data: cols, error: colError } = await supabase.rpc('exec_sql_query', {
        sql_query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'articles'"
    });

    if (colError) {
        console.error('Error listing columns:', colError);
        return;
    }

    const colNames = (cols as any[]).map(c => c.column_name);
    const criticalCols = ['author_id', 'editor_id', 'content_type', 'is_ai_generated', 'featured', 'category'];
    
    console.log('\nArticles Column Status:');
    criticalCols.forEach(c => {
        console.log(`${c.padEnd(20)}: ${colNames.includes(c) ? 'EXISTS' : 'MISSING'}`);
    });

    console.log('\n--- AUDIT COMPLETE ---');
}

checkSchema();
