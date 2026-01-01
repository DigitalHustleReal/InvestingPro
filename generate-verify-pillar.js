
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
// Use relative path to avoid alias issues
const { generateArticleCore } = require('./lib/automation/article-generator');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const topic = "The Ultimate Guide to Mutual Funds in India (2026): Your Path to Financial Freedom";
    console.log("----------------------------------------------------------------");
    console.log(`[SCRIPT] Starts generation for: "${topic}"`);
    
    try {
        const result = await generateArticleCore(topic, (msg) => {
             // Suppress verbose logs or keep them minimal
             if (msg.includes('SUCCESS') || msg.includes('ERROR') || msg.includes('Published')) {
                 console.log(`[FACTORY] ${msg}`);
             }
        });
        
        if (result.success) {
            console.log(`[SCRIPT] Generation SUCCESS. Slug: ${result.article.slug}`);
            
            // Verify DB immediately
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', result.article.id)
                .single();
                
            if (data) {
                console.log(`[VERIFY] DB Record Found: ID=${data.id}, Status=${data.status}`);
                console.log(`[VERIFY] Public URL: http://localhost:3000/articles/${data.slug}`);
            } else {
                console.error(`[VERIFY] ❌ Record NOT found in DB despite success result.`);
            }
        } else {
            console.error(`[SCRIPT] Generation FAILED: ${result.error}`);
        }
    } catch (e) {
        console.error(`[SCRIPT] Exception: ${e.message}`);
        console.error(e.stack);
    }
}

run();
