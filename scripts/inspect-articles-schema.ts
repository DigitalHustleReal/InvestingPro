
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkArticlesSchema() {
  console.log('🔍 Checking articles table schema...');
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Found article record. Keys:', Object.keys(data[0]));
  } else {
    console.log('⚠️ No articles found, cannot infer schema.');
  }
}

checkArticlesSchema();
