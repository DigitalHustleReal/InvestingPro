const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyTrash() {
    console.log('🔍 Checking for article "abc"...');
    let { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, deleted_at')
        .or('title.eq.abc,slug.eq.abc');
        
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    if (articles.length === 0) {
        console.log('❌ Article "abc" not found.');
        return;
    }

    const article = articles[0];
    console.log('✅ Current state:', JSON.stringify(article, null, 2));

    if (article.deleted_at) {
        console.log('🔄 Restoring article...');
        const { error: restoreError } = await supabase
            .from('articles')
            .update({ deleted_at: null, deleted_by: null })
            .eq('id', article.id);
            
        if (restoreError) {
            console.error('❌ Restore error:', restoreError);
        } else {
            console.log('✅ Restore success!');
        }
    } else {
        console.log('🗑️ Soft-deleting article...');
        const { error: deleteError } = await supabase
            .from('articles')
            .delete()
            .eq('id', article.id);
            
        if (deleteError) {
            console.error('❌ Delete error:', deleteError);
        } else {
            console.log('✅ Soft-delete success (triggered by DB trigger)!');
        }
    }

    // Check final state
    const { data: finalArticles } = await supabase
        .from('articles')
        .select('id, title, deleted_at')
        .eq('id', article.id);
        
    console.log('🏁 Final state:', JSON.stringify(finalArticles[0], null, 2));
}

verifyTrash();
