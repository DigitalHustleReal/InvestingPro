import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

// Validations
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use Service Key for Worker to bypass RLS
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: Supabase credentials missing (url or service_role_key)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function processQueue() {
    try {
        console.log('🤖 Content Factory Worker Starting...');

        // Dynamic import to ensure dotenv loads first
        const { generateArticleCore } = await import('../lib/automation/article-generator');
        
        // 1. Fetch NEXT item to process
        // Criteria: status='draft' AND (content is null OR content is empty)
        // We prioritize items that are "planned"
        const { data: items, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, category, keywords')
            .eq('status', 'draft')
            .is('content', null)
            .limit(1);

        if (fetchError) {
             throw new Error(`Queue Fetch Error: ${fetchError.message}`);
        }

        if (!items || items.length === 0) {
            console.log('💤 Queue is empty. No drafts waiting for content.');
            process.exit(0);
        }

        const task = items[0];
        console.log(`🚀 Processing Task: "${task.title}" (ID: ${task.id})`);

        // 2. Generate Content using the Robust Core Generator
        // This will update the existing record because we pass updateId
        await generateArticleCore(
            task.title,
            console.log, // Redirect logs to stdout
            {
                dryRun: false,
                updateId: task.id, // UPDATE the existing draft
                categorySlug: task.category,
                // We let the generator determine word count based on SERP
                status: 'draft' 
            }
        );

        console.log('✅ Job Complete.');
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Worker Failed:', error.message || error);
        process.exit(1);
    }
}

processQueue();
