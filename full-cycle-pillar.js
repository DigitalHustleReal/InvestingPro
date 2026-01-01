
const fs = require('fs');
// Load Env
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
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    const topic = "The Ultimate Guide to Mutual Funds in India (2026): Your Path to Financial Freedom";
    const keywords = ["mutual funds", "sip", "tax saving", "best funds 2026", "wealth creation"];
    
    console.log(`[CYCLE] 1. Requesting Generation via API Route (Server-Side)...`);
    
    try {
        const res = await fetch('http://localhost:3000/api/admin/generate-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, keywords, tone: 'professional' })
        });
        
        if (!res.ok) {
            const err = await res.text();
            throw new Error(`API Error ${res.status}: ${err}`);
        }
        
        const generated = await res.json();
        console.log(`[CYCLE] 2. Generation Success! Title: "${generated.title}"`);
        console.log(`[CYCLE]    Provider Used: ${generated.provider}`);
        
        // Prepare DB Insert (Mimicking ArticleService)
        const slug = generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const payload = {
            title: generated.title,
            slug: slug,
            excerpt: generated.excerpt,
            content: generated.content,
            body_markdown: generated.content,
            body_html: generated.content, // Raw markdown for now
            category: 'mutual-funds', // Hardcoded for this pillar
            tags: generated.tags || keywords,
            seo_title: generated.seo_title,
            seo_description: generated.seo_description,
            ai_generated: true,
            ai_metadata: generated.ai_metadata,
            status: 'published', // PUBLISH IMMEDIATELY
            published_at: new Date().toISOString(),
            featured_image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=1600' // Placeholder High Quality
        };
        
        console.log(`[CYCLE] 3. Inserting into Database...`);
        const { data, error } = await supabase.from('articles').insert(payload).select().single();
        
        if (error) throw error;
        
        console.log(`[CYCLE] 4. PUBLISHED! ID: ${data.id}`);
        console.log(`[CYCLE] 5. Verifying Public URL...`);
        
        const publicUrl = `http://localhost:3000/articles/${data.slug}`;
        console.log(`[CYCLE]    Target: ${publicUrl}`);
        
        const check = await fetch(publicUrl);
        if (check.status === 200) {
            console.log(`[CYCLE] ✅ Public Page is LIVE (200 OK)`);
        } else {
            console.log(`[CYCLE] ⚠️ Public Page returned ${check.status}`);
        }
        
    } catch (e) {
        console.error(`[CYCLE] 💥 FAILED:`, e.message);
    }
}

run();
