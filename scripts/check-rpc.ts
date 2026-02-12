
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRpc() {
  console.log('Checking exec_sql RPC...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: 'SELECT 1' });
    if (error) {
      console.error('RPC Failed:', error);
      if (error.message.includes('function "exec_sql" does not exist')) {
          console.log('CONCLUSION: exec_sql does NOT exist.');
      }
    } else {
      console.log('RPC Success! Data:', data);
      console.log('CONCLUSION: exec_sql EXISTS and works.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkRpc();
