
const fs = require('fs');
if (fs.existsSync('.env.local')) {
    const env = fs.readFileSync('.env.local', 'utf8');
    env.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findArticle() {
    const { data, error } = await supabase.from('articles')
        .select('id, title, slug, status, created_at')
        .ilike('title', '%Mutual Fund%')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (error) {
        console.error(error);
    } else {
        console.log("Found Mutual Fund articles:", JSON.stringify(data, null, 2));
    }
}
findArticle();
