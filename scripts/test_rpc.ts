
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testRPC() {
  const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
  
  if (error) {
    console.error('RPC_ERROR:', error.message);
  } else {
    console.log('RPC_SUCCESS:', JSON.stringify(data, null, 2));
  }
}

testRPC().catch(err => console.error('SCRIPT_ERROR:', err));
