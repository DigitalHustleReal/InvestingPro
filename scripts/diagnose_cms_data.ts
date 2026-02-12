
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
  console.log('🔍 Starting CMS Data Diagnosis...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);

  // 1. Check Table Counts
  console.log('\n📊 Checking Table Counts:');
  const tables = ['articles', 'reviews', 'products', 'pipeline_runs', 'user_profiles', 'user_roles'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ ${table}: Error - ${error.message}`);
    } else {
      console.log(`✅ ${table}: ${count} rows`);
    }
  }

  // 2. Check RPC 'get_admin_dashboard_stats'
  console.log('\n⚙️ Testing RPC "get_admin_dashboard_stats":');
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_dashboard_stats');
  
  if (rpcError) {
    console.error(`❌ RPC Failed: ${rpcError.message}`);
    console.log('   -> Hint: The migration "20260101_rpc_functions.sql" might not be applied.');
  } else {
    console.log('✅ RPC Success! Returned data:');
    console.dir(rpcData, { depth: null, colors: true });
  }

  // 3. Check Recent Activity
  console.log('\n🕒 Checking Recent Activity (Articles):');
  const { data: recentArticles, error: articleError } = await supabase
    .from('articles')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  if (articleError) {
    console.error(`❌ Failed to fetch recent articles: ${articleError.message}`);
  } else if (recentArticles?.length === 0) {
    console.log('⚠️  No articles found.');
  } else {
    recentArticles?.forEach(a => console.log(`   - ${a.status.toUpperCase()}: "${a.title}" (${new Date(a.created_at).toLocaleDateString()})`));
  }

  console.log('\n🏁 Diagnosis Complete.');
}

diagnose().catch(console.error);
