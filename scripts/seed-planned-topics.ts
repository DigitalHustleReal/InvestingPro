
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const TOPICS = [
    { title: "Best Credit Cards for Airport Lounge Access in India 2026", category: "credit-cards", keywords: ["lounge access", "travel credit cards", "airport lounge list"] },
    { title: "SIP vs Lumpsum: Which is Better for Volatile Markets?", category: "mutual-funds", keywords: ["sip calculator", "lumpsum investment", "market volatility"] },
    { title: "Term Insurance Checklist: 10 Things to Check Before Buying", category: "insurance", keywords: ["term plan", "claim settlement ratio", "riders"] },
    { title: "How to Save Tax on Salary Above 20 Lakhs", category: "tax", keywords: ["section 80c", "tax saving", "high income tax"] } // Changed "tax-planning" to "tax" to match simpler slug if needed, or stick to standard.
];

async function seedQueue() {
    console.log('🌱 Seeding Content Queue...');

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
    const categoriesMap: Record<string, string> = {}; // slug -> id
    
    // Unique categories from TOPICS
    const uniqueCats = [...new Set(TOPICS.map(t => t.category))];
    
    for (const catSlug of uniqueCats) {
        const { data: existing, error: fetchErr } = await supabase.from('categories').select('id').eq('slug', catSlug).single();
        
        if (existing) {
            categoriesMap[catSlug] = existing.id;
        } else {
            console.log(`   Creating category: ${catSlug}`);
            // Upsert or insert
            const { data: newCat, error: createErr } = await supabase.from('categories').insert({
                name: catSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                slug: catSlug,
                description: `Articles about ${catSlug.replace('-', ' ')}`
            }).select().single();
            
            if (createErr) {
                 // Maybe it exists but select failed? Recovers from race condition
                 console.error(`   Failed to create category ${catSlug}:`, createErr.message); 
                 continue;
            }
            categoriesMap[catSlug] = newCat.id;
        }
    }

    // 3. Insert Topics
    for (const t of TOPICS) {
         const category_id = categoriesMap[t.category];
         if (!category_id) {
             console.error(`   Skipping "${t.title}" (Category ${t.category} missing)`);
             continue;
         }

         const { error } = await supabase.from('articles').insert({
             title: t.title,
             slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''),
             status: 'planned', // This pushes to current "Factory Queue"
             keywords: t.keywords,
             author_id: author_id,
             category_id: category_id
         });

         if (error) {
             if (error.code === '23505') console.log(`   🔸 "${t.title}" already queued.`);
             else console.error(`   ❌ Failed to queue "${t.title}":`, error.message);
         } else {
             console.log(`   ✅ Queued: "${t.title}"`);
         }
    }
    console.log('Done!');
}

seedQueue();
