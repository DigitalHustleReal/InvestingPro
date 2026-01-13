
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import slugify from 'slugify';
import { createClient } from '@supabase/supabase-js';
import { GLOSSARY_TERMS } from '../lib/data/glossary-terms';

// Relative path since we are in scripts/
const { api } = require('../lib/api');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateGlossaryTerm(term: string) {
    // Use flat slug to avoid Next.js routing issues (unless [...slug] is used)
    const slug = `what-is-${slugify(term, { lower: true, strict: true })}`;
    
    // Check existence
    const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single();
    if (existing) {
        console.log(`⏩ Skipping ${term} (Already exists)`);
        return;
    }

    console.log(`📘 Defining: ${term}...`);

    const prompt = `
    ROLE: You are an expert financial lexicographer modeled after Investopedia.
    GOAL: Write a precise, high-authority glossary definition for: "${term}".
    CONTEXT: Indian Financial Markets (SEBI, RBI, INR context).

    STRUCTURE (Return valid JSON):
    {
        "content": "<HTML CONTENT HERE>"
    }

    HTML STRUCTURE:
    <h1>What is ${term}?</h1>
    <p class="definition"><strong>Definition:</strong> [1-2 sentences, Investopedia style].</p>
    
    <div class="key-takeaways bg-slate-50 p-4 rounded-lg my-4">
        <h3>Key Takeaways</h3>
        <ul>
            <li>[Point 1]</li>
            <li>[Point 2]</li>
            <li>[Point 3]</li>
        </ul>
    </div>

    <h2>Understanding ${term}</h2>
    <p>[Detailed explanation, 2-3 paragraphs. Simple language.]</p>

    <h3>Example of ${term}</h3>
    <p>[Real world example using Indian Rupees or Companies].</p>

    <h3>Why it Matters</h3>
    <p>[Significance for investors].</p>
    `;

    try {
        const result = await api.integrations.Core.InvokeLLM({
            prompt: prompt,
            operation: 'generate_glossary',
            contextData: { term }
        });

        let html = result.content;
        // Clean JSON if needed
        try {
            const parsed = JSON.parse(result.content);
            if (parsed.content) html = parsed.content;
        } catch(e) {}

        const now = new Date().toISOString(); 
        
        const payload = {
            title: `What is ${term}?`,
            slug: slug,
            category: 'glossary',
            status: 'published',
            content: html,
            body_html: html,
            published_at: now,
            created_at: now,
            author_name: 'InvestingPro Dictionary',
            seo_title: `What is ${term}? Meaning, Definition & Example (2026)`,
            seo_description: `Learn what ${term} means in Indian finance. Simple definition, examples, and key takeaways for investors. Updated 2026.`,
            quality_score: 95, // Trusted definition
            read_time: 2 // Correct column name
        };

        const { error } = await supabase.from('articles').insert(payload);
        if (error) {
            console.error(`❌ DB Error for ${term}:`, error.message);
        } else {
            console.log(`✅ Published: ${term}`);
        }

    } catch (e: any) {
        console.error(`❌ Failed to generate ${term}:`, e.message);
    }
}

async function main() {
    console.log(`📚 Starting Glossary Generator (${GLOSSARY_TERMS.length} terms)`);
    
    // Process conservatively to avoid 429
    const BATCH_SIZE = 1;
    for (let i = 0; i < GLOSSARY_TERMS.length; i += BATCH_SIZE) {
        const batch = GLOSSARY_TERMS.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(term => generateGlossaryTerm(term)));
        console.log(`⏸️  Batch complete. Waiting 15s...`);
        await new Promise(r => setTimeout(r, 15000));
    }
}

main();
