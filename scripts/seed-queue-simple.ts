import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedTopics() {
    console.log('🌱 Seeding Queue (Simplified)...\n');

    // Get first available category and author (guaranteed to work)
    const { data: cat } = await supabase.from('categories').select('id, slug').limit(1).single();
    const { data: auth } = await supabase.from('authors').select('id').limit(1).single();

    if (!cat || !auth) {
        console.error('❌ No categories or authors found. Please set up database first.');
        return;
    }

    console.log(`Using category: ${cat.slug}`);
    console.log(`Using author: ${auth.id}\n`);

    const topics = [
        "tax saving strategies",
        "mutual fund investment guide",
        "credit card rewards tips",
        "insurance buying guide",
        "retirement planning basics"
    ];

    let success = 0;

    for (const topic of topics) {
        const { error } = await supabase.from('articles').insert({
            title: topic,
            slug: `${topic.replace(/\s+/g, '-')}-${Date.now()}`,
            status: 'planned',
            author_id: auth.id,
            category_id: cat.id
        });

        if (error) {
            console.log(`❌ Failed: ${topic} - ${error.message}`);
        } else {
            console.log(`✅ Queued: ${topic}`);
            success++;
        }

        // Small delay to ensure unique timestamps
        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n✨ Success! Queued ${success}/${topics.length} topics`);
    console.log('\n🚀 Next: npx tsx scripts/process-planned-queue.ts');
}

seedTopics();
