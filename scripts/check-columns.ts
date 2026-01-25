
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  console.log('🔍 Checking authors table schema...');
  
  // Try to insert a dummy record to see what errors we get, or just select one
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error selecting from authors:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Found authors record. Keys:', Object.keys(data[0]));
  } else {
    console.log('⚠️ No content in authors table to inspect keys. Attempting to list via RPC or error inference.');
    // If empty, we can't easily see keys. 
    // Let's try to upsert a dummy record with a known bad column to force a schema error listing valid columns? 
    // Or just trust the migration reading from earlier?
    // Actually, migration said 'active'. 
  }
}

checkSchema();
