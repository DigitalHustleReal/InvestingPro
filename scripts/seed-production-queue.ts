import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Simple topic seeds - will auto-generate SEO titles
const SIMPLE_TOPICS = [
    "tax saving strategies for salaried employees",
    "mutual fund SIP investment guide",
    "credit card rewards optimization",
    "term insurance buying checklist",
    "home loan prepayment calculator",
    "retirement planning for 30s",
    "stock market basics for beginners",
    "fixed deposit vs mutual funds",
    "personal loan eligibility criteria",
    "health insurance claim process"
];

async function seedProductionQueue() {
    console.log('🌱 Seeding Production Queue with Simple Topics...\n');

    // 1. Get existing categories
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, slug, name');
    
    if (catError || !categories || categories.length === 0) {
        console.error('❌ No categories found. Please create categories first.');
        return;
    }

    console.log(`📂 Found ${categories.length} categories:`);
    categories.forEach(c => console.log(`   - ${c.slug}`));
    console.log('');

    // 2. Get or create author
    let author_id: string;
    const { data: authors } = await supabase.from('authors').select('id').limit(1);
    
    if (authors && authors.length > 0) {
        author_id = authors[0].id;
        console.log('✅ Using existing author\n');
    } else {
        console.log('📝 Creating System Author...');
        const { data: newAuthor, error: authError } = await supabase.from('authors').insert({
            name: 'System AI',
            role: 'Editor',
            bio: 'Automated Content Generator'
        }).select().single();
        
        if (authError) {
            console.error('❌ Failed to create author:', authError.message);
            return;
        }
        author_id = newAuthor.id;
        console.log('✅ Author created\n');
    }

    // 3. Category mapping (smart matching)
    const categoryMap: Record<string, string> = {};
    categories.forEach(cat => {
        categoryMap[cat.slug] = cat.id;
    });

    // Helper: Find best category for topic
    function findBestCategory(topic: string): string {
        const t = topic.toLowerCase();
        
        // Exact matches
        if (t.includes('tax') && categoryMap['tax-planning']) return categoryMap['tax-planning'];
        if (t.includes('tax') && categoryMap['taxes']) return categoryMap['taxes'];
        if (t.includes('mutual fund') && categoryMap['mutual-funds']) return categoryMap['mutual-funds'];
        if (t.includes('credit card') && categoryMap['credit-cards']) return categoryMap['credit-cards'];
        if (t.includes('insurance') && categoryMap['insurance']) return categoryMap['insurance'];
        if (t.includes('loan') && categoryMap['personal-loans']) return categoryMap['personal-loans'];
        if (t.includes('loan') && categoryMap['loans']) return categoryMap['loans'];
        if (t.includes('retirement') && categoryMap['retirement']) return categoryMap['retirement'];
        if (t.includes('stock') && categoryMap['stocks']) return categoryMap['stocks'];
        if (t.includes('fixed deposit') && categoryMap['fixed-deposits']) return categoryMap['fixed-deposits'];
        
        // Fallback to first available
        return categories[0].id;
    }

    // 4. Insert topics
    let queued = 0;
    let skipped = 0;

    for (const topic of SIMPLE_TOPICS) {
        const category_id = findBestCategory(topic);
        const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const { error } = await supabase.from('articles').insert({
            title: topic,
            slug: `${slug}-${Date.now()}`, // Add timestamp to avoid duplicates
            status: 'planned',
            author_id: author_id,
            category_id: category_id
        });

        if (error) {
            console.log(`   🔸 Skipped: "${topic}" (${error.message})`);
            skipped++;
        } else {
            console.log(`   ✅ Queued: "${topic}"`);
            queued++;
        }
    }

    console.log(`\n✨ Done! Queued ${queued} topics, skipped ${skipped}`);
    console.log('\n🚀 Run worker: npx tsx scripts/process-planned-queue.ts');
}

seedProductionQueue();
