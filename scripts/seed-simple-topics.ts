
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Simple topic seeds - system will auto-generate SEO titles
// Using only existing categories to avoid constraint errors
const SIMPLE_TOPICS = [
    { topic: "tax saving ELSS funds comparison 2026", category: "tax-planning" },
    { topic: "best mutual funds for 5 year goals", category: "mutual-funds" },
    { topic: "credit card for airport lounge access list", category: "credit-cards" },
    { topic: "term insurance claim settlement ratio 2026", category: "insurance" },
    { topic: "best SIP plans for high returns", category: "mutual-funds" },
    { topic: "personal loan low interest rate comparison", category: "personal-loans" },
    { topic: "NPS vs PPF vs EPF calculator guide", category: "retirement" },
    { topic: "how to open demat account step by step", category: "investing-basics" }
];

async function seedSimpleTopics() {
    console.log('🌱 Seeding Simple Topics (SEO titles will auto-generate)...');

    // 1. Ensure Author
    let author_id: string | undefined;
    const { data: authors } = await supabase.from('authors').select('id').limit(1);
    
    if (authors && authors.length > 0) {
        author_id = authors[0].id;
    } else {
        console.log('   Creating System Author...');
        const { data: newAuthor, error: authError } = await supabase.from('authors').insert({
            name: 'System AI',
            role: 'Editor',
            bio: 'Automated Content Generator'
        }).select().single();
        if (authError) { console.error('Failed to create author:', authError); return; }
        author_id = newAuthor.id;
    }

    // 2. Ensure Categories
    const categoriesMap: Record<string, string> = {};
    const uniqueCats = [...new Set(SIMPLE_TOPICS.map(t => t.category))];
    
    for (const catSlug of uniqueCats) {
        const { data: existing } = await supabase.from('categories').select('id').eq('slug', catSlug).single();
        
        if (existing) {
            categoriesMap[catSlug] = existing.id;
        } else {
            console.log(`   Creating category: ${catSlug}`);
            const { data: newCat, error: createErr } = await supabase.from('categories').insert({
                name: catSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                slug: catSlug,
                description: `Articles about ${catSlug.replace('-', ' ')}`
            }).select().single();
            
            if (createErr) {
                 console.error(`   Failed to create category ${catSlug}:`, createErr.message); 
                 continue;
            }
            categoriesMap[catSlug] = newCat.id;
        }
    }

    // 3. Insert Simple Topics
    for (const t of SIMPLE_TOPICS) {
         const category_id = categoriesMap[t.category];
         if (!category_id) {
             console.error(`   Skipping "${t.topic}" (Category ${t.category} missing)`);
             continue;
         }

         const { error } = await supabase.from('articles').insert({
             title: t.topic, // Simple topic - will be SEO-optimized during processing
             slug: t.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
             status: 'planned',
             author_id: author_id,
             category_id: category_id
         });

         if (error) {
             if (error.code === '23505') console.log(`   🔸 "${t.topic}" already queued.`);
             else console.error(`   ❌ Failed to queue "${t.topic}":`, error.message);
         } else {
             console.log(`   ✅ Queued: "${t.topic}" (SEO title will auto-generate)`);
         }
    }
    console.log('\n✨ Done! Run the worker to see SEO-optimized titles in action.');
}

seedSimpleTopics();
