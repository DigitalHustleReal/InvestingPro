import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const TOPICS = [
    "tax saving strategies for freelancers",
    "mutual fund SIP calculator guide",
    "credit card cashback maximization",
    "term insurance vs endowment plans",
    "home loan EMI reduction tips"
];

async function seedFinal() {
    console.log('🌱 Seeding Queue (FINAL - Working Version)...\n');

    // Get a sample article to copy structure
    const { data: template } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'draft')
        .limit(1)
        .single();

    if (!template) {
        console.error('❌ No template article found. Database needs at least one article.');
        return;
    }

    console.log(`✅ Using template structure from existing article\n`);

    let queued = 0;

    for (const topic of TOPICS) {
        const payload = {
            ...template,
            id: undefined,
            created_at: undefined,
            updated_at: undefined,
            views: 0,
            published_at: null,
            title: topic,
            slug: `queue-${topic.replace(/\s+/g, '-')}-${Date.now()}`,
            content: null, // Empty content signals "needs generation"
            excerpt: null,
            status: 'draft' // Use 'draft' instead of 'planned'
        };

        // Remove auto-generated fields
        delete payload.id;
        delete payload.created_at;
        delete payload.updated_at;

        const { error } = await supabase.from('articles').insert(payload);

        if (error) {
            console.log(`❌ Failed: ${topic} - ${error.message}`);
        } else {
            console.log(`✅ Queued: ${topic}`);
            queued++;
        }

        await new Promise(r => setTimeout(r, 100));
    }

    console.log(`\n✨ Success! Queued ${queued}/${TOPICS.length} topics`);
    console.log('\n🚀 Next: Update worker to process drafts with null content');
}

seedFinal();
