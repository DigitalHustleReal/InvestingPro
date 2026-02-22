const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSoftDelete() {
    console.log('🔍 Checking for article "abc" (including soft-deleted)...');
    const { data: articles, error } = await supabase
        .from('articles')
        .select('id, title, uuid:id, deleted_at, deleted_by')
        .or('title.eq.abc,slug.eq.abc');
        
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    console.log('✅ Found:', JSON.stringify(articles, null, 2));
}

checkSoftDelete();
