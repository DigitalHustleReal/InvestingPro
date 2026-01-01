
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

async function checkAll() {
    const { data, error } = await supabase.from('articles').select('title, slug, created_at').order('created_at', { ascending: false }).limit(10);
    if (error) console.error(error);
    else console.log("Recent articles:", JSON.stringify(data, null, 2));
}
checkAll();
