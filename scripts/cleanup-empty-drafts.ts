/**
 * Delete empty draft articles and prepare for regeneration
 */

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function cleanupEmptyDrafts() {
    console.log('====================================================');
    console.log('🧹 CLEANUP: Deleting Empty Draft Articles');
    console.log('====================================================\n');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find all empty drafts (content is null or empty string)
    console.log('📋 Finding empty draft articles...');
    const { data: emptyDrafts, error: findError } = await supabase
        .from('articles')
        .select('id, title, slug, status, quality_score, created_at')
        .eq('status', 'draft')
        .or('content.is.null,content.eq.');
    
    if (findError) {
        console.error('❌ Error finding drafts:', findError.message);
        return;
    }

    if (!emptyDrafts || emptyDrafts.length === 0) {
        console.log('✅ No empty draft articles found. Nothing to delete.');
        return;
    }

    console.log(`\n📊 Found ${emptyDrafts.length} empty draft articles:`);
    emptyDrafts.forEach((draft, i) => {
        console.log(`   ${i + 1}. "${draft.title}" (score: ${draft.quality_score}, created: ${draft.created_at})`);
    });

    // 2. Delete the empty drafts
    console.log(`\n🗑️ Deleting ${emptyDrafts.length} empty draft articles...`);
    const idsToDelete = emptyDrafts.map(d => d.id);
    
    const { error: deleteError } = await supabase
        .from('articles')
        .delete()
        .in('id', idsToDelete);

    if (deleteError) {
        console.error('❌ Error deleting drafts:', deleteError.message);
        return;
    }

    console.log(`✅ Successfully deleted ${emptyDrafts.length} empty draft articles.`);
    
    // 3. Verify deletion
    const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');
    
    console.log(`\n📊 Remaining draft articles: ${count || 0}`);
    console.log('\n====================================================');
    console.log('🎉 CLEANUP COMPLETE');
    console.log('====================================================');
    console.log('\nNext steps:');
    console.log('1. Run: npx tsx scripts/generate-category-guides.ts');
    console.log('2. Monitor for successful word count validation');
}

cleanupEmptyDrafts();
