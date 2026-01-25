
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
    console.log("🔍 Verifying CMS Output...");
    
    // Check Pipeline Runs
    const { data: runs, error: runError } = await supabase
        .from('pipeline_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
        
    if (runError) console.error("Pipeline Error:", runError.message);
    else console.log("Recent Pipeline Run:", runs?.length ? `${runs[0].status} (${runs[0].id})` : "None");

    // Check Articles
    const { count, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
        
    if (countError) console.error("Article Error:", countError.message);
    else console.log("Total Articles:", count);

    // List recent titles
    const { data: articles } = await supabase
        .from('articles')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
        
    console.log("Recent Articles:");
    articles?.forEach(a => console.log(`- ${a.title} (${a.created_at})`));
}

main();
